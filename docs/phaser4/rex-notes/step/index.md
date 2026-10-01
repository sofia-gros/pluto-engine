Step
Introduction¶
Interpolate points between previous position and current position with fixed step length.
Author: Rex
Behavior of game object
Live demos¶
Step
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexstepplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexstepplugin.min.js', true);
Add step behavior
var step = scene.plugins.get('rexstepplugin').add(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import StepPlugin from 'phaser4-rex-plugins/plugins/step-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexStep',
plugin: StepPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add move-to behavior
var step = scene.plugins.get('rexStep').add(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import Step from 'phaser4-rex-plugins/plugins/step.js';
Add move-to behavior
var step = new Step(gameObject, config);
Create instance¶
var step = scene.plugins.get('rexStep').add(gameObject, {
// enable: true,
// stepLength: 5,
});
enable : Set true to fire step event for each interpolate point.
stepLength : Fixed length between each interpolate point.
Enable¶
Enable (default)
step.setEnable();
or
step.enable = true;
Disable
step.setEnable(false);
or
step.enable = false;
Set step length¶
step.setStepLength(stepLength);
// step.stepLength = stepLength;
Events¶
On each interpolate point
step.on('step', function(gameObject, step, x, y){
}, scope);
Invoke step.cancelStep() to cancel interpolation.
On interpolate points between previous position and current position
step.on('steps', function(gameObject, step, points){
}, scope);
points : Array of point {x, y}
Inject methods¶
Inject methods into game object
scene.plugins.get('rexStep').injectMethods(gameObject);
Inject methods into class of game object
scene.plugins.get('rexStep').injectMethods(GameObjectClass.prototype);
// scene.plugins.get('rexStep').injectMethods(Phaser.GameObjects.Sprite.prototype);
Inject methods into class of game object
scene.plugins.get('rexStep').injectMethods(GameObjectClass.prototype);
// scene.plugins.get('rexStep').injectMethods(Phaser.GameObjects.Sprite.prototype);
Inject methods into root class of game object
scene.plugins.get('rexStep').injectMethodsToRootClass(e);
// scene.plugins.get('rexStep').injectMethods(Phaser.GameObjects.GameObject.prototype);
Injected methods¶
Step start
gameObject.stepStart(stepLength);
// gameObject.stepStart({stepLength});
Step stop
gameObject.stepStop();
Events
Step
gameObject.on('step.step', function(gameObject, x, y) {
});