Rotate
Introduction¶
Rotate game object continually with a steady speed.
Author: Rex
Behavior of game object
Live demos¶
Change speed
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexrotateplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexrotateplugin.min.js', true);
Add rotate behavior
var rotate = scene.plugins.get('rexrotateplugin').add(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import RotatePlugin from 'phaser4-rex-plugins/plugins/rotate-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexRotate',
plugin: RotatePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add rotate behavior
var rotate = scene.plugins.get('rexRotate').add(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import Rotate from 'phaser4-rex-plugins/plugins/rotate.js';
Add rotate behavior
var rotate = new Rotate(gameObject, config);
Create instance¶
var rotate = scene.plugins.get('rexRotate').add(gameObject, {
// speed: 180,
// enable: true,
// timeScale: 1,
});
speed : Turn speed, degrees in second
Enable¶
Enable (default)
rotate.setEnable();
or
rotate.enable = true;
Disable
rotate.setEnable(false);
or
rotate.enable = false;
Set speed¶
rotate.setSpeed(speed);
// rotate.speed = speed;
speed : Turn speed, degrees in second
Status¶
Is rotating
var enable = rotate.enable;
// var isRunning = rotate.isRunning;