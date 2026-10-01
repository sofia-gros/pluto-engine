Circular progress
Introduction¶
Circular progress bar shape.
Author: Rex
Game object
Live demos¶
Circular-progress
Pie bar
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexcircularprogressplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcircularprogressplugin.min.js', true);
Add circular-progress object
var circularProgress = scene.add.rexCircularProgress(x, y, radius, color, value, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import CircularProgressPlugin from 'phaser4-rex-plugins/plugins/circularprogress-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexCircularProgressPlugin',
plugin: CircularProgressPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add circular-progress object
var circularProgress = scene.add.rexCircularProgress(x, y, radius, color, value, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import CircularProgress from 'phaser4-rex-plugins/plugins/circularprogress.js';
Add circular-progress object
var circularProgress = new CircularProgress(scene, x, y, radius, color, value, config);
scene.add.existing(image);
Install plugin¶
Install plugin in configuration of game
var config = {
// ...
plugins: {
global: [{
key: 'rexCircularProgressPlugin',
plugin: CircularProgressPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Create instance¶
var circularProgress = scene.add.rexCircularProgress(x, y, radius, barColor, value, {
barAlpha: 1,
trackColor: undefined,
trackAlpha: 1,
centerColor: undefined,
centerAlpha: 1,
thickness: 0.2,
startAngle: Phaser.Math.DegToRad(270),
anticlockwise: false,
// iterations: 128,
easeValue: {
duration: 0,
ease: 'Linear'
},
valuechangeCallback: function(newValue, oldValue, circularProgress) {
},
});
or
var circularProgress = scene.add.rexCircularProgress({
x: 0,
y: 0,
radius: 1,
barColor: undefined,
barAlpha: 1,
trackColor: undefined,
trackAlpha: 1,
centerColor: undefined,
centerAlpha: 1,
thickness: 0.2,
startAngle: Phaser.Math.DegToRad(270),
anticlockwise: false,
// iterations: 128,
value: 0,
easeValue: {
duration: 0,
ease: 'Linear'
},
valuechangeCallback: function(newValue, oldValue, circularProgress) {
},
});
x, y : Position of this object.
radius : Radius of this circle. Size will be (radius*2, radius*2).
barColor, barAlpha : Color/alpha of circular bar, in number or css string value.
trackColor, trackAlpha : Color/alpha of circular track, in number or css string value.
centerColor, centerAlpha : Color/alpha of center circle, in number or css string value.
thickness : 0 ~ 1, thickness of circular bar. Default value is 0.2 (0.2*radius)
startAngle : Start angle of circular bar, in radians. Default value is 270 degrees.
anticlockwise : Set true to put anticlockwise circular bar. Default value is false.
iterations : Iterations of curve, set larger value to get more smooth rendering result. Default value is 128.
value : 0 ~ 1, progress value. Default is 0.
easeValue : Parameters of easing value.
easeValue.duration : Duration of value easing, default is 0 (no easing).
easeValue.ease : Ease function, default is 'Linear'.
valuechangeCallback : callback function when value changed.
function(newValue, oldValue, circularProgress) {
}
Add circular-progress from JSON
var circularProgress = scene.make.rexCircularProgress({
x: 0,
y: 0,
radius: 1,
barColor: undefined,
trackColor: undefined,
centerColor: undefined,
thickness: 0.2,
startAngle: Phaser.Math.DegToRad(270),
anticlockwise: false,
value: 0,
easeValue: {
duration: 0,
ease: 'Linear'
},
valuechangeCallback: function(newValue, oldValue, circularProgress) {
},
add: true
});
Custom class¶
Define class
class MyCircularProgress extends CircularProgress {
constructor(scene, x, y, radius, color, value, config) {
super(scene, x, y, radius, color, value, config);
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
var circularProgress = new MyCircularProgress(scene, x, y, radius, color, value, config);
Progress value¶
Get value
var value = circularProgress.getValue(min, max); // value : min ~ max
or
var value = circularProgress.getValue(); // value: 0 ~ 1
or
var value = circularProgress.value; // value: 0 ~ 1
Set value
circularProgress.setValue(value, min, max); // value: min ~ max
or
circularProgress.setValue(value); // value: 0 ~ 1
or
circularProgress.value = value; // value: 0 ~ 1
Increase value
circularProgress.addValue(inc, min, max); // inc: min ~ max
or
circularProgress.addValue(inc); // inc: 0 ~ 1
or
circularProgress.value += inc; // inc: 0 ~ 1
Ease progress value¶
Ease value to
circularProgress.easeValueTo(value, min, max);  // value: min ~ max
or
circularProgress.easeValueTo(value);  // value: 0 ~ 1
Stop ease
circularProgress.stopEaseValue();
Set ease duration
circularProgress.setEaseValueDuration(duration);
Set ease function
circularProgress.setEaseValueFunction(ease);
ease : Ease function.
Radius¶
Get
var radius = circularProgress.radius;
Set
circularProgress.setRadius(radius);
// circularProgress.radius = radius;
Also resize this game object to (radius*2, radius*2)
Circular track¶
Color
Get
var trackColor = circularProgress.trackColor;
Set
circularProgress.setTrackColor(trackColor);
// circularProgress.trackColor = trackColor;
Thickness : radius*thickness
circularProgress.setThickness(thickness);
thickness : 0~1.
Circular bar¶
Color
Get
var barColor = circularProgress.barColor;
Set
circularProgress.setBarColor(barColor);
// circularProgress.barColor = barColor;
Thickness : radius*thickness
circularProgress.setThickness(thickness);
thickness : 0~1.
Start angle
Get
var startAngle = circularProgress.startAngle;
Set
circularProgress.setStartAngle(startAngle);
circularProgress.startAngle = startAngle;
startAngle : Start angle of circular bar, in radians.
Anticlockwise
Get
var anticlockwise = circularProgress.anticlockwise;
Set
circularProgress.setAnticlockwise(anticlockwise);
// circularProgress.anticlockwise = anticlockwise;
Center circle¶
Color
Get
var centerColor = circularProgress.centerColor;
Set
circularProgress.setCenterColor(centerColor);
// circularProgress.centerColor = centerColor;
Events¶
On value changed
circularProgress.on('valuechange', function(newValue, oldValue, circularProgress){
//
}, scope);
Alpha¶
Get
var alpha = circularProgress.alpha;
Set
circularProgress.setAlpha(alpha);
// circularProgress.alpha = alpha;
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters
Compare with Circular-progress canvas¶
Circular-progress canvas creates a canvas then draw on that canvas, circular progress shape draw on GRAPHICS pipeline like Shape or Graphics game object.
Circular-progress canvas can draw text directly, circular progress shape can't draw any text.