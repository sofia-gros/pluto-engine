Field of view
Introduction¶
Visible testing, to find field of view, chess behavior of Board system.
Author: Rex
Behavior of chess
Live demos¶
Field of view
Line of sigh
Filter visible chess
Pre-test callback
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexboardplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js', 'rexBoard', 'rexBoard');
Add field-of-view object
var fieldOfView = scene.rexBoard.add.fieldOfView(chess, config);
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
Add field-of-view object
var fieldOfView = scene.rexBoard.add.fieldOfView(chess, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { FieldOfView } from 'phaser4-rex-plugins/plugins/board-components.js';
Add field-of-view object
var fieldOfView = new FieldOfView(chess, config);
Create instance¶
var fieldOfView = scene.rexBoard.add.fieldOfView(chess, {
// face: 0,
// cone: undefined,
// coneMode: 0,
// perspective: false,
// ** pre-test **
// occupiedTest: false,
// blockerTest: false,
// preTestCallback: undefined,
// preTestCallbackScope: undefined,
// ** cost **
// costCallback: undefined,
// costCallbackScope: undefined,
// cost: undefined,   // constant cost
// debug: {
//     graphics: undefined,
//     visibleLineColor: 0x00ff00,
//     invisibleLineColor: 0xff0000,
//     log: false,
// }
})
face : Face of chess.
0 ~ 3 : Quad grid.
0 ~ 5 : Hexagon grid.
cone : View of cone. Tile position or chess which not in view of cone will be invisible.
undefined : Ignore this feature
coneMode : Unit of cone , in direction or angle.
'direction', or 0 : Cone in directions.
For example, visible directions are between (0 - 2/2) to (0 + 2/2) if set
face : 0,
cone : 2,
coneMode: 0
'angle', or 1 : Cone in angle.
For example, visible angle is between (0 - 120/2) to (0 + 120/2) if set
face : 0,
cone : 120,
coneMode: 1
perspective :
false : Test visible until blocked tiles. Default behavior.
true : Test visible until out-of-board. Will test cross any blocked (invisible) tile.
Pre-test : Test tiles on visible path.
occupiedTest : Set true to test if target tile position is occupied or not.
blockerTest : Set true to test blocker property.
preTestCallback, preTestCallbackScope : Custom pre-test function, return false to discard cost function.
function(tileXYArray, visiblePoints, fieldOfView) {
// return false;
}
tileXYArray[0] is current tileXY position of chess.
Cost function of each tile on visible path
cost : A constant cost for each non-blocked tile
costCallback, costCallbackScope :  Get cost via callback
function(curTile, fieldOfView, tileXYArray) {
return cost;
}
Cost of blocker : fieldOfView.BLOCKER.
curTile : Currest testing tileXY.
tileXYArray : A read only  tileXY array of sight path.
debug :
debug.graphics : A graphics object for showing debug messages.
debug.visibleLineColor : Color of visible line. Set undefined to not draw any line.
debug.invisibleLineColor : Color of invisible line. Set undefined to not draw any line.
Note
Blocker is visible, but tiles behind blocker are invisible.
Set pre-test function¶
fieldOfView.setPreTestFunction(callback, scope);
callback
var callback = function(tileXYArray, visiblePoints, fieldOfView) {
return false;
}
tileXYArray[0] is current tileXY position of chess.
Set cost function¶
Constant cost for each non-blocked tile
fieldOfView.setCostFunction(cost);
Get cost via callback
fieldOfView.setCostFunction(callback, scope);
callback
var callback = function(curTile, fieldOfView, tileXYArray) {
return cost;
}
Cost of blocker : fieldOfView.BLOCKER
curTile : Currest testing tileXY.
tileXYArray : A read only  tileXY array of sight path.
Is tileXY/chess visible¶
var isVisible = fieldOfView.isInLOS(chess);
// var isVisible = fieldOfView.isInLOS(chess, visiblePoints);
// var isVisible = fieldOfView.isInLOS(chess, visiblePoints, originTileXY);
chess : Chess object or tileXY
visiblePoints
fieldOfView.INFINITY (undefined) : Infinity visible points. Default value.
originTileXY : Put chess at this tileXY position for visible testing temporary.
undefined : Use current tileXY position for visible testing.
Get tileXY array in field of view¶
var tileXYArray = fieldOfView.findFOV();
// var tileXYArray = fieldOfView.findFOV(visiblePoints);
// var tileXYArray = fieldOfView.findFOV(visiblePoints, originTileXY);
// var out = fieldOfView.findFOV(visiblePoints, out);
// var out = fieldOfView.findFOV(visiblePoints, originTileXY, out);
visiblePoints
fieldOfView.INFINITY (undefined) : Infinity visible points. Default value.
out : Returned tileXY array.
originTileXY : Put chess at this tileXY position for visible testing temporary.
undefined : Use current tileXY position for visible testing.
Filter visible tileXY array¶
Filter visible tileXY array
var out = fieldOfView.LOS(chessArray);
// var out = fieldOfView.LOS(chessArray, originTileXY);
// var out = fieldOfView.LOS(chessArray, out);
// var out = fieldOfView.LOS(chessArray, originTileXY, out);
chessArray : Array of chess object or tileXY
out : Array of visible chess object or tileXY
originTileXY : Put chess at this tileXY position for visible testing temporary.
undefined : Use current tileXY position for visible testing.
Filter visible tileXY array with visible points
var out = fieldOfView.LOS(chessArray, visiblePoints);
// var out = fieldOfView.LOS(chessArray, visiblePoints, originTileXY);
// var out = fieldOfView.LOS(chessArray, visiblePoints, out);
// var out = fieldOfView.LOS(chessArray, visiblePoints, originTileXY, out);
chessArray : Array of chess object or tileXY
out : Array of visible chess object or tileXY
originTileXY : Put chess at this tileXY position for visible testing temporary.
undefined : Use current tileXY position for visible testing.
Face¶
Face direction
Get
var face = fieldOfView.face;
Set
fieldOfView.setFace(direction);
or
fieldOfView.face = direction;
// fieldOfView.face ++;
face :
0 ~ 3 : Quad grid.
0 ~ 5 : Hexagon grid.
Debug¶
Clear debug graphics
fieldOfView.clearDebugGraphics();
Set color of lines
fieldOfView.setDebugLineColor(visibleLineColor, invisibleLineColor);
visibleLineColor, invisibleLineColor : Set undefined to not draw any line.