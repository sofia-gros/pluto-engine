Custom progress
Introduction¶
Custom progress bar based on custom-shapes.
Author: Rex
Game object
Live demos¶
React-circle-progress-bar
Round rectangle
Orb
Trapezoid Mask
Round rectangles mask
Slash effect with rexUI
Path segment animation
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexcustomprogressplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcustomprogressplugin.min.js', true);
Add custom shapes object
var customProgress = scene.add.rexCustomProgress(x, y, width, height, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import CustomProgressPlugin from 'phaser4-rex-plugins/plugins/customprogress-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexCustomProgressPlugin',
plugin: CustomProgressPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add custom shapes object
var customProgress = scene.add.rexCustomProgress(x, y, width, height, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import CustomProgress from 'phaser4-rex-plugins/plugins/bbcodetext.js';
Add custom shapes object
var customProgress = new CustomProgress(scene, x, y, width, height, config);
scene.add.existing(customProgress);
Add custom shapes object¶
var customProgress = scene.add.rexCustomProgress(x, y, width, height, {
// type: 'rexCustomProgress',
create: [
{ name: name0, type: shapeType},
{ name: name1, type: shapeType},
...
],
// create: {
//     shapeType: [name0, name1, ...],
//     shapeType: number,
//     shapeType: name,
// },
// create: function() {
//
// },
update: function() {
},
value: 0,
easeValue: {
duration: 0,
ease: 'Linear'
},
valuechangeCallback: function(newValue, oldValue, circularProgress) {
},
});
or
var customProgress = scene.add.rexCustomProgress({
// x: 0,
// y: 0,
// width: 64,
// height: 64,
// type: 'rexCustomProgress',
create: [
{ name: name0, type: shapeType},
{ name: name1, type: shapeType},
...
],
// create: {
//     shapeType: [name0, name1, ...],
//     shapeType: number,
//     shapeType: name,
// },
// create: function() {
//
// },
update: function() {
},
value: 0,
easeValue: {
duration: 0,
ease: 'Linear'
},
valuechangeCallback: function(newValue, oldValue, circularProgress) {
},
});
x, y : Position of this object.
width, height : Size of this object.
create : Callback to create shapes
An array of object with name and type
{ name: name0, type: shapeType }
shapeType :
'arc' : Create Arc shape.
'circle' : Create Circle shape.
'ellipse' : Create Ellipse shape.
'line' : Create Line shape.
'lines' : Create Lines shape.
'rectangle' : Create Rectangle shape.
'roundRectangle' : Create Round rectangle shape.
'triangle' : Create Triangle shape.
A plain object with shapeType: name, or shapeType: number
shapeType : arc, circle, ellipse, line, rectangle, triangle
nameArray : An array of unique string name for each shape.
name : An unique string name of this shape.
number : Amount of shapes to create.
A callback
function() {
// this : This custom shapes game object
var shape = this.createShape(shapeType, name);
this.addShape(shape);
}
this.createShape(shapeType, name) : Crate a shape instance, with an unique name.
this.addShape(shape) : Add this shape instance to this custom custom shapes.
update : Callback when refresh
function() {
// this : This custom shapes game object
var shapes = this.getShapes();
var shape = this.getShape(name);
// ...
// var isSizeChanged = this.isSizeChanged;
// var fillColor = this.fillColor;
// var fillAlpha = this.fillAlpha;
// var lineWidth = this.lineWidth;
// var strokeColor = this.strokeColor;
// var strokeAlpha = this.strokeAlpha;
// ...
// var value = this.value;
}
Shape instances : Change properties of shape instances.
this.getShapes() : Return all shapes in an array.
this.getShape(name) : Return a shape by the unique string name.
Is size changed : this.isSizeChanged
Fill style : this.fillColor, this.fillAlpha
Stroke style : this.strokeColor, this.strokeAlpha, this.lineWidth
Current progress value : this.value
value : 0 ~ 1, progress value. Default is 0.
easeValue : Parameters of easing value.
easeValue.duration : Duration of value easing, default is 0 (no easing).
easeValue.ease : Ease function, default is 'Linear'.
valuechangeCallback : callback function when value changed.
function(newValue, oldValue, customProgress) {
}
Set update shape callback¶
See Shape class
Size¶
See Size
Styles¶
See Styles
Recreate shapes¶
See Shape class
Progress value¶
Get value
var value = customProgress.getValue(min, max); // value : min ~ max
or
var value = customProgress.getValue(); // value: 0 ~ 1
or
var value = customProgress.value; // value: 0 ~ 1
Set value
customProgress.setValue(value, min, max); // value: min ~ max
or
customProgress.setValue(value); // value: 0 ~ 1
or
customProgress.value = value; // value: 0 ~ 1
Increase value
customProgress.addValue(inc, min, max); // inc: min ~ max
or
customProgress.addValue(inc); // inc: 0 ~ 1
or
customProgress.value += inc; // inc: 0 ~ 1
Ease progress value¶
Set ease duration
customProgress.setEaseValueDuration(duration);
Set ease function
customProgress.setEaseValueFunction(ease);
ease : Ease function.
Ease value to
customProgress.easeValueTo(value, min, max);  // value: min ~ max
or
customProgress.easeValueTo(value);  // value: 0 ~ 1
Ease value repeat
customProgress.easeValueRepeat(from, to);  // from, to: 0 ~ 1
// customProgress.easeValueRepeat(from, to, repeat, repeatDelay);
Stop ease
customProgress.stopEaseValue();
Refresh¶
Redraw shapes when
Value changed : customProgress.setValue(newValue), customProgress.easeValueTo(newValue)
Resize : customProgress.resize(width, height)
Set dirty : customProgress.setDirty()
Set update shape callback : customProgress.setUpdateShapesCallback(callback)
Shape class¶
See Shape class
Events¶
On value changed
customProgress.on('valuechange', function(newValue, oldValue, customProgress){
//
}, scope);
Alpha¶
Get
var alpha = customProgress.alpha;
Set
customProgress.setAlpha(alpha);
// customProgress.alpha = alpha;
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters