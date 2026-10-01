Tap
Introduction¶
Get tap/multi-taps events of a game object.
Author: Rex
Behavior of game object
Live demos¶
Tap object
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexgesturesplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgesturesplugin.min.js', 'rexGestures', 'rexGestures');
Add tap input
var tap = scene.rexGestures.add.tap(config);
// var tap = scene.rexGestures.add.tap(gameObject, config);
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
Add tap input
var tap = scene.rexGestures.add.tap(config);
// var tap = scene.rexGestures.add.tap(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { Tap } from 'phaser4-rex-plugins/plugins/gestures.js';
Add tap input
var tap = new Tap(scene, config);
// var tap = new Tap(gameObject, config);
Create instance¶
Tap input
var tap = scene.rexGestures.add.tap({
// enable: true,
// bounds: undefined,
// time: 250,
// tapInterval: 200,
// threshold: 9,
// tapOffset: 10,
// taps: undefined,
// minTaps: undefined,
// maxTaps: undefined,
});
enable : Set false to disable input events.
bounds : Touch detecting area rectangle, if game obect is not given.
undefined : Ignore this feature, default behavior.
time : Max time of the pointer to be down.
tapInterval : Max time between the multi-tap taps.
threshold : Minimal movement when pointer is down.
tapOffset : A multi-tap can be a bit off the initial position.
taps : Fire tap event only when taps count reaches this value.
undefined : Fire tap event only when tapped end. i.e pointer-up time exceeds tapInterval.
minTaps : Fire tap event only when taps count is larger than this value.
undefined : Don't check taps count.
maxTaps : Fire tap event only when taps count is less than this value.
undefined : Don't check taps count.
Tap behavior of game object
var tap = scene.rexGestures.add.tap(gameObject, {
// enable: true,
// time: 250,
// tapInterval: 200,
// threshold: 9,
// tapOffset: 10,
// taps: undefined,
// minTaps: undefined,
// maxTaps: undefined,
});
Enable¶
Get
var enable = tap.enable;  // enable: true, or false
Set
tap.setEnable(enable);  // enable: true, or false
// tap.enable = enable;
Toggle
tap.toggleEnable();
Events¶
Tap¶
tap.on('tap', function(tap, gameObject, lastPointer){
}, scope);
tap.tapsCount : Taps count.
gameObject, tap.gameObject : Parent gameobject of this tap behavior.
tap.worldX, tap.worldY : World position of first tapping.
tap.x, tap.y : Scene position of first tapping.
lastPointer : Last touch pointer.
tap.on(tapsCount + 'tap', function(tap, gameObject, lastPointer){
}, scope);
tapsCount + 'tap' : 1tap, 2tap, 3tap, etc ...
Tapping start¶
Each pointer-down will increase taps count and fire tappingstart event.
tap.on('tappingstart', function(tap, gameObject, lastPointer){
}, scope);
Is tapping¶
var isTapping = tap.isTapping;
Return true if tapped end.
Is pointer inside another game object¶
Under any tap event,
tap.on('tap', function(tap){
var isPointerInsideGameObject = tap.isPointerInGameObject(anotherGameObject);
});
Other properties¶
Hold time
Get
var holdTime = tap.holdTime;
Set
tap.setHoldTime(holdTime);
// tap.holdTime = holdTime;
Tap interval
Get
var tapInterval = tap.tapInterval;
Set
tap.setTapInterval(tapInterval);
// tap.tapInterval = tapInterval;
Drag threshold
Get
var dragThreshold = tap.dragThreshold;
Set
tap.setDragThreshold(dragThreshold);
// tap.dragThreshold = dragThreshold;
Tap offset
Get
var tapOffset = tap.tapOffset;
Set
tap.setTapOffset(tapOffset);
// tap.tapOffset = tapOffset;
Max taps
Get
var maxTaps = tap.maxTaps;
Set
tap.setMaxTaps(maxTaps);
// tap.maxTaps = maxTaps;
Min taps
Get
var minTaps = tap.minTaps;
Set
tap.setMinTaps(minTaps);
// tap.minTaps = minTaps;
Taps
taps.setTaps(taps);
// taps.setTaps(minTaps, maxTaps);
Detect bounds
Get
var bounds = taps.bounds;
Set
taps.setDetectBounds(bounds);
// taps.bounds = bounds;