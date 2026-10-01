Toggle switch
Introduction¶
Toggle-switch input.
Author: Rex
Game object
Live demos¶
Toggle-switch
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rextoggleswitchplugin', 'https://raw.githubusercontent.com/rexrainbow/    phaser3-rex-notes/master/dist/rextoggleswitchplugin.min.js', true);
Add toggle-switch input
var toggleSwitch = scene.add.rexToggleSwitch(x, y, width, height, color, config);
Add toggle-switch shape (without click input)
var toggleSwitch = scene.add.rexToggleSwitchShape(x, y, width, height, color, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import ToggleSwitchPlugin from 'phaser4-rex-plugins/plugins/toggleswitch-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexToggleSwitchPlugin',
plugin: ToggleSwitchPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add toggle-switch input
var toggleSwitch = scene.add.rexToggleSwitch(x, y, width, height, color, config);
Add toggle-switch shape (without click input)
var toggleSwitch = scene.add.rexToggleSwitchShape(x, y, width, height, color, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import ToggleSwitch from 'phaser4-rex-plugins/plugins/toggleswitch.js';
Add toggle-switch input
var toggleswitch = new ToggleSwitch(scene, x, y, width, height, color, config);
scene.add.existing(toggleSwitch);
Add toggle-switch shape (without click input)
// import ToggleSwitchShape from 'phaser4-rex-plugins/plugins/toggleswitchshape.js';
var toggleSwitch = new ToggleSwitchShape(scene, x, y, width, height, color, config);
scene.add.existing(toggleSwitch);
Create toggle-switch input¶
var toggleSwitch = scene.add.rexToggleSwitch(x, y, width, height, color, config);
or
var toggleSwitch = scene.add.rexToggleSwitch({
x: 0,
y: 0,
width: undefined,
height: undefined,
color: 0x005cb2,
trackFillAlpha: 1,
falseValueTrackColor: undefined,
falseValueTrackFillAlpha: 1,
thumbColor: 0xffffff,
thumbAlpha: 1,
trackWidth: 0.9,
trackHeight: 0.5,
trackCornerRadius: (trackHeight * 0.5),
thumbHeight: (trackHeight * 0.9),
thumbWidth: (thumbHeight),
thumbCornerRadius: (thumbHeight * 0.5),
thumbLeft: 0.3,
thumbRight: (1 - thumbLeft),
rtl: false,
animationDuration: 150,
value: false,
click: undefined,
// click: {
//     mode: 1,            // 0|'press'|1|'release'
//     clickInterval: 100  // ms
//     threshold: undefined
// },
readOnly: false,
});
width, height : Size of toggleswitch.
Track fill style
color, trackFillAlpha : Track color and alpha when value is true.
falseValueTrackColor, falseValueTrackFillAlpha : Track color and alpha when value is false.
Default value of falseValueTrackColor is the grayscale of color.
Thumb fill style
thumbColor, thumbAlpha : Thumb color and alpha
Track size
trackWidth : Width ration of track. Default value is 0.9.
thumbWidth : Height ratio of track. Default value is 0.5.
trackCornerRadius : Ratio of track corner. Default value is half of trackHeight.
Thumb size
thumbWidth : Width ration of thumb. Default value is equal to thumbHeight.
thumbHeight : Height ratio of thumb. Default value trackHeight * 0.5.
thumbCornerRadius : Ratio of thumb corner. Default value is half of thumbHeight.
Thumb position
thumbLeft : Thumb position if value is false. Default value is 0.3.
thumbRight : Thumb position if value is true. Default value is 1 - thumbLeft.
rtl : Moving direction of thumb when when value changes from false to true.
false : Thumb moves from left to right. Default behavior.
true : Thumb moves from right to left.
animationDuration : Duration of drawing path of checker.
value : Initial value.
click : Configuration of click input
click.mode :
'pointerdown', 'press', or 0 : Fire 'click' event when touch pressed.
'pointerup', 'release', or 1 : Fire 'click' event when touch released after pressed.
click.clickInterval : Interval between 2 'click' events, in ms.
click.threshold : Cancel clicking detecting when dragging distance is larger then this threshold.
undefined : Ignore this feature. Default behavior.
readOnly : Set ture to disable input.
Custom class¶
Define class
class MyToggleSwitch extends RexPlugins.GameObjects.ToggleSwitch {
constructor(scene, x, y, width, height, color, config) {
super(scene, x, y, width, height, color, config);
// ...
scene.add.existing(this);
}
// ...
// preUpdate(time, delta) {}
}
scene.add.existing(gameObject) : Adds an existing Game Object to this Scene.
If the Game Object renders, it will be added to the Display List.
If it has a preUpdate method, it will be added to the Update List.
Create instance
var toggleSwitch = new MyToggleSwitch(scene, x, y, width, height, color, config);
Value¶
Get
var value = toggleSwitch.value;
// var value = toggleSwitch.value;
Set
toggleSwitch.setValue(value);
// toggleSwitch.setValue(value, duration);
or
toggleSwitch.value = value;
Toggle
toggleSwitch.toggleValue();
// toggleSwitch.toggleValue(duration);
or
toggleSwitch.value = !toggleSwitch.value;
// toggleSwitch.value = !toggleSwitch.value;
Read only¶
Get
var readOnly = toggleSwitch.readOnly;
Set
toggleSwitch.setReadOnly();
// toggleSwitch.setReadOnly(true);
or
toggleSwitch.readOnly = true;
Track fill style¶
Get
var color = toggleSwitch.trackFillColor;
var alpha = toggleSwitch.trackFillAlpha;
var color = toggleSwitch.falseValueTrackColor;
var alpha = toggleSwitch.falseValueTrackFillAlpha;
Set
toggleSwitch.setTrackFillStyle(color, alpha);
// toggleSwitch.trackFillColor = color;
// toggleSwitch.trackFillAlpha = alpha;
toggleSwitch.setFalseValueTrackFillStyle(color, alpha);
// toggleSwitch.falseValueTrackColor = color;
// toggleSwitch.falseValueTrackFillAlpha = alpha;
Thumb fill style¶
Get
var color = toggleSwitch.thumbColor;
var alpha = toggleSwitch.thumbAlpha;
Set
toggleSwitch.setThumbStyle(color, alpha);
// toggleSwitch.thumbColor = color;
// toggleSwitch.thumbAlpha = alpha;
Toggle animation¶
Duration
Get
var duration = toggleSwitch.toggleAnimProgress;
Set
toggleSwitch.setToggleAnimationDuration(duration);
toggleSwitch.toggleAnimProgress = duration;
Size¶
Get
var width = toggleSwitch.width;
var height = toggleSwitch.height;
Set
toggleSwitch.setSize(width, height);
or
toggleSwitch.width = width;
toggleSwitch.height = height;
Display size¶
Get
var width = toggleSwitch.displayWidth;
var height = toggleSwitch.displayHeight;
Set
toggleSwitch.setDisplaySize(width, height);
or
toggleSwitch.displayWidth = width;
toggleSwitch.displayHeight = height;
Track size ratio¶
Get
var trackWidth = toggleSwitch.trackWidth;
var trackHeight = toggleSwitch.trackHeight;
trackWidth, trackHeight : Size ratio of track
Set
toggleSwitch.setTrackSize(trackWidth, trackHeight);
// toggleSwitch.trackWidth = trackWidth;
// toggleSwitch.trackHeight = trackHeight;
Track corner ratio¶
Get
var trackRadius = toggleSwitch.trackRadius;
trackRadius : Corner ratio of track
Set
toggleSwitch.setTrackRadius(trackRadius);
// toggleSwitch.trackRadius = trackRadius;
Thumb size ratio¶
Get
var thumbWidth = toggleSwitch.thumbWidth;
var thumbHeight = toggleSwitch.thumbHeight;
trackWidth, trackHeight : Size ratio of thumb
Set
toggleSwitch.setThumbSize(thumbWidth, thumbHeight);
// toggleSwitch.thumbWidth = thumbWidth;
// toggleSwitch.thumbHeight = thumbHeight;
Thumb corner ratio¶
Get
var thumbRadius = toggleSwitch.thumbRadius;
thumbRadius : Corner ratio of track
Set
toggleSwitch.setThumbRadius(thumbRadius);
// toggleSwitch.thumbRadius = thumbRadius;
Thumb position ratio¶
Get
var thumbLeft = toggleSwitch.thumbLeftX;
var thumbRight = toggleSwitch.thumbRightX;
var rtl = toggleSwitch.rtl;
Set
toggleSwitch.setThumbPosition(thumbLeft, thumbRight);
// toggleSwitch.thumbLeftX = thumbLeft;
// toggleSwitch.thumbRightX = thumbRight;
toggleSwitch.setRTL(rtl);
// toggleSwitch.rtl = rtl;
Events¶
On value change
toggleSwitch.on('valuechange', function(value) {
// value: checked
})
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters