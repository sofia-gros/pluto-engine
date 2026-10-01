Interception
Introduction¶
Predict the intersection position of two game objects with constant moving speed.
Author: Rex
Behavior of game object
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexinterceptionplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinterceptionplugin.min.js', true);
Add interception behavior
var interception = scene.plugins.get('rexinterceptionplugin').add(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import InterceptionPlugin from 'phaser4-rex-plugins/plugins/interception-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexInterception',
plugin: InterceptionPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add interception behavior
var interception = scene.plugins.get('rexInterception').add(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import Interception from 'phaser4-rex-plugins/plugins/interception.js';
Add interception behavior
var interception = new Interception(gameObject, config);
Create instance¶
var interception = scene.plugins.get('rexInterception').add(gameObject, {
// target: undefined,
// enable: true
});
target : Game object.
enable : Set true to enable predicting.
Target¶
Set
interception.setTarget(gameObject);
or
interception.target = gameObject;
Disalbe
interception.setTarget(undefined);
or
interception.target = undefined;
Get
var target = interception.target;
Enable predicting¶
Enable
interception.setEnable();
Disable, uses target position as predicted position
interception.setEnable(false);
Predicted result¶
Predicted position
var position = interception.predictedPosition; // {x, y}
Angle to predicted position
var rotation = interception.predictedAngle; // Angle in radian