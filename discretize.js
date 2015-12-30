/**
 * Created by pr3mar on 12/28/15.
 * implement a voting system to discretize the data
 * set a treshold, only most valuable data should be stored.
 * merge into a single file, add a 4th column for votes, set a fixed value (threshold) for terrain
 * concurence when generating the terain based on votes -> max of all is the type of voxel.
 */

var fs = require('fs');
var util = require('util');

Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

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

function vote(data, translateX, translateY, translateZ, type) {
    var len = data.length - 1;
    var line = data[0].split(';');
    var votes = {}, x, y, z;
    for (var i = 0; i < len; ++i) {
        line = data[i].split(';');
        x = Math.round(parseFloat(line[0]) - translateX);
        y = Math.round(parseFloat(line[1]) - translateY);
        z = Math.round(parseFloat(line[2]) - translateZ);
        if (typeof votes[x + ',' + y + ',' + z] !== 'undefined') {
            votes[x + ',' + y + ',' + z][0]++;
        } else {
            if(type == 0)
                votes[x + ',' + y + ',' + z] = [5, type];
            else
                votes[x + ',' + y + ',' + z] = [1, type];
        }
    }
    return votes;
}

function mergeData(data, lengths) {
    var merged = {};
    var maxLen = lengths.max();
    var keys = [];
    for(var i = 0; i < data.length; i++) {
        keys.push(Object.keys(data[i]));
    }
    //console.log(maxLen);
    //console.log(data.length);
    //TODO: check if exists, check if equal
    for( var i = 0; i < maxLen; i++) {
        var currKey = keys[0][i];
        var currAdd = data[0][currKey];
        for (var j = 1; j < data.length; j++) {
            var tmpKey = keys[j][i];
            var tmpKey = data[j][tmpKey];
            if( && currAdd[0] < tmp[0]){
                currAdd = tmp;
            }

        }
    }
    return merged;
}

var dirName = './terrain/';
var files = [
    'TM1_463_102.asc',          // 0 - terrain
    'buildings.asc',            // 1 - buildings
    'lowVegetation.asc',        // 2 - low vegetation
    'mediumVegetation.asc',     // 3 - medium vegetation
    'highVegetation.asc'        // 4 - high vegetation
];

var data = [], len = [];
var terrain = getContent(dirName + files[0]);
var minmax = getMinMax(terrain);
terrain = vote(terrain, minmax[1], minmax[3], minmax[5], 0);
data.push(terrain);
len.push(Object.keys(terrain).length);
for (var i = 1; i < files.length; i++) {
    var tmp = getContent(dirName + files[i]);
    tmp = vote(tmp, minmax[1], minmax[3], minmax[5], i);
    data.push(tmp);
    len.push(Object.keys(tmp).length);
}

var result = mergeData(data, len);
//fs.writeFileSync('data.asc', JSON.stringify(votes, null, '\t'), 'utf8');