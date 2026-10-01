Pan
Introduction¶
Get pan events of a game object.
Author: Rex
Behavior of game object
Live demos¶
Camera scroll
Pan & rotate
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexgesturesplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgesturesplugin.min.js', 'rexGestures', 'rexGestures');
Add pan input
var pan = scene.rexGestures.add.pan(config);
// var pan = scene.rexGestures.add.pan(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import GesturesPlugin from 'phaser4-rex-plugins/plugins/gestures-plugin.js';
var config = {
// ...
plugins: {
scene: [{
key: 'rexGestures',
plugin: GesturesPlugin,
mapping: 'rexGestures'
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add pan input
var pan = scene.rexGestures.add.pan(config);
// var pan = scene.rexGestures.add.pan(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { Pan } from 'phaser4-rex-plugins/plugins/gestures.js';
Add pan input
var pan = new Pan(scene, config);
// var pan = new Pan(gameObject, config);
Create instance¶
Pan input
var pan = scene.rexGestures.add.pan({
// enable: true,
// bounds: undefined,
// threshold: 10,
});
enable : Set false to disable input events.
bounds : Touch detecting area rectangle, if game obect is not given.
undefined : Ignore this feature, default behavior.
threshold : Minimal movement when pointer is down.
Pan behavior of game object
var pan = scene.rexGestures.add.pan(gameObject, {
// enable: true,
// threshold: 10,
});
Enable¶
Get
var enable = pan.enable;  // enable: true, or false
Set
pan.setEnable(enable);  // enable: true, or false
// pan.enable = enable;
Toggle
pan.toggleEnable();
Events¶
Pan¶
pan.on('pan', function(pan, gameObject, lastPointer){
}, scope);
pan.dx, pan.dy : Vector from previous pointer to current pointer.
pan.dWorldX, pan.dWorld : Vector from previous pointer to current pointer, in world position. i.e,  including camera-zoom.
pan.worldX, pan.worldY : World position of current pointer.
pan.x, pan.y : Scene position of current pointer.
gameObject, pan.gameObject : Parent gameobject of this pan behavior.
lastPointer : Last touch pointer.
Pan start¶
pan.on('panstart', function(pan, gameObject, lastPointer){
}, scope);
pan.startWorldX, pan.startWorldY : World position of pan-start pointer.
pan.startX, pan.startY : Scene position of pan-start pointer.
gameObject, pan.gameObject : Parent gameobject of this pan behavior.
lastPointer : Last touch pointer.
Pan end¶
pan.on('panend', function(pan, gameObject, lastPointer){
}, scope);
pan.endWorldX, pan.endWorldY : World position of pan-end pointer.
pan.endX, pan.endY : Scene position of pan-end pointer.
gameObject, pan.gameObject : Parent gameobject of this pan behavior.
lastPointer : Last touch pointer.
Is panning¶
var isPanning = pan.isPanning;
Return true if panned.
Is pointer inside another game object¶
Under any pan event,
pan.on('panend', function(pan){
var isPointerInsideGameObject = pan.isPointerInGameObject(anotherGameObject);
});
Other properties¶
Drag threshold
Get
var dragThreshold = pan.dragThreshold;
Set
pan.setDragThreshold(dragThreshold);
// pan.dragThreshold = dragThreshold;
Detect bounds
Get
var bounds = pan.bounds;
Set
pan.setDetectBounds(bounds);
// pan.bounds = bounds;