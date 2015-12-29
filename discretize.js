/**
 * Created by pr3mar on 12/28/15.
 * implement a voting system to discretize the data
 * set a treshold, only most valuable data should be stored.
 * merge into a single file, add a 4th column for votes, set a fixed value (threshold) for terrain
 * concurence when generating the terain based on votes -> max of all is the type of voxel.
 */

var fs = require('fs');
var util = require('util');

function getContent(fileName) {
    return fs.readFileSync(fileName, 'utf8').split('\n');
}

function getMinMax(data) {
    var minX = Number.MAX_VALUE, maxX = Number.MIN_VALUE;
    var minY = Number.MAX_VALUE, maxY = Number.MIN_VALUE;
    var minZ = Number.MAX_VALUE, maxZ = Number.MIN_VALUE;
    for (var i = 0; i < data.length; i++) {
        var tmp = data[i].split(';');
        var x = parseFloat(tmp[0]);
        var y = parseFloat(tmp[1]);
        var z = parseFloat(tmp[2]);
        if(minX > x) minX = x;
        if(maxX < x) maxX = x;
        if(minY > y) minY = y;
        if(maxY < y) maxY = y;
        if(minZ > z) minZ = z;
        if(maxZ < z) maxZ = z;
    }
    return [maxX, minX, maxY, minY, maxZ, minZ];
}

function vote(data, translateX, translateY, translateZ) {
    var len = data.length - 1;
    var line = data[0].split(';');
    var votes = {}, x, y, z;
    for (var i = 0; i < len; ++i) {
        line = data[i].split(';');
        x = Math.round(parseFloat(line[0]) - translateX);
        y = Math.round(parseFloat(line[1]) - translateY);
        z = Math.round(parseFloat(line[2]) - translateZ);
        if (typeof votes[x + ',' + y + ',' + z] !== 'undefined') {
            votes[x + ',' + y + ',' + z]++;
        } else {
            votes[x + ',' + y + ',' + z] = 1;
        }
    }
    return votes;
}

var dirName = './terrain/';
var files = [
    'buildings.asc',
    'mediumVegetation.asc',
    'lowVegetation.asc',
    'highVegetation.asc'
];

var data = [], len = [];
//var minX = [], minY = [], minZ = [];
//var maxX = [], maxY = [], maxZ = [];
for (var i = 0; i < files.length; i++) {
    console.log(dirName + files[i]);
    var tmp = getContent(dirName + files[i]);
    var minmax = getMinMax(tmp);
    console.log(minmax);
    //maxX.push(minmax[0]);
    //minX.push(minmax[1]);
    //maxY.push(minmax[2]);
    //minY.push(minmax[3]);
    //maxZ.push(minmax[4]);
    //minZ.push(minmax[5]);
    tmp = vote(tmp, minmax[1], minmax[3], minmax[5]);
    data.push(tmp);
    len.push(Object.keys(tmp).length);
}

console.log(len);

//fs.writeFileSync('data.asc', JSON.stringify(votes, null, '\t'), 'utf8');