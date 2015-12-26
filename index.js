/**
 * Created by pr3mar on 12/26/15.
 */

var createGame = require('voxel-engine');
var game = createGame();

var container = document.body;
game.appendTo(container);

var createPlayer = require('voxel-player')(game);

var dude = createPlayer();
dude.possess();
dude.yaw.position.set(0, 100, 0);
