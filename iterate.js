/**
 * Created by pr3mar on 12/26/15.
 */

var fs = require('fs');
var util = require('util');
require.extensions['.asc'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8').split('\r\n');
};

function createArray(length) {
    var arr = new Array(length || 0), i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }
    return arr;
}

Array.prototype.getUnique = function(){
    var u = {}, a = [];
    for(var i = 0, l = this.length; i < l; ++i){
        if(u.hasOwnProperty(this[i])) {
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
    return a;
};

console.time('readElements');
var words = require("../public/data/TM1_463_102.asc");
var i = 0, items = [];
words.forEach(function (item) {
    var tmp = item.split(';');
    items.push(tmp);
    i++;
});
console.timeEnd('readElements');
console.time('printCoords');
var x, y, z, px = items[0][0], py = items[0][1], pz = items[0][2];
px = px - translateX; py = py - translateY; pz = pz - translateZ;
var countX = [], countY = [], countZ = [];
var tx = 0, ty = 0, tz = 0;

var minX = Number.MAX_VALUE; var minY = Number.MAX_VALUE;var minZ = Number.MAX_VALUE;
var maxX = Number.MIN_VALUE; var maxY = Number.MIN_VALUE;var maxZ = Number.MIN_VALUE;
//TODO: detect which chunk is this a part of!
for(var i = 0; i < items.length - 1; i++) {
    x = parseFloat(items[i][0]); y = parseFloat(items[i][1]); z = parseFloat(items[i][2]);
    items[i][0] = x; items[i][1] = y; items[i][2] = z;

    if(minX > x)
        minX = x;
    if(minY > y)
        minY = y;
    if(minZ > z)
        minZ = z;
    if(maxX < x)
        maxX = x;
    if(maxY < y)
        maxY = y;
    if(maxZ < z)
        maxZ = z;
}
console.log(minX, maxX, maxX - minX);
console.log(minY, maxY, maxY - minY);
console.log(Math.round(minZ), Math.round(maxZ), Math.round(maxZ - minZ));

var translateX = minX, translateY = minY, translateZ = minZ;
//var file = {};
var same = false, chunkSize = 128, noChunks = 8;
var chunks = createArray(noChunks, noChunks);
for(var i = 0; i < chunks.length; i++) {
    for(var j = 0; j < chunks[i].length; j++) {
        chunks[i][j] = {};
    }
}
console.log(items[items.length - 1]);
for(var i = 1; i < items.length - 1; i++) {
    x = items[i][0] - translateX; y = items[i][1] - translateY; z = Math.round(items[i][2] - translateZ);
    var chunkX = Math.floor(x / chunkSize);
    var chunkY = Math.floor(y / chunkSize);
    //console.log(items[i][0], items[i][1], chunkX, chunkY);
    //if(x == px && tx <= rows) {
    //    if(same)
    //        continue;
    //    if (ty >= columns)
    //        same = true;
    if (chunks[chunkX][chunkY][x])
        chunks[chunkX][chunkY][x].push([y, z]);
    else
        chunks[chunkX][chunkY][x] = [[y, z]];
        //ty++;
    //} else {
    //    same = false;
    //    tx++;
    //    ty = 0;
    //    px = x;
    //}
}
//console.log(file["0"].length);
//console.log(Object.keys(file).length);

//console.log(JSON.stringify(chunks[0][0], null, '\t'));
console.time('write');
for (var i = 0; i < noChunks; i++) {
    for (var j = 0; j < noChunks; j++) {
        fs.writeFileSync(util.format('chunk/%d.%d.chunk', i, j), '');
        for(var atts in chunks[i][j]) {
            fs.appendFileSync(util.format('chunk/%d.%d.chunk', i, j), atts + ':');
            for(var k = 0; k < chunks[i][j][atts].length; k++)
                fs.appendFileSync(util.format('chunk/%d.%d.chunk', i, j), util.format('%d,%d;', chunks[i][j][atts][k][0], chunks[i][j][atts][k][1]));
            fs.appendFileSync(util.format('chunk/%d.%d.chunk', i, j), '\n');
        }
    }
}
console.timeEnd('write');
//console.timeEnd('printCoords');
////console.log(countX.getUnique());
//console.log('x = ' , countX.length);
////console.log(countY.getUnique());
//console.log('y = ' , countY.length);
////console.log(countZ.getUnique());
//console.log('z = ' , countZ.length);
