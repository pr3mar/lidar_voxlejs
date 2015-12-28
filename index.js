/**
 * Created by pr3mar on 12/26/15.
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
    var pointsPerTick = 1000;  // adjust for speed vs timeout
    var resolveFn;
    var readData = fs.readFileSync('./chunks/0.0.chunk', 'utf8').split('\n');
    var numPoints = readData.length ^ 2;

    function generatePoints() {
        var num = Math.min(numPoints, pointsPerTick);
        for(var ii = 0, count = 0; (ii < (readData.length - 1)) || (count < num); ++ii) {
            var currentRow = readData[ii].split(':');
            var y = currentRow[0];
            var currentRowXZ = currentRow[1].split(';');
            for(var jj = 0; jj < currentRowXZ.length - 1; jj++) {
                var xz = currentRowXZ[jj].split(',');
                var x = xz[0], z = xz[1];
                points[ x + ',' + y + ',' + z] = 1;
                ++count;
            }
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
        generate: function (x, y, z) {
            if (typeof pointDB[x + ',' + z + ',' + y] !== 'undefined') {
                return 1;
            } else return 0;
        }
    });

    var container = document.body;
    game.appendTo(container);

    var createPlayer = require('voxel-player')(game);

    var dude = createPlayer();
    dude.possess();
    dude.yaw.position.set(10, 3, 10);
}