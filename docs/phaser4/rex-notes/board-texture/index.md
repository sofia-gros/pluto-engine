Tile texture
Introduction¶
Create canvas-texture of tile.
Author: Rex
Help method of board
Live demos¶
Tile texture
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexboardplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js', 'rexBoard', 'rexBoard');
Create tile texture
scene.rexBoard.createTileTexture(board, key, fillStyle, strokeStyle, lineWidth);
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
Create tile texture
scene.rexBoard.createTileTexture(board, key, fillStyle, strokeStyle, lineWidth);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { CreateTileTexture } from 'phaser4-rex-plugins/plugins/board-components.js';
Create tile texture
CreateTileTexture(board, key, fillStyle, strokeStyle, lineWidth);
Create tile texture¶
Hexagon¶
CreateTileTexture(board, key, fillStyle, strokeStyle, lineWidth);
// CreateTileTexture(board, key, fillStyle, strokeStyle, lineWidth, overlapGrid, lineJoin);
board : Board object.
fillStyle : Fill color of tile texture.
undefined : Don't fill tile texture.
strokeStyle, lineWidth : Stroke color, stroke line width of tile texture.
undefined : Don't stroke tile texture.
overlapGrid :
true : Overlap grid. i.e. Grid width = lineWidth. Default behavior.
false : Don't overlap grid. i.e. Grid width = 2 * lineWidth.
lineJoin : Join style of stroke lines. 'round', 'bevel' and 'miter'. Default is 'miter'.