Round Rectangle
Introduction¶
Round rectangle shape.
Author: Rex
Game object
Live demos¶
Round rectangle
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexroundrectangleplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexroundrectangleplugin.min.js', true);
Add shape object
var rect = scene.add.rexRoundRectangle(x, y, width, height, radius, fillColor, fillAlpha);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import RoundRectanglePlugin from 'phaser4-rex-plugins/plugins/roundrectangle-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexRoundRectanglePlugin',
plugin: RoundRectanglePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add shape object
var rect = scene.add.rexRoundRectangle(x, y, width, height, radius, fillColor, fillAlpha);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import RoundRectangle from 'phaser4-rex-plugins/plugins/roundrectangle.js';
Add shape object
var rect = new RoundRectangle(scene, x, y, width, height, radius, fillColor, fillAlpha);
scene.add.existing(rect);
Create shape object¶
var rect = scene.add.rexRoundRectangle(x, y, width, height, radius, fillColor, fillAlpha);
or
var rect = scene.add.rexRoundRectangle({
x: 0,
y: 0,
width: undefined,
height: undefined,
radius: 0,
color: undefined,
alpha: undefined,
strokeColor: undefined,
strokeAlpha: undefined,
strokeWidth: 2,
dashPattern: undefined,
dashOffset: undefined,
});
width, height : Size of rectangle.
undefined : Set ot undefined to draw a circle.
radius : Radius of four corners.
0, or undefined : Disable round corner.
Number: 4 corners with the same radius.
JSON
4 corners with the same radius X/Y
{
x: radiusX,
y: radiusY
}
Eeach radius of corner
{
tl: radius,
tr: radius,
bl: radius,
br: radius
}
or
{
tl: {x : radiusX, y: radiusY},
tr: {x : radiusX, y: radiusY},
bl: {x : radiusX, y: radiusY},
br: {x : radiusX, y: radiusY},
}
Radius and iteration
{
radius: radius,
iteration: 0
}
or
{
radius: {x: radiusX, y: radiusY},
iteration: 0
}
or
{
radius: {
tl: {x : radiusX, y: radiusY},
tr: {x : radiusX, y: radiusY},
bl: {x : radiusX, y: radiusY},
br: {x : radiusX, y: radiusY},
},
iteration: 0
}
radius :
0  : No round corner
> 0 : Convex round corner
< 0 : Concave round corner
iteration : Number of interpolation points in each round corner. Default value is 4.
0 : Draw a straight line instead of arc.
dashPattern : Default style is solid line.
An array
[drawLength, skipLength], or
[drawLengthA, skipLengthA, drawLengthB, skipLengthB, ...]
An plain object
{
segments: 10,
drawRatio: 0.5
}
dashOffset : Offset of 1st dashed segment. Default value is 0
Deform¶
Rectangle, set radius of 4 corners to 0.
var rect = scene.add.rexRoundRectangle(x, y,  width, height, 0, fillColor, fillAlpha);
Circle, set width and height to undefined.
var rect = scene.add.rexRoundRectangle(x, y, undefined, undefined, radius, fillColor, fillAlpha);
Ellipse, set width and height to undefined, and radiusX/radiusY.
var rect = scene.add.rexRoundRectangle(x, y, undefined, undefined, {x: radiusX, y: radiusY}, fillColor, fillAlpha);
Rhombus, set width and height to undefined, and assign iteration to 0
var rect = scene.add.rexRoundRectangle(x, y, undefined, undefined, {
radius: radius,
iteration: 0
}, fillColor, fillAlpha);
Octagon, assign iteration to 0
var rect = scene.add.rexRoundRectangle(x, y, width, height, {
radius: radius,
iteration: 0
}, fillColor, fillAlpha);
Custom class¶
Define class
class MyRoundRectangle extends RexPlugins.GameObjects.RoundRectangle {
constructor(scene, x, y, width, height, radius, fillColor, fillAlpha) {
super(scene, x, y, width, height, radius, fillColor, fillAlpha);
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
var rect = new MyRoundRectangle(scene, x, y, width, height, radius, fillColor, fillAlpha);
Color¶
Fill color
Get
var color = rect.fillColor;
var alpha = rect.fillAlpha;
Set
rect.setFillStyle(color, alpha);
Clear
rect.setFillStyle();
Stroke color
Get
var color = rect.strokeColor;
Set
rect.setStrokeStyle(lineWidth, color, alpha);
Clear
rect.setStrokeStyle();
No tint methods
Uses rect.setFillStyle(color, alpha) to change color.
Alpha¶
Get
var alpha = rect.alpha;
Set
rect.setAlpha(alpha);
// rect.alpha = alpha;
Size¶
Get
var width = rect.width;
var height = rect.height;
Set
rect.setSize(width, height);
or
rect.width = width;
rect.height = height;
Display size¶
Get
var width = rect.displayWidth;
var height = rect.displayHeight;
Set
rect.setDisplaySize(width, height);
or
rect.displayWidth = width;
rect.displayHeight = height;
Radius¶
Get
var radius = rect.radius;
var radiusTL = rect.radiusTL;
var radiusTR = rect.radiusTR;
var radiusBL = rect.radiusBL;
var radiusBR = rect.radiusBR;
or
var cornerRadius = rect.cornerRadius;
radius : Number, maximum radius of 4 corners.
cornerRadius : JSON object of 4 corners.
{
tl: {x : radiusX, y: radiusY, convex : true},
tr: {x : radiusX, y: radiusY, convex : true},
bl: {x : radiusX, y: radiusY, convex : true},
br: {x : radiusX, y: radiusY, convex : true},
}
Set
rect.setRadius(value);
rect.setRadiusTL(value);  // number, or {x,y}
rect.setRadiusTR(value);  // number, or {x,y}
rect.setRadiusBL(value);  // number, or {x,y}
rect.setRadiusBR(value);  // number, or {x,y}
or
rect.radius = radius;
rect.radiusTL = radius;  // number, or {x,y}
rect.radiusTR = radius;  // number, or {x,y}
rect.radiusBL = radius;  // number, or {x,y}
rect.radiusBR = radius;  // number, or {x,y}
radius :
Number : 4 corners with the same radius.
0  : No round corner
> 0 : Convex round corner
< 0 : Concave round corner
JSON
4 corners with the same radius X/Y
{
x: radiusX,
y: radiusY
}
Eeach radius of corner
{
tl: radius,
tr: radius,
bl: radius,
br: radius
}
or
```javascript
{
tl: {x : radiusX, y: radiusY},
tr: {x : radiusX, y: radiusY},
bl: {x : radiusX, y: radiusY},
br: {x : radiusX, y: radiusY},
}
Dashed¶
Set dash pattern
rect.setDashPattern(pattern, offset);
pattern :
An array
[drawLength, skipLength], or
[drawLengthA, skipLengthA, drawLengthB, skipLengthB, ...]
An plain object
{
segments: 10,
drawRatio: 0.5
}
offset : Offset of 1st dashed segment. Default value is 0
Clear dashed
rect.setDashed(false);
or
rect.clearDashPattern();
Iteration¶
Get
var iteration = rect.iteration;
Set
rect.setIteration(value);
or
rect.iteration = value;
Number of interpolation points in each round corner. Default value is 4.
0 : Draw a straight line instead of arc.
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters