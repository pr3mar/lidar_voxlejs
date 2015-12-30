/**
 * Created by pr3mar on 11/12/15.
 */

var fs = require('fs');
var jParser = require('jParser');
var util = require('util');

function arrSum(arr) {
    return arr.reduce(function(prev, cur) {
        return prev + cur;
    });
}

function getFilesizeInBytes(filename) {
    var stats = fs.statSync(filename);
    return stats["size"];
}

var classes = ["../data/ground.asc", "../data/lowVegetation.asc", "../data/mediumVegetation.asc", "../data/highVegetation.asc", "../data/buildings.asc"];
var countClasses = [0, 0, 0, 0, 0];
classes.forEach(function (element) {
    fs.writeFile(element, "");
});

//console.log(arrSum(headerOffsets.slice(0, 3)));
var fileName = '../data/TM_463_102.las';
//var fileSize = getFilesizeInBytes(fileName);
fs.readFile(fileName, function (err, data) {
    var parser = new jParser(data, {
        header: {
            fileSig:        ['string', 4],
            srcID:          ['uint16'],
            globEnc:        ['uint16'],
            guid1:          ['uint32'],
            guid2:          ['uint16'],
            guid3:          ['uint16'],
            guid4:          ['string', 8],
            ver1:           ['char'],
            ver2:           ['char'],
            sysID:          ['string', 32],
            genSoft:        ['string', 32],
            day:            ['uint16'],
            year:           ['uint16'],
            headSize:       ['uint16'],
            offset:         ['uint32'],
            numVLR:         ['uint32'],
            dotFormat:      ['uint8'],
            recordLength:   ['uint16'],
            numDots:        ['uint32'],
            numByRet:       ['array', 'uint32', 5],
            xScale:         ['float64'],
            yScale:         ['float64'],
            zScale:         ['float64'],
            xOffset:        ['float64'],
            yOffset:        ['float64'],
            zOffset:        ['float64'],
            maxX:           ['float64'],
            minX:           ['float64'],
            maxY:           ['float64'],
            minY:           ['float64'],
            maxZ:           ['float64'],
            minZ:           ['float64'],
            waveformData:   ['array', 'uint32', 2]
        },
        dots: {
            x:              ['uint32'],
            y:              ['uint32'],
            z:              ['uint32'],
            intensity:      ['uint16'],
            flags:          ['uint8'],
            classification: ['uint8'],
            angle:          ['int8'],
            usrData:        ['char'],
            ptSrc:          ['uint16'],
            gpsTime:        ['float64']
        }
    });
    var header = parser.parse('header');
    console.log(JSON.stringify(header, null, '\t'));
    parser.skip(header.offset - parser.tell());
    var numberOfPoints = header.numDots;
    for (var i = 0; i < numberOfPoints; i ++){
        var current = parser.parse('dots');
        current.x = (current.x * header.xScale) + header.xOffset;
        current.y = (current.y * header.yScale) + header.yOffset;
        current.z = (current.z * header.zScale) + header.zOffset;
        var tmp = current.x + ';' + current.y + ';' + current.z + '\n'; // add features here!
        switch (current.classification) {
            case 2:
                fs.appendFileSync(classes[0], tmp);
                countClasses[0]++;
                break;
            case 3:
                fs.appendFileSync(classes[1], tmp);
                countClasses[1]++;
                break;
            case 4:
                fs.appendFileSync(classes[2], tmp);
                countClasses[2]++;
                break;
            case 5:
                fs.appendFileSync(classes[3], tmp);
                countClasses[3]++;
                break;
            case 6:
                fs.appendFileSync(classes[4], tmp);
                countClasses[4]++;
                break;
        }
    }
    console.log(countClasses);
});