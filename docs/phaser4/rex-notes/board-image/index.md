Image
Introduction¶
Image chess object.
Author: Rex
Chess Game object of Board system
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexboardplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js', 'rexBoard', 'rexBoard');
Add chess object
var chess = scene.rexBoard.add.image(board, tileX, tileY, tileZ, key, frame);
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
var chess = scene.rexBoard.add.image(board, tileX, tileY, tileZ, key, frame);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { Image } from 'phaser4-rex-plugins/plugins/board-components.js';
Add chess object
var chess = new Image(board, tileX, tileY, tileZ, key, frame);
scene.add.existing(chess);
Add chess object¶
Create chess object and add to board
var chess = scene.rexBoard.add.image(board, tileX, tileY, tileZ, key, frame);
board : Board object
tileX, tileY, tileZ : Tile position
key, frame : Frame of this image chess object
Create chess object but not add to board
var chess = scene.rexBoard.add.image(board, x, y, undefined, key, frame, false);
board : Board object
x, y : World position
key, frame : Frame of this image chess object
Other properties¶
See Image game object, game object