Move to
Introduction¶
Move chess towards target position with a steady speed, chess behavior of Board system.
Author: Rex
Behavior of chess
Live demos¶
Push
Follow chess
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexboardplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js', 'rexBoard', 'rexBoard');
Add move-to behavior
var moveTo = scene.rexBoard.add.moveTo(chess, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import BoardPlugin from 'phaser4-rex-plugins/plugins/board-plugin.js';
var config = {
// ...
plugins: {
scene: [{
key: 'rexBoard',
plugin: BoardPlugin,
mapping: 'rexBoard'
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add move-to behavior
var moveTo = scene.rexBoard.add.moveTo(chess, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { MoveTo } from 'phaser4-rex-plugins/plugins/board-components.js';
Add move-to behavior
var moveTo = new MoveTo(chess, config);
Create instance¶
var moveTo = scene.rexBoard.add.moveTo(chess, {
// speed: 400,
// rotateToTarget: false,
// occupiedTest: false,
// blockerTest: false,
// moveableTest: undefined,
// moveableTestScope: undefined,
// sneak: false,
})
speed : moving speed, pixels in second.
rotateToTarget : Set true to change angle towards path.
occupiedTest : Set true to test if target tile position is occupied or not, in moveable testing.
blockerTest : Set true to test blocker property in moveable testing.
moveableTest, moveableTestScope : Custom moveable test callback
function(fromTileXYZ, toTileXYZ, direction, board) {
return true;
}
fromTileXYZ, toTileXYZ : Move chess from tileXYZ {x, y, z}, to tileXYZ {x, y, z}
direction :
0 ~ 3 : Quad grid in 4 directions mode.
0 ~ 7 : Quad grid in 8 directions mode.
0 ~ 5 : Hexagon grid.
board : Board object.
sneak : Set true to allow changing tileZ when target tile position is occupied. Changing back when target tile position is not occupied.
occupiedTest will be ignored when sneak is true.
Move to destination tile¶
moveTo.moveTo(tileX, tileY);
// moveTo.moveTo(tileXY);
tileXY : Tile position {x,y}
Move to neighbor tile¶
moveTo.moveToward(direction);
direction :
0 ~ 3 : Quad grid in 4 directions mode.
0 ~ 7 : Quad grid in 8 directions mode.
0 ~ 5 : Hexagon grid.
Move to random neighbor tile¶
moveTo.moveToRandomNeighbor();
Move away or move closer¶
Move away from a tile position
moveTo.moveAway(tileX, tileY);
or
moveTo.moveAway(tileXY);
tileXY : Tile position {x,y}
Move closer to a tile position
moveTo.moveCloser(tileX, tileY);
or
moveTo.moveCloser(tileXY);
tileXY : Tile position {x,y}
Can move to tile¶
var canMoveTo = moveTo.canMoveTo(tileX, tileY);
Return true if chess can move to (tileX, tileY)
Last move result¶
var lastMoveResult = moveTo.lastMoveResult;
Return true if chess is moved by moveTo.moveTo(), moveTo.moveToward(), or moveTo.moveToRandomNeighbor()
Destination¶
var destinationTileX = moveTo.destinationTileX;
var destinationTileY = moveTo.destinationTileY;
var destinationDirection = moveTo.destinationDirection;
Pause, Resume, stop moving¶
moveTo.pause();
moveTo.resume();
moveTo.stop();
Enable¶
Enable/resume (default)
moveTo.setEnable();
or
moveTo.enable = true;
Disable/pause
moveTo.setEnable(false);
or
moveTo.enable = false;
Set speed¶
moveTo.setSpeed(speed);
// moveTo.speed = speed;
Set rotate-to-target¶
moveTo.setRotateToTarget(rotateToTarget);
rotateToTarget : Set true to change angle towards target
Events¶
Try to move on an occupied tile position
moveTo.on('occupy', function(occupiedChess, gameObject, moveTo){
// Move away occupiedChess
});
On reached target
moveTo.on('complete', function(gameObject, moveTo){});
// moveTo.once('complete', function(gameObject, moveTo){});
Status¶
Is moving
var isRunning = moveTo.isRunning;