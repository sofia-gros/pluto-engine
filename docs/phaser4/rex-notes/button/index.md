Click/Button
Introduction¶
Fires 'click' event when touch releasd after pressed.
Author: Rex
Behavior of game object
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexbuttonplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbuttonplugin.min.js', true);
Add button behavior
var button = scene.plugins.get('rexbuttonplugin').add(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import ButtonPlugin from 'phaser4-rex-plugins/plugins/button-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexButton',
plugin: ButtonPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add button behavior
var button = scene.plugins.get('rexButtonn').add(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import Button from 'phaser4-rex-plugins/plugins/button.js';
Add button behavior
var button = new Button(gameObject, config);
Create instance¶
var button = scene.plugins.get('rexButton').add(gameObject, {
// enable: true,
// mode: 1,              // 0|'press'|1|'release'
// clickInterval: 100    // ms
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
Click
button.on('click', function (button, gameObject, pointer, event) {
// ...
}, scope);
Cancel remaining touched events : event.stopPropagation()
Enable
button.on('enable', function (button, gameObject) {
// ...
}, scope);
Disable
button.on('disable', function (button, gameObject) {
// ...
}, scope);
Pointer over
button.on('over', function (button, gameObject, pointer, event) {
// ...
}, scope);
Pointer out
button.on('out', function (button, gameObject, pointer, event) {
// ...
}, scope);
Pointer down
button.on('down', function (button, gameObject, pointer, event) {
// ...
}, scope);
Pointer up
button.on('up', function (button, gameObject, pointer, event) {
// ...
}, scope);
Enable¶
Get
var enabled = button.enable;  // enabled: true, or false
Set
button.setEnable(enabled);  // enabled: true, or false
// button.enable = enabled;
Toggle
button.toggleEnable();
Set mode¶
button.setMode(mode);
mode :
'press', or 0 : Fire 'click' event when touch pressed.
'release', or 1 : Fire 'click' event when touch released after pressed.
Set click interval¶
button.setClickInterval(interval);  // interval in ms
Set dragging threshold¶
button.setDragThreshold(distance);  // distance in pixels