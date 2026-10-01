Anchor
Introduction¶
Set size and position based on visible window.
Note
Visible window will be changed when scale mode is ENVELOP, WIDTH_CONTROLS_HEIGHT, or HEIGHT_CONTROLS_WIDTH.
Author: Rex
Behavior of game object
Live demos¶
Anchor
Resize
Camera zoom/scroll
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexanchorplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexanchorplugin.min.js', true);
Add anchor behavior
var anchor = scene.plugins.get('rexanchorplugin').add(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import AnchorPlugin from 'phaser4-rex-plugins/plugins/anchor-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexAnchor',
plugin: AnchorPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add anchor behavior
var anchor = scene.plugins.get('rexAnchor').add(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import Anchor from 'phaser4-rex-plugins/plugins/anchor.js';
Add anchor behavior
var anchor = new Anchor(gameObject, config);
Create instance¶
var anchor = scene.plugins.get('rexAnchor').add(gameObject, {
// left: '0%+0',
// right: '0%+0',
// centerX: '0%+0',
// x: '0%+0',
// top: '0%+0',
// bottom: '0%+0',
// centerY: '0%+0',
// y: '0%+0',
// width: '100%+0',
// height: '100%+0',
// aspectRatio: false,
// onResizeCallback: function(width, height, gameObject, anchor) {},
// onResizeCallbackScope: undefined,
// onUpdateViewportCallback: function(viewport, gameObject, anchor) {},
// onUpdateViewportCallbackScope: undefined,
// enable: true
});
left, right, centerX, x, top, bottom, centerY, y : Position based on visible window, which composed of
Percentage of visible width/height : 'p%', p: 0 ~ 100.
'left'(=0%), 'center'(=50%), 'right'(=100%)
'top'(=0%), 'center'(=50%), 'bottom'(=100%)
Offset : '+n', or '-n'.
For example, anchor game object's left bound to viewport's left+10, centerY to viewport's center
{
left: 'left+10',
centerY: 'center'
}
width, height : Set size (invoke onResizeCallback) based on visible window, which composed of
Percentage of visible width/height : 'p%', p: 0 ~ 100.
Padding : '+n', or '-n'.
aspectRatio :
undefined, or false : Does not keep aspect ratio. Default behavior.
true : Use the current width and height as the aspect ratio.
A number : Use given number as the aspect ratio.
onResizeCallback, onResizeCallbackScope : Callback of resizing game object
undefined : Default resize method.
Custom method
function(width, height, gameObject, anchor) {
// gameObject.setSize(width, height);
// gameObject.setDisplaySize(width, height);
// ...
}
null or false : No callback
onUpdateViewportCallback, onUpdateViewportCallback : Callback invoked when viewport changed (anchor)
fucntion(viewport, gameObject, anchor) {
// Can change properties of viewport here
// var centerX = viewport.centerX,
//     centerY = viewport.centerY;
// viewport.width *= 0.8;
// viewport.height *= 0.9;
// viewport.centerX = centerX;
// viewport.centerY = centerY;
}
viewport： A rectangle object
enable :
undefined, or true : Anchor game object under 'resize' event of scale manager.
false : Won't anchor game object automatially.
Reset config¶
anchor.resetFromJSON({
// left: '0%+0',
// right: '0%+0',
// centerX: '0%+0',
// x: '0%+0',
// top: '0%+0',
// bottom: '0%+0',
// centerY: '0%+0',
// y: '0%+0',
// width: '100%+0',
// height: '100%+0',
// onUpdateViewportCallback: function(viewport, gameObject, anchor) {}
// onUpdateViewportCallbackScope: undefined,
})
left, right, centerX, x, top, bottom, centerY, y : Position based on visible window, which composed of
Percentage of visible width/height : 'p%', p: 0~100
'left'(=0%), 'center'(=50%), 'right'(=100%)
'top'(=0%), 'center'(=50%), 'bottom'(=100%)
Offset : '+n', or '-n'
width, height : Set size (invoke onResizeCallback) based on visible window, which composed of
Percentage of visible width/height : 'p%', p: 0 ~ 100.
Padding : '+n', or '-n'.
onResizeCallback, onResizeCallbackScope : Callback of resizing game object
function(width, height, gameObject, anchor) {
// gameObject.setSize(width, height);
// gameObject.setDisplaySize(width, height);
// ...
}
Set OnUpdateViewport callback¶
anchor.setUpdateViewportCallback(callback, scope);
callback :
fucntion(viewport, gameObject, anchor) {
// Can change properties of viewport here
// var centerX = viewport.centerX,
//     centerY = viewport.centerY;
// viewport.width *= 0.8;
// viewport.height *= 0.9;
// viewport.centerX = centerX;
// viewport.centerY = centerY;
}
viewport： A rectangle object
Manual anchor¶
anchor.anchor();
Auto anchor¶
Anchor game object under 'resize' event of scale manager.
anchor.autoAnchor();
// anchor.autoAnchor(true);
Disable auto-anchor
anchor.autoAnchor(false);