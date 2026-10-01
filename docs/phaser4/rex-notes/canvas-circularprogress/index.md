Circular progres
Introduction¶
Circular progress bar on canvas.
Author: Rex
Game object
Live demos¶
Circular-progress
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexcircularprogresscanvasplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcircularprogresscanvasplugin.min.js', true);
Add circular-progress object
var circularProgress = scene.add.rexCircularProgressCanvas(x, y, radius, color, value, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import CircularProgressCanvasPlugin from 'phaser4-rex-plugins/plugins/circularprogresscanvas-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexCircularProgressCanvasPlugin',
plugin: CircularProgressCanvasPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add circular-progress object
var circularProgress = scene.add.rexCircularProgressCanvas(x, y, radius, color, value, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import CircularProgressCanvas from 'phaser4-rex-plugins/plugins/circularprogresscanvas.js';
Add circular-progress object
var circularProgress = new CircularProgressCanvas(scene, x, y, radius, color, value, config);
scene.add.existing(image);
Install plugin¶
Install plugin in configuration of game
var config = {
// ...
plugins: {
global: [{
key: 'rexCircularProgressCanvasPlugin',
plugin: CircularProgressCanvasPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Create instance¶
var circularProgress = scene.add.rexCircularProgressCanvas(x, y, radius, barColor, value, {
barColor2: undefined,
trackColor: undefined,
centerColor: undefined,
thickness: 0.2,
startAngle: Phaser.Math.DegToRad(270),
endAngle: Phaser.Math.DegToRad(270+360),
anticlockwise: false,
textColor: undefined,
textStrokeColor: undefined,
textStrokeThickness: undefined,
// textFont: ,
textSize: '16px',
textFamily: 'Courier',
textStyle: '',
textFormatCallback: undefined,
textFormatCallbackScope: undefined,
easeValue: {
duration: 0,
ease: 'Linear'
},
valuechangeCallback: function(newValue, oldValue, circularProgress) {
},
});
or
var circularProgress = scene.add.rexCircularProgressCanvas({
x: 0,
y: 0,
radius: 1,
barColor: undefined,
barColor2: undefined,
trackColor: undefined,
centerColor: undefined,
thickness: 0.2,
startAngle: Phaser.Math.DegToRad(270),
endAngle: Phaser.Math.DegToRad(270+360),
anticlockwise: false,
textColor: undefined,
textStrokeColor: undefined,
textStrokeThickness: undefined,
// textFont: ,
textSize: '16px',
textFamily: 'Courier',
textStyle: '',
textFormatCallback: undefined,
textFormatCallbackScope: undefined,
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
barColor, barColor2 : Fill color of circular bar, in number or css string value. Assign gradient start color by barColor2.
trackColor : Color of circular track, in number or css string value.
centerColor : Color of center circle, in number or css string value.
thickness : 0 ~ 1, thickness of circular bar. Default value is 0.2 (0.2*radius)
startAngle : Start angle of circular bar, in radians. Default value is 270 degrees.
endAngle : End angle of circular bar, in radians. Default value is 270+360 degrees.
anticlockwise : Set true to put anticlockwise circular bar. Default value is false.
textColor : Color of display text. Default is undefined.
textStrokeColor, textStrokeThickness : Stroke color, stroke line width of display text. Default is undefined.
textSize, textFamily, textStyle : Size, family, style of display text.
textFormatCallback, textFormatCallbackScope : Formating callback of display text. ex:
function(value) {
return Math.floor(value * 100).toString();
}
Default value is undefined.
value : 0 ~ 1, progress value. Default is 0.
easeValue : Parameters of easing value.
easeValue.duration : Duration of value easing, default is 0 (no easing).
easeValue.ease : Ease function, default is 'Linear'.
valuechangeCallback : callback function when value changed.
function(newValue, oldValue, circularProgress) {
}
Add circular-progress from JSON
var circularProgress = scene.make.rexCircularProgressCanvas({
x: 0,
y: 0,
radius: 1,
barColor: undefined,
barColor2: undefined,
trackColor: undefined,
centerColor: undefined,
thickness: 0.2,
startAngle: Phaser.Math.DegToRad(270),
endAngle: Phaser.Math.DegToRad(270+360),
anticlockwise: false,
textColor: undefined,
textStrokeColor: undefined,
textStrokeThickness: undefined,
textSize: '16px',
textFamily: 'Courier',
textStyle: '',
textFormatCallback: undefined,
textFormatCallbackScope: undefined,
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
class MyCircularProgressCanvas extends CircularProgressCanvas {
constructor(scene, x, y, radius, barColor, value, config) {
super(scene, x, y, radius, barColor, value, config);
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
var circularProgress = new MyCircularProgressCanvas(scene, x, y, radius, color, value, config);
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
circularProgress.setBarColor(color);
// circularProgress.barColor = color;
Color2
Get
var barColor2 = circularProgress.barColor2;
Set
circularProgress.setBarColor2(color);
// circularProgress.barColor2 = color;
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
End angle
Get
var endAngle = circularProgress.endAngle;
Set
circularProgress.setEndAngle(endAngle);
circularProgress.endAngle = endAngle;
endAngle : End angle of circular bar, in radians.
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
Display text¶
Fill color
circularProgress.setTextColor(color);
Stroke color
circularProgress.setTextStrokeColor(color, thickness);
Font
circularProgress.setTextFont(fontSize, fontFamily, fontStyle);
Format callback
circularProgress.setTextFormatCallback(callback, scope);
callback :
function(value) {
return Math.floor(value * 100).toString();
}
Events¶
On value changed
circularProgress.on('valuechange', function(newValue, oldValue, circularProgress){
//
}, scope);
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters
Compare with Circular-progress shape¶
Circular-progress canvas creates a canvas then draw on that canvas, circular progress shape draw on GRAPHICS pipeline like Shape or Graphics game object.
Circular-progress canvas can draw text directly, circular progress shape can't draw any text.