/**
 * Created by pr3mar on 12/28/15.
 *
 */

var fs = require('fs');
var util = require('util');
var TERRAIN = 0;
var BUILDING = 1;
var LOW_VEGETATION = 2;
var MEDIUM_VEGETATION = 3;
var HIGH_VEGETATION = 4;

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

function mergeData(data) {
    var merged = data[0];
    for(var i = 1; i < data.length; i++) {
        var currDict = data[i];
        for (var key in currDict) {
            if(merged.hasOwnProperty(key)) {
                if(currDict[key][0] > merged[key][0]) {
                    merged[key] = currDict[key];
                }
            } else {
                merged[key] = currDict[key];
            }
        }
    }
    return merged;
}

function fillBuildings(data) {
    var splitted;
    for(var key in data) {
        splitted = key.split(',');
        var x = parseFloat(splitted[0]);
        var y = parseFloat(splitted[1]);
        var z = parseFloat(splitted[2]);
        var val = data[key][0];
        var type = data[key][1];
        if(type === BUILDING) {
            z -= 1;
            var joined = [x, y, z].join(',');
            while(z >= 0 && !data.hasOwnProperty(joined)) {
                data[joined] = [val, BUILDING];
                z -= 1;
                joined = [x, y, z].join(',');
            }
        }
    }
    return data;
}

var data = [], len = [];

/**
 * function to discretize the generated .asc files.
 * FILE NAME CONVENTION:
 * the file name HAS to contain the coordinates which it describes, for example
 * 'TM_463_102.las' -> 463_102_ground.asc, 463_102_lowVegetation.asc, 463_102_mediumVegetation.asc, 463_102_highVegetation.asc
 * therefore the name of the original .las file is required.
 * it is used for further file naming when generating the next file
 * files are generated in the following directory:
 * ./terrain/generated/
 * @param fileName
 */
module.exports = function discretize(fileName) {
    var coords = fileName.substring(0, fileName.length - 4).split('/');
    coords = coords[coords.length - 1].split('_');
    coords = coords[1] + '_' + coords[2];

    var dirName = './terrain/';
    var files = [
        dirName + 'TM1_' + coords +'.asc',             // 0 - (provided)  terrain
        dirName + coords + '_buildings.asc',            // 1 - (generated) buildings
        dirName + coords + '_lowVegetation.asc',        // 2 - (generated) low vegetation
        dirName + coords + '_mediumVegetation.asc',     // 3 - (generated) medium vegetation
        dirName + coords + '_highVegetation.asc'        // 4 - (generated) high vegetation
    ];

    var terrain = getContent(files[0]);
    var minmax = getMinMax(terrain);
    terrain = vote(terrain, minmax[1], minmax[3], minmax[5], 0);
    data.push(terrain);
    len.push(Object.keys(terrain).length);
    for (var i = 1; i < files.length; i++) {
        var tmp = getContent(files[i]);
        tmp = vote(tmp, minmax[1], minmax[3], minmax[5], i);
        data.push(tmp);
        len.push(Object.keys(tmp).length);
    }
    //console.log(len);
    var result = mergeData(data);
    result = fillBuildings(result);
    //console.log(Object.keys(result).length);
    var output = dirName + coords + '_terrain.asc';
    fs.writeFileSync(output, '', 'utf8');
    for (var key in result) {
        var splitted = key.split(',');
        fs.appendFileSync(output, util.format('%d;%d;%d;%d\n', splitted[0], splitted[1], splitted[2], result[key][1]), 'utf8');
    }
    // fs.writeFileSync('data.asc', JSON.stringify(result, null, '\t'), 'utf8');
};