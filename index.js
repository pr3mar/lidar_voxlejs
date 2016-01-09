/**
 * Created by pr3mar on 12/26/15.
 * TODO: rearange the coordinates for faster loading of the chunks.
 * nalaganje sosednega kosa .las
 * kje se nahajas (v katerem kosu),
 * asinhrono
 */
// browserify -t brfs index.js > bundle.js

var fs = require('fs');
var util = require('util');
//require.extensions['.asc'] = function (module, filename) {
//    module.exports = fs.readFileSync(filename, 'utf8').split('\r\n');
//};
var Promise = require('bluebird');
Promise.config({
    longStackTraces: true,
    warnings: true
});
//var fileName = 'chunks/0.0.chunk';

if(!Promise) {
    console.log('get the damn library.');
}

load3DPoints()
    .then(initVoxelJS);

function load3DPoints() {
    var points = {};
    //var pointsPerTick = 100000;  // adjust for speed vs timeout
    var resolveFn;
    // ./chunks/0.0.chunk
    //var readData = fs.readFileSync('./chunks/TM1_463_102.asc', 'utf8').split('\r\n');
    var readData = fs.readFileSync('./terrain/463_102_terrain.asc', 'utf8').split('\n');
    var numPoints = readData.length;
    //var line = readData[0].split(';');
    //var translateX = parseFloat(line[0]);
    //var translateY = parseFloat(line[1]);
    //var translateZ = parseFloat(line[2]);

    function generatePoints() {
        var num = numPoints;
        //var num = Math.min(numPoints, pointsPerTick);
        //for(var ii = 0, count = 0; (ii < (readData.length - 1)) || (count < num); ++ii) {
        //    var currentRow = readData[ii].split(':');
        //    var y = currentRow[0];
        //    var currentRowXZ = currentRow[1].split(';');
        //    for(var jj = 0; jj < currentRowXZ.length - 1; jj++) {
        //        var xz = currentRowXZ[jj].split(',');
        //        var x = xz[0], z = xz[1];
        //        points[ x + ',' + y + ',' + z] = 1;
        //        ++count;
        //    }
        //}
        for(var ii = 0; ii < num; ++ii) {
            line = readData[ii].split(';');
            var x = parseFloat(line[0]);
            var y = parseFloat(line[1]);
            var z = Math.round(parseFloat(line[2]));
            points[x + ',' + y + ',' + z] = parseFloat(line[3]) + 1;//Math.floor(Math.random()  * 4) + 1;
        }

        numPoints -= num;
        if(numPoints) {
            setTimeout(generatePoints, 1);
        } else {
            resolveFn(points);
        }
    }

    return new Promise(function(resolve, reject) {
        resolveFn = resolve;
        generatePoints();
    })
}

function initVoxelJS(pointDB) {
    var createGame = require('voxel-engine');
    var game = createGame({
        materials: ['dirt', 'brick', ['grass', 'dirt', 'grass_dirt'], 'grass_dirt','grass' ],
        generate: function (x, y, z) {
            if (typeof pointDB[x + ',' + z + ',' + y] !== 'undefined') {
                return pointDB[x + ',' + z + ',' + y];
            } else return 0;
        },
        chunkSize: 16,
        chunkDistance: 4,
        worldOrigin: [500, 0, 500]
    });

    var container = document.body;
    var playerPositionContainerX = document.getElementById('x');
    var playerPositionContainerY = document.getElementById('y');
    var playerPositionContainerZ = document.getElementById('z');
    game.appendTo(container);

    // voxel-drone returns a function to create a drone
    var createDrone = require('voxel-drone');
    // create a drone / add to the game
    var drone = createDrone(game);
    var item = drone.item();
    item.mesh.position.set(430, 10, 600);
    game.addItem(item);
    /**
     * TODO: fix the drone drawing on screen!!!
     */
    drone.viewCamera();

    // tell the drone to take off
    drone.takeoff();

    var createPlayer = require('voxel-player')(game);

    var dude = createPlayer('./textures/dude.png');
    dude.possess();
    dude.yaw.position.set(424, 8, 600);

    game.on('tick', function(delta) {
        playerPositionContainerX.innerHTML = Math.round(dude.yaw.position.x);
        playerPositionContainerY.innerHTML = Math.round(dude.yaw.position.z);
        playerPositionContainerZ.innerHTML = Math.round(dude.yaw.position.y);
    })
}