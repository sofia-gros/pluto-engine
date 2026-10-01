Path finder
Introduction¶
Find moveable area or moving path, chess behavior of Board system.
Author: Rex
Application of Board system, or behavior of chess
Live demos¶
Find area, get path
Draw path
Energy drain
Turning cost
Move from high to low
Chinese checkers
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexboardplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js', 'rexBoard', 'rexBoard');
Add path-finder
var pathFinder = scene.rexBoard.add.pathFinder(config);
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
Add path-finder
var pathFinder = scene.rexBoard.add.pathFinder(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { PathFinder } from 'phaser4-rex-plugins/plugins/board-components.js';
Add path-finder
var pathFinder = new PathFinder(config);
Create instance¶
var pathFinder = scene.rexBoard.add.pathFinder({
// occupiedTest: false,
// blockerTest: false,
// ** cost **
// cost: 1,   // constant cost
// costCallback: undefined,
// costCallbackScope: undefined,
// cacheCost: true,
// pathMode: 10,  // A*
// weight: 10,   // weight for A* searching mode
// shuffleNeighbors: false,
})
occupiedTest : Set true to test if target tile position is occupied or not, in cost function.
blockerTest : Set true to test blocker property in cost function.
Cost function
cost : A constant cost for each non-blocked tile
costCallback, costCallbackScope :  Get cost via callback
function(curTile, preTile, pathFinder) {
return cost;
}
Board : pathFinder.board
Chess game object : pathFinder.gameObject
Cost of blocker : pathFinder.BLOCKER
pathMode
Shortest path
'random', or 0
'diagonal', or 1
'straight', or 2
'line', or 3
A* path
'A*', or 10
'A*-random', or 11
'A*-line', or 12
weight : Weight parameter for A* searching mode.
cacheCost : Set false to get cost every time. It is useful when cost is a function of (current tile, previous tile).
shuffleNeighbors : Shuffle neighbors.
Create behavior¶
var pathFinder = scene.rexBoard.add.pathFinder(chess, config);
Set chess¶
pathFinder.setChess(chess);
Note
Don't use this method if pathFinder is a behavior of Chess
Cost function¶
var callback = function(curTileXY, preTileXY, pathFinder) {
return cost;
}
cost : Number cost.
curTileXY, preTileXY : TileXY position {x, y}. Cost of moving from preTileXY to curTileXY.
preTileXY.pathCost : Path cost of preTilexY.
preTileXY.preNodes : Previous tiles of preTileXY.
pathFinder : Path finder object.
pathFinder.board : Board object
pathFinder.gameObject : Chess game object.
pathFinder.BLOCKER : Cost of blocker. Return this value means that chess can not move to curTileXY.
Set cost function¶
Constant cost for each non-blocked tile
pathFinder.setCostFunction(cost);
Get cost via callback
pathFinder.setCostFunction(callback, scope);
Set path mode¶
pathFinder.setPathMode(pathMode)
pathMode
Shortest path
'random', or 0
'diagonal', or 1
'straight', or 2
'line', or 3
A* path
'A*', or 10
'A*-random', or 11
'A*-line', or 12
Find moveable area¶
var tileXYArray = pathFinder.findArea(movingPoints);
// var out = pathFinder.findArea(movingPoints, out);
movingPoints
pathFinder.INFINITY (undefined) : Infinity moving points. Default value.
tileXYArray : An array of moveable tile positions {x,y,pathCost}
Get shortest path to a moveable tile¶
var tileXYArray = pathFinder.getPath(endTileXY);
endTileXY : Tile position of moveable area in last result of pathFinder.findArea()
tileXYArray : Moving path in an array of tile positions {x,y,pathCost}
Uses moveTo behavior to move chess along path.
Path mode
Path info of each tile is calculated during pathFinder.findArea()
Find moving path¶
var tileXYArray = pathFinder.findPath(endTileXY);
// var tileXYArray = pathFinder.findPath(endTileXY, movingPoints, isClosest, out);
endTileXY : Tile position
tileXYArray : Moving path in an array of tile positions {x,y,pathCost}
Uses moveTo behavior to move chess along path.
movingPoints
pathFinder.INFINITY (undefined) : Infinity moving points. Default value.
isClosest : Set true to get closest path.
Path mode
Set pathMode to A* ('A*', 'A*-random', or 'A*-line') to speed up calculating.
Cost of tile¶
During or after finding moveable area...
Get cost of path from chess to tile
var pathCost = pathFinder.tileXYToCost(tileX, tileY, true);
Get cost of tile
var tileCost = pathFinder.tileXYToCost(tileX, tileY, false);