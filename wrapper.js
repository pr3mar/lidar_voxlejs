/**
 * Created by pr3mar on 1/9/16.
 * wrapper for reading and discretizing the
 *
 */

var readLAS = require('./readLAS');
var discretize = require('./discretize');

var dir = './terrain/';
var fileName = 'TM_463_102.las';
var fullFileName = dir + fileName;

//console.time('readLAS');
readLAS(fullFileName);
//console.timeEnd('readLAS');

//console.time('discretize');
discretize(fullFileName);
//console.timeEnd('discretize');


/**
 * summary: currently it takes about 15 minutes to finish.
 * TODO: optimize!!
 * idea: discretization can be incorporated into the parsing of .las files
 * TODO:
 *  1. read (parse) the .las file
 *  2. read the terrain
 *  3. call the voting function
 *  4. compress the data optimally (iterate.js)
 */