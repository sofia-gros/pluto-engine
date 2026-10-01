Click outside
Introduction¶
Fires 'clickoutside' event when pointer-down or pointer-up outside of game object.
Author: Rex
Behavior of game object
Live demos¶
Click outside
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexclickoutsideplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexclickoutsideplugin.min.js', true);
Add click-outside behavior
var clickOutside = scene.plugins.get('rexclickoutsideplugin').add(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import ClickOutsidePlugin from 'phaser4-rex-plugins/plugins/clickoutside-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexClickOutsiden',
plugin: ClickOutsidePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add click-outside behavior
var clickOutside = scene.plugins.get('rexClickOutsiden').add(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import ClickOutside from 'phaser4-rex-plugins/plugins/clickoutside.js';
Add clickoutside behavior
var clickOutside = new ClickOutside(gameObject, config);
Create instance¶
var clickOutside = scene.plugins.get('rexClickOutside').add(gameObject, {
// enable: true,
// mode: 1,              // 0|'press'|1|'release'
// clickInterval: 100,   // ms
// threshold: undefined
});
enable : Clickable.
mode :
'pointerdown', 'press', or 0 : Fire 'click' event when touch pressed.
'pointerup', 'release', or 1 : Fire 'click' event when touch released after pressed.
clickInterval : Interval between 2 'click' events, in ms.
threshold : Cancel clicking detecting when dragging distance is larger then this threshold.
undefined : Ignore this feature. Default behavior.
Events¶
Click-outside
clickOutside.on('clickoutside', function (clickoutside, gameObject, pointer) {
// ...
}, scope);
Enable
clickOutside.on('enable', function (clickoutside, gameObject) {
// ...
}, scope);
Disable
clickOutside.on('disable', function (clickoutside, gameObject) {
// ...
}, scope);
Enable¶
Get
var enabled = clickOutside.enable;  // enabled: true, or false
Set
clickOutside.setEnable(enabled);  // enabled: true, or false
// clickOutside.enable = enabled;
Toggle
clickOutside.toggleEnable();
Set mode¶
clickOutside.setMode(mode);
mode :
'press', or 0 : Fire 'click' event when touch pressed.
'release', or 1 : Fire 'click' event when touch released after pressed.
Set click interval¶
clickOutside.setClickInterval(interval);  // interval in ms
Set dragging threshold¶
clickOutside.setDragThreshold(distance);  // distance in pixels