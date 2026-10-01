Touch event stop
Introduction¶
Stop touch events propagation.
Author: Rex
Behavior of game object
Live demos¶
Stop touch events
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rextoucheventstopplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextoucheventstopplugin.min.js', true);
Add touch-event-stop behavior
var touchEventStop = scene.plugins.get('rextoucheventstopplugin').add(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import TouchEventStopPlugin from 'phaser4-rex-plugins/plugins/toucheventstop-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexTouchEventStop',
plugin: TouchEventStopPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add touch-event-stop behavior
var touchEventStop = scene.plugins.get('rexTouchEventStop').add(gameObject, config);
Import method¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import method
import TouchEventStop from 'phaser4-rex-plugins/plugins/toucheventstop.js';
Add touch-event-stop behavior
var touchEventStop = newe TouchEventStop(gameObject, config);
Create instance¶
var touchEventStop = scene.plugins.get('rexTouchEventStop').add(gameObject, {
// hitAreaMode: 0,    // 0|1|'default'|'fullWindow'
// enable: true
});
hitAreaMode : Mode of hit-area
0, or 'default' : Set hit-area to size of game object, only touch events on this game object will be stopped..
1, or 'fullWindow' : Set hit-area to whole window, all touch events will be stopped.
enable : Set false to disable touch-event-stop behavior.
Enable¶
Get
var enable = touchEventStop.enable;  // enable: true, or false
Set
touchEventStop.setEnable(enable);  // enable: true, or false
// touchEventStop.enable = enable;
Toggle
touchEventStop.toggleEnable();