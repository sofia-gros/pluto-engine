Mouse-wheel to up/down
Introduction¶
Map mouse-wheeling to (up/down) cursor key state.
Author: Rex
Member of scene
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexmousewheeltoupdownplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexmousewheeltoupdownplugin.min.js', true);
Add mouse-wheeling-to-cursor-key object
var mouseWheelToUpDown = scene.plugins.get('rexmousewheeltoupdownplugin').add(scene);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import MouseWheelToUpDownPlugin from 'phaser4-rex-plugins/plugins/mousewheeltoupdown-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexMouseWheelToUpDown',
plugin: MouseWheelToUpDownPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add mouse-wheeling-to-cursor-key object
var mouseWheelToUpDown = scene.plugins.get('rexMouseWheelToUpDown').add(scene);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import MouseWheelToUpDown from 'phaser4-rex-plugins/plugins/mousewheeltoupdown.js';
Add mouse-wheeling-to-cursor-key object
var mouseWheelToUpDown = new MouseWheelToUpDown(scene);
Create instance¶
var mouseWheelToUpDown = scene.plugins.get('rexMouseWheelToUpDown').add(scene);
State of cursor keys¶
var cursorKeys = mouseWheelToUpDown.createCursorKeys();
var upKeyDown = cursorKeys.up.isDown;
var downKeyDown = cursorKeys.down.isDown;
Or
var upKeyDown = mouseWheelToUpDown.up;
var downKeyDown = mouseWheelToUpDown.down;
var noKeyDown = mouseWheelToUpDown.noKey;
Destroy¶
mouseWheelToUpDown.destroy();