/**
 * Created by pr3mar on 12/28/15.
 */
if (!Promise) {
    alert("include a promise library like blurbird, https://github.com/petkaantonov/bluebird")
}


load3DPoints()
    .then(convertPointsTOXYZDB)
    .then(initVoxelJS);

function initVoxelJS(pointDB) {

    function generate(x, y, z) {
        return pointDB[x+","+y+","+z] || 0;
    }

    // init voxel.js, pass in generate
    console.log("init");
}

function convertPointsTOXYZDB(points) {

    var ndx = 0;
    var total = points.length;
    var pointsPerTick = 10000;  // adjust for speed vs timeout
    var xyzDB = {};
    var resolveFn;

    function addPointsToDB() {
        var end = Math.min(ndx + pointsPerTick, total);
        for (; ndx < end; ++ndx) {
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
    });
}

function load3DPoints() {
    // Since we don't have data to load let's just make random points

    function r() {
        return Math.random() - 0.5 * 1024 | 0;  // returns an int between -512 and 511
    }

    var points = [];
    var numPoints = 11000000;
    var pointsPerTick = 100000;  // adjust for speed vs timeout
    var resolveFn;

    function generatePoints() {
        var num = Math.min(numPoints, pointsPerTick);
        for (var ii = 0; ii < num; ++ii) {
            points.push([r(), r(), r()]);
        }

        numPoints -= num;
        if (numPoints) {
            setTimeout(generatePoints, 1);
        } else {
            resolveFn(points);
        }
    }

    return new Promise(function(resolve, reject) {
        resolveFn = resolve;
        generatePoints();
    });
}

