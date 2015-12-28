/**
 * Created by pr3mar on 12/26/15.
 */

var createGame = require('voxel-engine');
var game = createGame({
    generate: function(x, y, z) { // flat world, 1 cube high
        //console.log(x, y, z);
        return y === 1 ? 1 : 0
    }
});

var container = document.body;
game.appendTo(container);

var createPlayer = require('voxel-player')(game);

var dude = createPlayer();
dude.possess();
dude.yaw.position.set(0, 100, 0);
