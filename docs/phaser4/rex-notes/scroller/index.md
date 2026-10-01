Scroller
Introduction¶
Drag content. Slow down when dragging released, pull back when out of bounds.
Author: Rex
Behavior of game object
Live demos¶
Scroller
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexscrollerplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexscrollerplugin.min.js', true);
Add scroller behavior
var scroller = scene.plugins.get('rexscrollerplugin').add(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import ScrollerPlugin from 'phaser4-rex-plugins/plugins/scroller-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexScroller',
plugin: ScrollerPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add scroller behavior
var scroller = scene.plugins.get('rexScroller').add(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import Scroller from 'phaser4-rex-plugins/plugins/scroller.js';
Add scroller behavior
var scroller = new Scroller(gameObject, config);
Create instance¶
var scroller = scene.plugins.get('rexScroller').add(gameObject, {
bounds: [
bottomBound,
topBound
],
value: topBound,
// snapStep: undefined,
// threshold: 10,
// slidingDeceleration: 5000,
// backDeceleration: 2000,
// dragReverse: false,
// dragRate: 1,
// enable: true,
// orientation: 'vertical',
// pointerOutRelease: true,
// rectBoundsInteractive: false,
// valuechangeCallback: null,
// valuechangeCallbackScope: null,
// overmaxCallback: null,
// overmaxCallbackScope: null,
// overminCallback: null,
// overminCallbackScope: null,
});
bounds : An array of 2 values [bound0, bound1]
value : Initial value between bound0 and bound1
Map this value to position of content under event 'valuechange'
snapStep : The interval at which a value snaps to the nearest multiple.
undefined, or 0 : Disable snapping mode, default behavior.
threshold : Minimal movement to scroll. Set 0 to scroll immediately.
slidingDeceleration : Deceleration of slow down when dragging released.
Set false to disable it.
backDeceleration : Deceleration of pull back when out of bounds.
Set false to disable it.
dragReverse :
false : Dragging up will decrease value, dragging down will increase value. Default behavior.
Use this mode when scrolling by position of game object.
true : Dragging up will increase value, dragging down will decrease value.
Use this mode when scrolling by camera.
dragRate : Rate of dragging distance/dragging speed. Default value is 1.
enable : Set true to get dragging events.
orientation :
'vertical','v', 'y', or 0 : dragging on vertical/y axis.
'horizontal','h', 'x', or 1 : dragging on horizontal/x axis.
pointerOutRelease : Set to true to release input control when pointer out of gameObject. Default value is true.
rectBoundsInteractive :
false : Detect scrolling by game object's touch input. Default behavior.
true : Detect scrolling by rectangle bounds of game object.
valuechangeCallback , valuechangeCallbackScope : Bind this callback to valuechange event
overminCallback , overmaxCallbackScope : Bind this callback to overmax event
overminCallback , overminCallbackScope : Bind this callback to overmin event
Set bounds¶
this.setBounds(bounds);  // bounds: [bound0, bound1]
// this.setBounds(bound0, bound1);
Set deceleration¶
Deceleration of slow down when dragging released
scroller.setSlidingDeceleration(dec);
Disable
scroller.setSlidingDeceleration(false);
Deceleration of pull back when out of bounds
scroller.setBackDeceleration(dec);
Disable
scroller.setBackDeceleration(false);
Get value¶
var value = scroller.value;
Set value¶
Set value
scroller.value = newValue;
// scroller.setValue(newValue);
Set value, clamp between minValue and maxValue
scroller.setValue(newValue, true);
Add value
scroller.value += inc;
// scroller.addValue(inc);
Add value, clamp between minValue and maxValue
scroller.addValue(inc, true);
Fires valuechange event if new value is not equal to current value.
Events¶
Value changed
scroller.on('valuechange', function(newValue, prevValue){ /* ... */ });
Set position of content under this event
Value out of max/min bound
scroller.on('overmax', function(newValue, prevValue){ /* ... */ });
scroller.on('overmin', function(newValue, prevValue){ /* ... */ });
On drag start
scroller.on('dragstart', function() { /* ... */ });
On drag end
scroller.on('dragend', function() { /* ... */ });
Drag¶
Drag enable¶
Get
var enable = scroller.enable;
Set
scroller.setEnable();
// scroller.setEnable(enable);  // enable: true, or false
or
scroller.enable = enable; // enable: true, or false
Toggle
scroller.toggleEnable();
Is dragging¶
var isDragging = scroller.isDragging;
State machine¶
graph TB
IDLE["Idle"] --> |Drag| DRAG["Dragging<br>event 'valuechange'"]
DRAG --> |Release| OnRelease{"Under bounds?"}
OnRelease --> |Yes| SLIDE["Sliding<br>Sliding-deceleration"]
SLIDE --> |Stop| IDLE
SLIDE --> |Drag| DRAG
OnRelease --> |No| BACK["Pull back to bounds<br>Back-deceleration"]
BACK --> |Stop| IDLE
BACK --> |Drag| DRAG
Get state
var state = scroller.state;
'IDLE' : No dragging, no sliding
'DRAG' : Dragging
'SLIDE' : Sliding when dragging released
'BACK' : Sliding back to bound when out of bound