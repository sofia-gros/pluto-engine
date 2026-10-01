Line progress
Introduction¶
Horizontal line progress bar shape.
Author: Rex
Game object
Live demos¶
Line-progress
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexlineprogressplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexlineprogressplugin.min.js', true);
Add line-progress object
var lineProgress = scene.add.rexLineProgress(x, y, width, height, barColor, value, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import LineProgressPlugin from 'phaser4-rex-plugins/plugins/lineprogress-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexLineProgressPlugin',
plugin: LineProgressPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add line-progress object
var lineProgress = scene.add.rexLineProgress(x, y, width, height, barColor, value, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import LineProgress from 'phaser4-rex-plugins/plugins/lineprogress.js';
Add line-progress object
var lineProgress = new LineProgress(scene, x, y, width, height, barColor, value, config);
scene.add.existing(lineProgress);
Install plugin¶
Install plugin in configuration of game
var config = {
// ...
plugins: {
global: [{
key: 'rexLineProgressPlugin',
plugin: LineProgressPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Create instance¶
var lineProgress = scene.add.rexLineProgress(x, y, width, height, barColor, value, {
trackColor: undefined,
trackStrokeColor: undefined,
trackStrokeThickness: 2,
skewX:0,
rtl: false,
easeValue: {
duration: 0,
ease: 'Linear'
},
valuechangeCallback: function(newValue, oldValue, lineProgress) {
},
});
or
var lineProgress = scene.add.rexLineProgress({
x: 0,
y: 0,
width: 2,
height: 2,
barColor: undefined,
trackColor: undefined,
trackStrokeColor: undefined,
trackStrokeThickness: 2,
skewX:0,
rtl: false,
easeValue: {
duration: 0,
ease: 'Linear'
},
value: 0,
valuechangeCallback: function(newValue, oldValue, lineProgress) {
},
});
x, y : Position of this object.
width, height : Size of this object.
barColor : Fill color of line bar, in number or css string value.
trackColor : Fill color of line track, in number or css string value.
trackStrokeColor : Stroke color of track, in number or css string value.
trackStrokeThickness : Stroke line width of track.
skewX : Horizontal skew of track and bar.
rtl :
false : Bar starts from left side. Default behavior.
true : Bar starts from right side.
value : 0 ~ 1, progress value. Default is 0.
easeValue : Parameters of easing value.
easeValue.duration : Duration of value easing, default is 0 (no easing).
easeValue.ease : Ease function, default is 'Linear'.
valuechangeCallback : callback function when value changed.
function(newValue, oldValue, lineProgress) {
}
Add line-progress from JSON
var lineProgress = scene.make.rexLineProgress({
x: 0,
y: 0,
width: 2,
height: 2,
barColor: undefined,
trackColor: undefined,
trackStrokeColor: undefined,
trackStrokeThickness: 2,
skewX:0,
rtl: false,
easeValue: {
duration: 0,
ease: 'Linear'
},
value: 0,
valuechangeCallback: function(newValue, oldValue, lineProgress) {
},
add: true
});
Custom class¶
Define class
class MyLineProgress extends LineProgress {
constructor(scene, x, y, width, height, barColor, value, config) {
super(scene, x, y, width, height, barColor, value, config);
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
var lineProgress = new MyLineProgress(scene, x, y, width, height, barColor, value, config);
Progress value¶
Get value
var value = lineProgress.getValue(min, max); // value : min ~ max
or
var value = lineProgress.getValue(); // value: 0 ~ 1
or
var value = lineProgress.value; // value: 0 ~ 1
Set value
lineProgress.setValue(value, min, max); // value: min ~ max
or
lineProgress.setValue(value); // value: 0 ~ 1
or
lineProgress.value = value; // value: 0 ~ 1
Increase value
lineProgress.addValue(inc, min, max); // inc: min ~ max
or
lineProgress.addValue(inc); // inc: 0 ~ 1
or
lineProgress.value += inc; // inc: 0 ~ 1
Ease progress value¶
Ease value to
lineProgress.easeValueTo(value, min, max);  // value: min ~ max
or
lineProgress.easeValueTo(value);  // value: 0 ~ 1
Stop ease
lineProgress.stopEaseValue();
Set ease duration
lineProgress.setEaseValueDuration(duration);
Set ease function
lineProgress.setEaseValueFunction(ease);
ease : Ease function.
Track¶
Color
Get
var trackColor = lineProgress.trackColor;
Set
lineProgress.setTrackColor(trackColor);
// lineProgress.trackColor = trackColor;
Stroke
Get
var trackStrokeColor = lineProgress.trackStrokeColor;
var trackStrokeThickness = lineProgress.trackStrokeThickness;
Set
lineProgress.setTrackColor(color);
lineProgress.setTrackStroke(lineWidth, color);
Bar¶
Color
Get
var barColor = lineProgress.barColor;
Set
lineProgress.setBarColor(barColor);
// lineProgress.barColor = barColor;
Horizontal skew¶
Get
var skewX = lineProgress.skewX;
Set
lineProgress.setSkewX(skewX);
// lineProgress.skewX = skewX;
Right-to-left¶
Get
var rtl = lineProgress.rtl;
Set
lineProgress.setRTL(rtl);
// lineProgress.rtl = rtl;
Events¶
On value changed
lineProgress.on('valuechange', function(newValue, oldValue, lineProgress){
//
}, scope);
Alpha¶
Get
var alpha = lineProgress.alpha;
Set
lineProgress.setAlpha(alpha);
// lineProgress.alpha = alpha;
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters