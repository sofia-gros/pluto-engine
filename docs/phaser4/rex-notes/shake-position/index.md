Shake position
Introduction¶
Shake position of game object.
Author: Rex
Behavior of game object
Live demos¶
Shake position
Shake position on mutliple game objects
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexshakepositionplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexshakepositionplugin.min.js', true);
Add shake-position behavior
var shakePosition = scene.plugins.get('rexshakepositionplugin').add(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import ShakePositionPlugin from 'phaser4-rex-plugins/plugins/shakeposition-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexShakePosition',
plugin: ShakePositionPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add shake-position behavior
var shakePosition = scene.plugins.get('rexShakePosition').add(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import ShakePosition from 'phaser4-rex-plugins/plugins/shakeposition.js';
Add shake-position behavior
var shakePosition = new ShakePosition(gameObject, config);
Create instance¶
var shake = scene.plugins.get('rexShake').add(gameObject, {
// mode: 1, // 0|'effect'|1|'behavior'
// duration: 500,
// magnitude: 10,
// magnitudeMode: 1, // 0|'constant'|1|'decay'
// axis: 0,      //0|'both'|'h&v'|1|'horizontal'|'h'|2|'vertical'|'v'
});
mode :
'effect', or 0 : Shake position in 'poststep' game event, and restore in 'prestep' game event.
'behavior', or 1 : Shake position in 'preupdate' scene event.
duration : Duration of shaking, in millisecond.
magnitude : The strength of the shake, in pixels.
magnitudeMode :
'constant', or 0 : Constant strength of the shake.
'decay', or 1 : Decay the strength of the shake.
axis :
'both','h&v', 'x&y', or 0 : Changing position on all directions.
'horizontal','h', 'x', or 1 : Changing position on horizontal/x axis.
'vertical','v', 'y', or 2 : Changing position on vertical/y axis.
Start shaking¶
shake.shake();
// shake.shake(duration, magnitude);
or
shake.shake({
duration: 500,
magnitude: 10
});
Stop shakeing¶
shake.stop();
Enable¶
Enable/resume (default)
shake.setEnable();
or
shake.enable = true;
Disable/pause
shake.setEnable(false);
or
shake.enable = false;
Set updating mode¶
shake.setMode(mode);
mode :
'effect', or 0 : Shake position in post-update stage, and restore in pre-update stage.
'behavior', or 1 : Shake position in pre-update stage.
Set duration¶
shake.setDuration(duration);
// shake.duration = duration;
Set magnitude¶
shake.setMagnitude(magnitude);
shake.magnitude = magnitude;
magnitude : The strength of the shake, in pixels.
Set magnitude mode¶
shake.setMagnitudeMode(magnitudeMode);
// shake.magnitudeMode = magnitudeMode;
magnitudeMode :
'constant', or 0 : Constant strength of the shake.
'decay', or 1 : Decay the strength of the shake.
Set axis mode¶
shake.setAxisMode(axis);
axis :
'both','h&v', 'x&y', or 0 : Dragging on all directions.
'horizontal','h', 'x', or 1 : Dragging on horizontal/x axis.
'vertical','v', 'y', or 2 : Dragging on vertical/y axis.
Events¶
On reached target
shake.on('complete', function(gameObject, shake){});
Status¶
Is shakeing
var isRunning = shake.isRunning;