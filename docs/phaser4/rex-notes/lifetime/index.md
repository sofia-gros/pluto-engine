Life time
Introduction¶
Destroy game object when time-out.
Author: Rex
Behavior of game object
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexlifetimeplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexlifetimeplugin.min.js', true);
Add life-time behavior
var lifeTime = scene.plugins.get('rexlifetimeplugin').add(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import LifeTimePlugin from 'phaser4-rex-plugins/plugins/lifetime-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexLifeTime',
plugin: LifeTimePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add life-time behavior
var lifeTime = scene.plugins.get('rexLifeTime').add(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import LifeTime from 'phaser4-rex-plugins/plugins/lifetime.js';
Add life-time behavior
var lifeTime = new LifeTime(gameObject, config);
Create instance¶
var lifeTime = scene.plugins.get('rexLifeTime').add(gameObject, {
lifeTime: 1000,
// destroy: true,
// start: true
});
lifeTime : Life time in ms.
destroy : Set true to destroy game object when time-out.
start: Set true to starting counting now.
Events¶
On time-out
lifeTime.on('complete', function(gameObject, lifeTime){});
// lifeTime.once('complete', function(gameObject, lifeTime){});
Life-time¶
Set
lifeTime.setLifeTime(time);
Add to
lifeTime.addToLifeTime(time);
Get life-time
var time = lifeTime.lifeTime;
Get remainder time
var time = lifeTime.remainder;
Is alive
var isAlive = lifeTime.isAlive;
Start/Stop/Pause/Resume¶
Start
lifeTime.start();
Stop
lifeTime.stop();
Pause
lifeTime.pause();
Resume
lifeTime.resume();