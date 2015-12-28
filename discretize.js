/**
 * Created by pr3mar on 12/28/15.
 * implement a voting system to discretize the data
 * set a treshold, only most valuable data should be stored.
 * merge into a single file, add a 4th column for votes, set a fixed value (threshold) for terrain
 * concurence when generating the terain based on votes -> max of all is the type of voxel.
 */

var fs = require('fs');
var util = require('util');

console.time('read');
var data = fs.readFileSync('./terrain/highVegetation.asc', 'utf8').split('\n');
console.timeEnd('read');

var len = data.length - 1;
var line = data[0].split(';');
var translateX = parseFloat(line[0]), translateY = parseFloat(line[1]), translateZ = parseFloat(line[2]);
var votes = {}, x, y, z;
for(var i = 0; i < len; ++i) {
    line = data[i].split(';');
    x = Math.round(parseFloat(line[0]) - translateX);
    y = Math.round(parseFloat(line[1]) - translateY);
    z = Math.round(parseFloat(line[2]) - translateZ);
    if(typeof votes[x + ',' + y + ',' + z] !== 'undefined') {
        votes[x + ',' + y + ',' + z]++;
    } else {
        votes[x + ',' + y + ',' + z] = 1;
    }
}
fs.writeFileSync('data.asc', JSON.stringify(votes, null, '\t'), 'utf8');
console.log(Object.keys(votes).length);