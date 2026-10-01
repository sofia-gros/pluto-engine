Monopoly
Introduction¶
Move through path tiles, used in monopoly-like application, chess behavior of Board system.
Author: Rex
Behavior of chess
Live demos¶
Monopoly
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexboardplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js', 'rexBoard', 'rexBoard');
Add monopoly behavior
var monopoly = scene.rexBoard.add.monopoly(chess, config);
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
Add monopoly behavior
var monopoly = scene.rexBoard.add.monopoly(chess, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { Monopoly } from 'phaser4-rex-plugins/plugins/board-components.js';
Add monopoly behavior
var board = new Monopoly(chess, config);
Create instance¶
var monopoly = scene.rexBoard.add.monopoly(chess, {
face: 0,
// ** cost **
// pathTileZ: 0,
// cost: 1,   // constant cost
// costCallback: undefined,
// costCallbackScope: undefined
})
face : Moving direction.
0 ~ 3 : Quad grid in 4 directions mode.
0 ~ 7 : Quad grid in 8 directions mode.
0 ~ 5 : Hexagon grid.
Cost function
pathTileZ : TileZ of path tiles.
cost : A constant cost for each non-blocked tile
costCallback, costCallbackScope :  Get cost via callback
function(curTileXY, preTileXY, monopoly) {
return cost;
}
Cost function¶
var callback = function(curTileXY, preTileXY, monopoly) {
return cost;
}
cost : Number cost.
curTileXY, preTileXY : TileXY position {x, y}. Cost of moving from preTileXY to curTileXY.
monopoly : Path finder object.
monopoly.board : Board object
monopoly.gameObject : Chess game object.
monopoly.STOP, or -1 : Cost of stop. Return this value means chess will stop at curTileXY.
monopoly.BLOCKER, or null : Cost of blocker. Return this value means that chess can not move to curTileXY.
Set cost function¶
Constant cost for each non-blocked tile
monopoly.setCostFunction(cost);
Get cost via callback
monopoly.setCostFunction(callback, scope);
Set face direction¶
monopoly.setFace(direction);
direction :
0 ~ 3 : Quad grid in 4 directions mode.
0 ~ 7 : Quad grid in 8 directions mode.
0 ~ 5 : Hexagon grid.
Moving direction
Get path toward this face direction.
Get path¶
var tileXYArray = monopoly.getPath(movingPoints);
// var out = monopoly.getPath(movingPoints, out);
tileXYArray : Moving path in an array of tile positions {x,y}
Uses moveTo behavior to move chess along path.