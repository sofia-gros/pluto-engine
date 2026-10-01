Rotate to
Introduction¶
Rotate game object towards target position with a steady speed.
Author: Rex
Behavior of game object
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexrotatetoplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexrotatetoplugin.min.js', true);
Add rotate-to behavior
var rotateTo = scene.plugins.get('rexrotatetoplugin').add(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import RotateToPlugin from 'phaser4-rex-plugins/plugins/rotateto-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexRotateTo',
plugin: RotateToPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add rotate-to behavior
var rotateTo = scene.plugins.get('rexRotateTo').add(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import RotateTo from 'phaser4-rex-plugins/plugins/rotateto.js';
Add rotate-to behavior
var rotateTo = new RotateTo(gameObject, config);
Create instance¶
var rotateTo = scene.plugins.get('rexRotateTo').add(gameObject, {
// speed: 180,
// enable: true,
// timeScale: 1,
});
speed : Turn speed, degrees in second
Start moving¶
Rotate game object towards position¶
Shortest angle
rotateTo.rotateTowardsPosition(x, y);
x , y : Target position
Clockwise/counter-clockwise
rotateTo.rotateTowardsPosition(x, y, dir);
// rotateTo.rotateTowardsPosition(x, y, dir, speed);
dir :
0 : Shortest angle
1, or 'cw' : Clockwise
2, or 'ccw' : Counter-clockwise
speed : Turn speed, degrees in second
Rotate game object to angle¶
Shortest angle
rotateTo.rotateTo(angle);
angle : Target angle in degrees
Clockwise/counter-clockwise
rotateTo.rotateTo(angle, dir);
// rotateTo.rotateTo(angle, dir, speed);
dir :
0 : Shortest angle
1, or cw : Clockwise
2, or ccw : Counter-clockwise
speed : Turn speed, degrees in second
Enable¶
Enable (default)
rotateTo.setEnable();
or
rotateTo.enable = true;
Disable
rotateTo.setEnable(false);
or
rotateTo.enable = false;
Pause, Resume, stop rotating¶
rotateTo.pause();
rotateTo.resume();
rotateTo.stop();
Set speed¶
rotateTo.setSpeed(speed);
// rotateTo.speed = speed;
speed : Turn speed, degrees in second
Events¶
On rotating start
rotateTo.on('start', function(gameObject, rotateTo){});
On reached target
rotateTo.on('complete', function(gameObject, rotateTo){});
Status¶
Is moving
var isRunning = rotateTo.isRunning;