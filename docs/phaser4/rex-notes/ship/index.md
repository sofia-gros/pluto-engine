Ship
Introduction¶
Move game object as a space ship by cursor keys.
Author: Rex
Arcade behavior of game object
Usage¶
Sample code
Install plugin¶
Load minify file¶
Enable arcade physics engine in configuration of game
var config = {
// ...
physics: {
default: 'arcade',
arcade: {
// debug: true
}
}
}
var game = new Phaser.Game(config);
Load plugin (minify file) in preload stage
scene.load.plugin('rexshipplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexshipplugin.min.js', true);
Add ship behavior
var ship = scene.plugins.get('rexshipplugin').add(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Enable arcade physics engine and install plugin in configuration of game
import ShipPlugin from 'phaser4-rex-plugins/plugins/ship-plugin.js';
var config = {
physics: {
default: 'arcade',
arcade: {
// debug: true
}
},
// ...
plugins: {
global: [{
key: 'rexShip',
plugin: ShipPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add ship behavior
var ship = scene.plugins.get('rexShip').add(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Enable arcade physics engine in configuration of game
var config = {
// ...
physics: {
default: 'arcade',
arcade: {
// debug: true
}
}
}
var game = new Phaser.Game(config);
Import class
import Ship from 'phaser4-rex-plugins/plugins/ship.js';
Add ship behavior
var ship = new Ship(gameObject, config);
Create instance¶
var ship = scene.plugins.get('rexShip').add(gameObject, {
// maxSpeed: 200,
// acceleration: 200,
// drag: 0.99,
// turnSpeed: 300,
// wrap: true,
// padding: 0,
// enable: true,
// cursorKeys: scene.input.keyboard.createCursorKeys()
});
Movement
maxSpeed
acceleration
drag
Rotation
turnSpeed : Angular velocity
Wrap
wrap : Set true to enable wrap mode. Default value is true.
padding
enable : set false to disable moving.
cursorKeys : CursorKey object, using keyboard's cursorKeys by default.
Set max speed¶
ship.setMaxSpeed(speed);
Set acceleration¶
ship.setAcceleration(acc);
Set drag¶
ship.setDrag(drag);
Set turn speed¶
ship.setTurnSpeed(angularVelocity);
Set wrap mode¶
ship.setWrapMode(wrap, padding);
wrap : Set true to enable wrap mode.