Recoder
Introduction¶
Recorder of T ime-C ommand-R ecorder-P layer, to store commands with time.
Author: Rex
Member of scene
Live demos¶
Replay drawing
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rextcrpplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextcrpplugin.min.js', true);
Create instance
var recorder = scene.plugins.get('rextcrpplugin').addRecorder(scene);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import TCRPPlugin from 'phaser4-rex-plugins/plugins/tcrp-plugin.js';
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
import TCRP from 'phaser4-rex-plugins/plugins/tcrp.js';
Create instance
var recorder = new TCRP.Recorder(scene);
Create instance¶
var recorder = scene.plugins.get('rexTCRP').addRecorder(scene);
Destroy when scene stopped
or
var recorder = scene.plugins.get('rexTCRP').addRecorder(gameObject);
Destroy when game object destroyed
Start recording¶
recorder.start();
// recorder.start(startAt);  // start-at time in ms
Push commands¶
recorder.addCommand([fnName, param0, param1, ...]);
// recorder.addCommand([command0, command1, ...]);
// recorder.addCommand([fnName, param0, param1, ...], offset);  // time-offset in ms
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
Clear commands¶
recorder.clear();
Pause, Resume, stop recording¶
recorder.pause();
recorder.resume();
recorder.stop();
Seek elapsed time¶
recorder.seek(time);   // elapsed time in ms
State of recorder¶
var isRecording = recorder.isRecording;
var now = recorder.now;
Time-scale¶
Set
recorder.setTimeScale(value);
// recorder.timeScale = value;
Get
var timeScale = recorder.timeScale;
Events¶
Start
recorder.on('start', function(scene, recorder){});
Pause
recorder.on('pause', function(scene, recorder){});
Resume
recorder.on('resume', function(scene, recorder){});
Stop
recorder.on('stop', function(scene, recorder){});