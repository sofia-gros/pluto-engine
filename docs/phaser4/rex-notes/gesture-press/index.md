Press
Introduction¶
Get press events of a game object.
Author: Rex
Behavior of game object
Live demos¶
Press object
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexgesturesplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgesturesplugin.min.js', 'rexGestures', 'rexGestures');
Add press input
var press = scene.rexGestures.add.press(config);
// var press = scene.rexGestures.add.press(gameObject, config);
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
Add press input
var press = scene.rexGestures.add.press(config);
// var press = scene.rexGestures.add.press(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { Press } from 'phaser4-rex-plugins/plugins/gestures.js';
Add press input
var press = new Press(scene, config);
// var press = new Press(gameObject, config);
Create instance¶
Press input
var press = scene.rexGestures.add.press({
// enable: true,
// bounds: undefined,
// time: 251,
// threshold: 9,
});
enable : Set false to disable input events.
bounds : Touch detecting area rectangle, if game obect is not given.
undefined : Ignore this feature, default behavior.
time : Minimal time of the pointer to be pressed.
threshold : Minimal movement when pointer is down.
Press behavior of game object
var press = scene.rexGestures.add.press(gameObject, {
// enable: true,
// time: 251,
// threshold: 9,
});
Enable¶
Get
var enable = press.enable;  // enable: true, or false
Set
press.setEnable(enable);  // enable: true, or false
// press.enable = enable;
Toggle
press.toggleEnable();
Events¶
Pressing start¶
press.on('pressstart', function(press, gameObject, lastPointer){
}, scope);
press.gameObject : Parent gameobject of this press behavior.
press.worldX, press.worldY : World position of pressing start.
press.x, press.y : Scene position of pressing start.
gameObject, press.gameObject : Parent gameobject of this press behavior.
lastPointer : Last touch pointer.
Pressing end¶
press.on('pressend', function(press, gameObject, lastPointer){
}, scope);
Is pressing¶
var isPressing = press.isPressing;
Return true if pressed.
Is pointer inside another game object¶
Under any press event,
press.on('pressstart', function(press){
var isPointerInsideGameObject = press.isPointerInGameObject(anotherGameObject);
});
Other properties¶
Hold time
Get
var holdTime = press.holdTime;
Set
press.setHoldTime(holdTime);
// press.holdTime = holdTime;
Drag threshold
Get
var dragThreshold = press.dragThreshold;
Set
press.setDragThreshold(dragThreshold);
// press.dragThreshold = dragThreshold;
Detect bounds
Get
var bounds = press.bounds;
Set
press.setDetectBounds(bounds);
// press.bounds = bounds;