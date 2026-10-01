Move to
Introduction¶
Move game object towards target position with a steady speed.
Author: Rex
Behavior of game object
Live demos¶
Move-to
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexmovetoplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexmovetoplugin.min.js', true);
Add move-to behavior
var moveTo = scene.plugins.get('rexmovetoplugin').add(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import MoveToPlugin from 'phaser4-rex-plugins/plugins/moveto-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexMoveTo',
plugin: MoveToPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add move-to behavior
var moveTo = scene.plugins.get('rexMoveTo').add(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import MoveTo from 'phaser4-rex-plugins/plugins/moveto.js';
Add move-to behavior
var moveTo = new MoveTo(gameObject, config);
Create instance¶
var moveTo = scene.plugins.get('rexMoveTo').add(gameObject, {
// speed: 400,
// rotateToTarget: false,
// appendMode: false,
// continueAfterComplete: false
});
speed : Moving speed, pixels in second.
rotateToTarget : Set true to change angle towards path.
appendMode : Set true to queue new targets when already moving, for smoother motion.
continueAfterComplete : Set true to continue moving in the same tick when calling moveTo() in the complete event callback.
Start moving¶
Move to target position
moveTo.moveTo(x, y);
or
moveTo.moveTo({
x: 0,
y: 0,
// speed: 0
});
x , y : Target position
Behavior by appendMode : When true, add target to queue if already moving. When false, replace current target.
Move from start position to current position
moveTo.moveFrom(x, y);
or
moveTo.moveFrom({
x: 0,
y: 0,
// speed: 0
});
x , y : Start position
Move toward angle
moveTo.moveToward(angle, distance);
angle : Angle in radian.
Target position¶
var targetX = moveTo.targetX;
var targetY = moveTo.targetY;
Enable¶
Enable (default)
moveTo.setEnable();
or
moveTo.enable = true;
Disable
moveTo.setEnable(false);
or
moveTo.enable = false;
Clear targets¶
Clear queued targets for appendMode.
moveTo.clearTargets();
Pause, Resume, stop moving¶
moveTo.pause();
moveTo.resume();
moveTo.stop();
moveTo.stop() : Stop moving, call moveTo.clearTargets() to clear targets.
Set speed¶
moveTo.setSpeed(speed);
// moveTo.speed = speed;
Set rotate-to-target¶
moveTo.setRotateToTarget(rotateToTarget);
rotateToTarget : Set true to change angle towards target
Events¶
On start moving
moveTo.on('start', function(gameObject, moveTo){});
On reached target
moveTo.on('complete', function(gameObject, moveTo){});
// moveTo.once('complete', function(gameObject, moveTo){});
Set continueAfterComplete to true to consume the remaining movement distance
in the same tick when calling moveTo() in this callback.
// var moveTo = scene.plugins.get('rexMoveTo').add(gameObject, {
//     continueAfterComplete: true
// });
moveTo.on('complete', function(gameObject, moveTo) {
moveTo.moveTo(nextX, nextY);
});
Status¶
Is moving
var isRunning = moveTo.isRunning;