Clock
Introduction¶
A clock to count elapsed time.
Author: Rex
Member of scene
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexclockplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexclockplugin.min.js', true);
Add clock object
var clock = scene.plugins.get('rexclockplugin').add(scene, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import ClockPlugin from 'phaser4-rex-plugins/plugins/clock-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexClock',
plugin: ClockPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add clock object
var clock = scene.plugins.get('rexClock').add(scene, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import Clock from 'phaser4-rex-plugins/plugins/clock.js';
Add clock object
var clock = new Clock(scene, config);
Create instance¶
var clock = scene.plugins.get('rexClock').add(scene, {
// timeScale: 1
});
timeScale : time-scale for counting elapsed time.
Start counting¶
clock.start();
// clock.start(startAt);  // start-at time in ms
Force ticking¶
clock.tick(0);
// clock.tick(delta);
Get elapsed time¶
var now = clock.now;  // Elapsed time in ms
Pause, Resume, stop counting¶
clock.pause();
clock.resume();
clock.stop();
Seek elapsed time¶
clock.seek(time);   // elapsed time in ms
State of counting¶
var isRunning = clock.isRunning;
Time-scale¶
Get
var timeScale = clock.timeScale;
Set
clock.setTimeScale(timeScale);
// clock.timeScale = timeScale;
Events¶
On ticking
clock.on('update', function(now, delta){ })
now : Elapsed time in ms.
delta : Delta time in ms.