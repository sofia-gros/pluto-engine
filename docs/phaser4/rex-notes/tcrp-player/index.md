Player
Introduction¶
Player of T ime-C ommand-R ecorder-P layer, to run commands on time.
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
var player = scene.plugins.get('rextcrpplugin').addPlayer(scene, config);
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
var player = scene.plugins.get('rexTCRP').addPlayer(scene, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import TCRP from 'phaser4-rex-plugins/plugins/tcrp.js';
Create instance
var player = new TCRP.Player(scene, config);
Create instance¶
var player = scene.plugins.get('rexTCRP').addPlayer(scene, {
// timeUnit: 0,        // 'ms'|0|'s'|'sec'|1
// dtMode: 0,          // 'abs'|'absolute'|0|'inc'|'increment'|1
// commands: [],       // [[time, command], [time, command], ...]
// timeScale: 1,
// scope: undefined
});
scene : A scene object, or a game object.
timeUnit : see next section
dtMode : see next section
commands : see next section
timeScale
Load commands¶
player.load(commands, scope, {
// timeUnit: 0,        // 'ms'|0|'s'|'sec'|1
// dtMode: 0           // 'abs'|'absolute'|0|'inc'|'increment'|1
});
Commands : see also Run commands
[
[time, command],
[time, command],
...
]
Format of each row :
[time, fnName, param0, param1, ...]
// [time, callback, param0, param1, ...]
[time, [fnName, param0, param1, ...]]
// [time, [callback, param0, param1, ...]]
[time, [command0, command1, ...]]
timeUnit: time-unit of time
'ms', or 0 : time in millisecond
's', 'sec', or 1 : time in second
dtMode: mode of counting time
'abs', 'absolute', or 0 : timeout = time
'inc', 'increment', 1 : timeout = time + previous-time
Clear all commands¶
player.clear();
Append command¶
player.append(time, fn, param0, param1, ...);
time : Delay time
fn :
A function (callback) object.
A string , to get function (callback) object from scope.
param0, param1 ... : Parameters of callback.
Start playing¶
player.start();
// player.start(startAt);  // Start-at time in ms
Events¶
Start
player.on('start', function(scene, player){});
Pause
player.on('pause', function(scene, player){});
Resume
player.on('resume', function(scene, player){});
Stop
player.on('stop', function(scene, player){});
Complete
player.on('complete', function(scene, player){});
Run command
player.on('runcommand', function(commands, scope){});
Pause, Resume, stop playing¶
player.pause();
player.resume();
player.stop();
Seek elapsed time¶
player.seek(time);   // Elapsed time in ms
Seek to next command¶
player.seekToNext();
Seek to time of next command. i.e. run next command immediately.
State of player¶
var isPlaying = player.isPlaying;
var completed = player.completed;
var now = player.now;
Time-scale¶
Set
player.setTimeScale(value);
// player.timeScale = value;
Get
var timeScale = player.timeScale;