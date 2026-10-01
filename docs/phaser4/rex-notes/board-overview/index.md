Overview
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexboardplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js', 'rexBoard', 'rexBoard');
Add board object
var board = scene.rexBoard.add.board(config);
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
Add board object
var board = scene.rexBoard.add.board(config);
Using typescript declaration file¶
import BoardPlugin from 'phaser4-rex-plugins/plugins/board-plugin.js';
class Game extends Phaser.Scene {
rexBoard: BoardPlugin;  // Declare scene property 'rexBoard' as BoardPlugin type
create() {
var board = this.rexBoard.add.board({
// ...
})
}
}
var game = new Phaser.Game({
scene: Game,
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
});
'phaser4-rex-plugins/plugins/board-plugin' : Factories of board components.
'phaser4-rex-plugins/plugins/board-components' : Class of board components.
import { Board } from 'phaser4-rex-plugins/plugins/board-components';
See this example
List of board plugins¶
Board¶
Board
Grids
Quad grid
Hexagon grid
Chess
Chess game object¶
Shape game object
Image game object
Sprite game object
Tile texture
Behaviors¶
Move to
Applications¶
Path finder
Monopoly
Field of view
Match
Hexagon map
Mini-board¶
Mini-board
Templates¶
Bejeweled