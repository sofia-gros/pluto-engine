Bullet
Introduction¶
Move game object toward current angle of game object, with a constant speed.
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
scene.load.plugin('rexbulletplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbulletplugin.min.js', true);
Add bullet behavior
var bullet = scene.plugins.get('rexbulletplugin').add(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Enable arcade physics engine and install plugin in configuration of game
import BulletPlugin from 'phaser4-rex-plugins/plugins/bullet-plugin.js';
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
key: 'rexBullet',
plugin: BulletPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add bullet behavior
var bullet = scene.plugins.get('rexBullet').add(gameObject, config);
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
import Bullet from 'phaser4-rex-plugins/plugins/bullet.js';
Add bullet behavior
var bullet = new Bullet(gameObject, config);
Create instance¶
var bullet = scene.plugins.get('rexBullet').add(gameObject, {
speed: 200,
// wrap: false,
// padding: 0,
// enable: true,
// angle: undefined,
// rotation: undefined
});
speed : moving speed, pixels in second.
Wrap
wrap : Set true to enable wrap mode. Default value is false.
padding
enable : set false to disable moving.
angle, rotation :
undefined : Use angle of game object as angle of bullet. Default value.
A number : Angle of bullet, in degrees or radians.
Speed¶
Set
bullet.setSpeed(speed);
// bullet.speed = speed;
Get
var speed = bullet.speed;
Set wrap mode¶
bullet.setWrapMode(wrap, padding);
wrap : Set true to enable wrap mode.
Angle¶
Set angle
bullet.setAngle(degrees);
// bullet.angle = degrees;
or
bullet.setRotation(radians);
// bullet.rotation  = radians;
Use angle of game object
bullet.setAngle();
// bullet.setRotation();