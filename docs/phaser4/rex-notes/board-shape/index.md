Shape
Introduction¶
Grid (polygon) shape chess object.
Author: Rex
Chess Game object of Board system
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexboardplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js', 'rexBoard', 'rexBoard');
Add chess object
var chess = scene.rexBoard.add.shape(board, tileX, tileY, tileZ, fillColor);
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
Add chess object
var chess = scene.rexBoard.add.shape(board, tileX, tileY, tileZ, fillColor);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { Shape } from 'phaser4-rex-plugins/plugins/board-components.js';
Add chess object
var chess = new Shape(board, tileX, tileY, tileZ, fillColor);
scene.add.existing(chess);
Add chess object¶
Create chess object and add to board
var chess = scene.rexBoard.add.shape(board, tileX, tileY, tileZ, fillColor, fillAlpha);
board : Board object
tileX, tileY, tileZ : Tile position
fillColor, fillAlpha : Color of this shape chess object
Create chess object but not add to board
var chess = scene.rexBoard.add.shape(board, x, y, undefined, fillColor, fillAlpha, false);
board : Board object
x, y : World position
fillColor, fillAlpha : Color of this shape chess object
Set color¶
Fill color
chess.setFillStyle(color, alpha)
Stroke color
chess.setStrokeStyle(lineWidth, color, alpha)
No tint methods
Uses shape.setFillStyle(color, alpha) to change color.
Other properties¶
See polygon shape game object, game object