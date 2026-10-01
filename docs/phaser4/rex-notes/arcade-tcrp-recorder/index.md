Recoder
Introduction¶
Recorder of T ime-C ommand-R ecorder-P layer with Arcade physics engine, to store commands with time.
Author: Rex
Member of scene
Arcade physics engine is fixed-step based, not tick time based.
This Arcade-TCRP has better result of replaying, which store step count via WORLD_STEP(worldstep) event.
Live demos¶
Player
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexarcadetcrpplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexarcadetcrpplugin.min.js', true);
Create instance
var recorder = scene.plugins.get('rexarcadetcrpplugin').addRecorder(scene);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import TCRPPlugin from 'phaser4-rex-plugins/plugins/arcadetcrp-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexTCRP',
plugin: TCRPPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Create instance
var recorder = scene.plugins.get('rexTCRP').addRecorder(scene);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import TCRP from 'phaser4-rex-plugins/plugins/arcadetcrp.js';
Create instance
var recorder = new TCRP.Recorder(scene);
Create instance¶
var recorder = scene.plugins.get('rexTCRP').addRecorder(scene);
Start recording¶
recorder.start();
// recorder.start(startAt);  // start-at in step-count
Push commands¶
recorder.addCommand([fnName, param0, param1, ...]);
// recorder.addCommand([command0, command1, ...]);
// recorder.addCommand([fnName, param0, param1, ...], offset);  // time-offset in step-count
See also Run commands
Get commands¶
var commands = recorder.getCommands();        // Get a shallow copy of commands
// var commands = recorder.getCommands(true); // Get reference of commands
Format of return commands:
[
[time, [command]],
[time, [command0,command1]],
...
]
time : Time in step-count
Pause, Resume, stop recording¶
recorder.pause();
recorder.resume();
recorder.stop();
Seek elapsed time¶
recorder.seek(time);   // elapsed time in step-count
State of recorder¶
var isRecording = recorder.isRecording;
var now = recorder.now;
now : Now time in step-count.
Time-scale¶
Set
recorder.setTimeScale(value);
// recorder.timeScale = value;
timeScale : An integer equal or larger than 1
Get
var timeScale = recorder.timeScale;