/**
 * Created by pr3mar on 12/26/15.
 */
var Promise = require('bluebird');
Promise.config({
    longStackTraces: true,
    warnings: true
});

if(!Promise) {
    console.log('get the damn library.');
}

load3DPoints()
    .then(convertPointsTOXYZDB)
    .then(initVoxelJS);

function load3DPoints() {
    function r() {
        return Math.random() - 0.5 * 1024 | 0;
    }

    var points = [];
    var numPoints = 11000;
    var pointsPerTick = 1000;  // adjust for speed vs timeout
    var resolveFn;

    function generatePoints() {
        var num = Math.min(numPoints, pointsPerTick);
        for(var ii = 0; ii < num; ++ii) {
            points.push([r(), r(), r()]);
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

function convertPointsTOXYZDB(points) {
    var ndx = 0;
    var total = points.length;
    var pointsPerTick = 1000;  // adjust for speed vs timeout
    var xyzDB = {};
    var resolveFn;

    function addPointsToDB() {
        var end = Math.min(ndx + pointsPerTick, total);
        for(; ndx < end; ++ndx) {
            xyzDB[points[ndx].join(",")] = 1;
        }
        if (end < total) {
            setTimeout(addPointsToDB);
        } else {
            resolveFn(xyzDB);
        }
    }

    return new Promise(function(resolve, reject) {
        resolveFn = resolve;
        addPointsToDB();
    })
}

function initVoxelJS(pointDB) {
    var createGame = require('voxel-engine');
    var game = createGame({
        generate: function (x, y, z) { // flat world, 1 cube high
            //console.log(x, y, z);
            return pointDB[x + ',' + y + ',' + z];
        }
    });

    var container = document.body;
    game.appendTo(container);

    var createPlayer = require('voxel-player')(game);

    var dude = createPlayer();
    dude.possess();
    dude.yaw.position.set(0, 100, 0);
}