Player
Introduction¶
Player of T ime-C ommand-R ecorder-P layer with Arcade physics engine, to run commands on time.
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
var player = scene.plugins.get('rexarcadetcrpplugin').addPlayer(scene, config);
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
var player = scene.plugins.get('rexTCRP').addPlayer(scene, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import TCRP from 'phaser4-rex-plugins/plugins/arcadetcrp.js';
Create instance
var player = new TCRP.Player(scene, config);
Create instance¶
var player = scene.plugins.get('rexTCRP').addPlayer(scene, {
// commands: [],       // [[time, command], [time, command], ...]
// timeScale: 1,
// scope: undefined
});
commands : see next section
timeScale : An integer equal or larger than 1
Load commands¶
player.load(commands, scope);
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
time : Time in step-count
Start playing¶
player.start();
// player.start(startAt);  // Start-at time in step-count
Events¶
Complete
player.on('complete', function(player){});
Run command
player.on('runcommand', function(commands, scope){});
Pause, Resume, stop playing¶
player.pause();
player.resume();
player.stop();
Seek elapsed time¶
player.seek(time);   // Elapsed time in step-count
State of player¶
var isPlaying = player.isPlaying;
var completed = player.completed;
var now = player.now;
Time-scale¶
Set
player.setTimeScale(value);
// player.timeScale = value;
timeScale : An integer equal or larger than 1
Get
var timeScale = player.timeScale;