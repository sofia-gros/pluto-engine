Rotate
Introduction¶
Get spin angle from 2 dragging touch pointers.
Author: Rex
Member of scene
Live demos¶
Rotate & rotate
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexgesturesplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgesturesplugin.min.js', 'rexGestures', 'rexGestures');
Add rotate input
var rotate = scene.rexGestures.add.rotate(config);
// var rotate = scene.rexGestures.add.rotate(gameObject, config);
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
Add rotate input
var rotate = scene.rexGestures.add.rotate(config);
// var rotate = scene.rexGestures.add.rotate(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { Rotate } from 'phaser4-rex-plugins/plugins/gestures.js';
Add rotate input
var rotate = new Rotate(scene, config);
// var rotate = new Rotate(gameObject, config);
Create instance¶
Rotate input
var rotate = scene.rexGestures.add.rotate({
// enable: true,
// bounds: undefined,
// threshold: 0,
});
enable : Set false to disable input events.
bounds : A rectangle object or undefined (to use game window as rectangle object), for detecting the position of cursor.
threshold : Fire rotate events after dragging distances of catched pointers are larger than this threshold.
Rotate behavior of game object
var rotate = scene.rexGestures.add.rotate(gameObject, {
// enable: true,
// bounds: undefined,
// threshold: 0,
});
Start rotation when pointer-down on this game object.
Enable¶
Get
var enable = rotate.enable;  // enable: true, or false
Set
rotate.setEnable(enable);  // enable: true, or false
// rotate.enable = enable;
Toggle
rotate.toggleEnable();
Events¶
On dragging¶
On dragging 1st touch pointer, fired when 1st touch pointer is moving
rotate.on('drag1', function(rotate) {
// var drag1Vector = rotate.drag1Vector; // drag1Vector: {x, y}
}, scope);
rotate.drag1Vector : Drag vector from prevoius touch position to current touch position of 1st catched touch pointer.
On dragging 2 touch pointers, fired when any catched touch pointer moved.
rotate.on('rotate', function(rotate) {
// rotate.spinObject(gameObejects);
// var angle = rotate.rotation;
}, scope);
rotate.spinObject(gameObejects) : Drag and spin an array of game object, or a game object around current center of 2 dragging pointers.
rotate.rotation : Return spin angle of 2 dragging pointers, in radius.
On drag start, on drag end¶
On drag 1 touch pointer start, fired when catching 1st touch pointer.
rotate.on('drag1start', function(rotate) {
}, scope);
On drag 1 touch pointer end, fired when releasing the last one catched touch pointer.
rotate.on('drag1end', function(rotate) {
}, scope);
On drag 2 touch pointers start, fired when catching 2 touch pointers.
rotate.on('rotatestart', function(rotate) {
}, scope);
On drag 2 touch pointers end, fired when releasing any catched touch pointer.
rotate.on('rotateend', function(rotate) {
}, scope);
Spin game object¶
rotate.spinObject(gameObejects);
Drag and spin game objects around current center of 2 dragging pointers. Uses this function under 'rotate' event.
gameObejects : An array of game object, or a game object.
Spin angle¶
var angle = rotate.rotation;
Spin angle of 2 dragging pointers, in radius.
Drag vector of 1st touch pointer¶
var drag1Vector = rotate.drag1Vector; // {x, y}
Catched touch pointers¶
Pointer 0, available when state is 1
var pointer0 = rotate.pointers[0];
Position of pointer
var x = pointer0.x;
var y = pointer0.y;
var worldX = pointer0.worldX;
var worldY = pointer0.worldY;
Pointer 1, available when state is 2
var pointer0 = rotate.pointers[1];
Is rtating¶
var isRotating = rotate.isRotating;
Return true if pinched.
Is pointer inside another game object¶
Under any rotate event,
rotate.on('rotate', function(rotate) {
var isPointer0InsideGameObject = rotate.isPointer0InGameObject(anotherGameObject);
var isPointer1InsideGameObject = rotate.isPointer1InGameObject(anotherGameObject);
});
Other properties¶
Drag threshold
Get
var dragThreshold = rotate.dragThreshold;
Set
rotate.setDragThreshold(dragThreshold);
// rotate.dragThreshold = dragThreshold;
Detect bounds
Get
var bounds = rotate.bounds;
Set
rotate.setDetectBounds(bounds);
// rotate.bounds = bounds;