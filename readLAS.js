/**
 * Created by pr3mar on 11/12/15.
 */

var fs = require('fs');
var jParser = require('jParser');
var util = require('util');

//function arrSum(arr) {
//    return arr.reduce(function(prev, cur) {
//        return prev + cur;
//    });
//}
//
//function getFilesizeInBytes(filename) {
//    var stats = fs.statSync(filename);
//    return stats['size'];
//}

//console.log(arrSum(headerOffsets.slice(0, 3)));
//var fileName = '../data/TM_463_102.las';
//var fileSize = getFilesizeInBytes(fileName);


//var TERRAIN = 0;
var LOW_VEGETATION      = 0;
var MEDIUM_VEGETATION   = 1;
var HIGH_VEGETATION     = 3;
var BUILDING            = 4;
/**
 * function to parse binary .las files.
 * FILE NAME CONVENTION:
 * the file name HAS to contain the coordinates which it describes, for example
 * 'TM_463_102.las' -> 463_102_ground.asc, 463_102_lowVegetation.asc, 463_102_mediumVegetation.asc, 463_102_highVegetation.asc
 * it is used for further file naming when generating the next file
 * files are generated in the following directory:
 * ./terrain/generated/
 *
 * @param fileName
 */
module.exports = function readLAS(fileName) {
    var coords = fileName.substring(0, fileName.length - 4).split('/');
    coords = coords[coords.length - 1].split('_');
    coords = coords[1] + '_' + coords[2] + '_';
    var dir = './terrain/';
    var classes = [ // dir + coords + 'ground.asc',
                    dir + coords + 'lowVegetation.asc',
                    dir + coords + 'mediumVegetation.asc',
                    dir + coords + 'highVegetation.asc',
                    dir + coords + 'buildings.asc'
    ];
    //console.log(classes);
    //var countClasses = [0, 0, 0, 0, 0];
    var data = fs.readFileSync(fileName);
    var parser = new jParser(data, {
        header: {
            fileSig: ['string', 4],
            srcID: ['uint16'],
            globEnc: ['uint16'],
            guid1: ['uint32'],
            guid2: ['uint16'],
            guid3: ['uint16'],
            guid4: ['string', 8],
            ver1: ['char'],
            ver2: ['char'],
            sysID: ['string', 32],
            genSoft: ['string', 32],
            day: ['uint16'],
            year: ['uint16'],
            headSize: ['uint16'],
            offset: ['uint32'],
            numVLR: ['uint32'],
            dotFormat: ['uint8'],
            recordLength: ['uint16'],
            numDots: ['uint32'],
            numByRet: ['array', 'uint32', 5],
            xScale: ['float64'],
            yScale: ['float64'],
            zScale: ['float64'],
            xOffset: ['float64'],
            yOffset: ['float64'],
            zOffset: ['float64'],
            maxX: ['float64'],
            minX: ['float64'],
            maxY: ['float64'],
            minY: ['float64'],
            maxZ: ['float64'],
            minZ: ['float64'],
            waveformData: ['array', 'uint32', 2]
        },
        dots: {
            x: ['uint32'],
            y: ['uint32'],
            z: ['uint32'],
            intensity: ['uint16'],
            flags: ['uint8'],
            classification: ['uint8'],
            angle: ['int8'],
            usrData: ['char'],
            ptSrc: ['uint16'],
            gpsTime: ['float64']
        }
    });
    var header = parser.parse('header');
    //console.log(JSON.stringify(header, null, '\t')); // print the header
    parser.skip(header.offset - parser.tell());
    var numberOfPoints = header.numDots;
    classes.forEach(function (element) {
        fs.writeFileSync(element, '');
        //fs.writeFileSync(element, util.format('%d,%d,%d,%d,%d,%d',
        //                                        header.minX,header.maxX,
        //                                            header.minY, header.maxY,
        //                                                header.minZ, header.maxZ) );
    });
    console.time('writeASC');
    for (var i = 0; i < numberOfPoints; i++) {
        var current = parser.parse('dots');
        current.x = (current.x * header.xScale) + header.xOffset;
        current.y = (current.y * header.yScale) + header.yOffset;
        current.z = (current.z * header.zScale) + header.zOffset;
        var tmp = current.x + ';' + current.y + ';' + current.z + '\n'; // add features here!
        switch (current.classification) {
            //case 2:
                //fs.appendFileSync(classes[0], tmp);
                //countClasses[0]++;
                //break;
            case 3:
                fs.appendFileSync(classes[LOW_VEGETATION], tmp);
                //countClasses[1]++;
                break;
            case 4:
                fs.appendFileSync(classes[MEDIUM_VEGETATION], tmp);
                //countClasses[2]++;
                break;
            case 5:
                fs.appendFileSync(classes[HIGH_VEGETATION], tmp);
                //countClasses[3]++;
                break;
            case 6:
                fs.appendFileSync(classes[BUILDING], tmp);
                //countClasses[4]++;
                break;
        }
    }
    console.timeEnd('writeASC');
    //console.log(countClasses);
};