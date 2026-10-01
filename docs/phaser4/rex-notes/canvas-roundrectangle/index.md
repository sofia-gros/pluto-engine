Round rectangle
Introduction¶
Round rectangle on canvas.
Author: Rex
Game object
Live demos¶
Round rectangle
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexroundrectanglecanvasplugin', 'https://raw.githubusercontent.com/rexrainbow/    phaser3-rex-notes/master/dist/rexroundrectanglecanvasplugin.min.js', true);
Add shape object
var rect = scene.add.rexRoundRectangleCanvas(x, y, width, height, radiusConfig, fillStyle, strokeStyle, lineWidth, fillColor2, isHorizontalGradient);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import RoundRectanglePlugin from 'phaser4-rex-plugins/plugins/roundrectanglecanvas-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexRoundRectangleCanvasPlugin',
plugin: RoundRectangleCanvasPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add shape object
var rect = scene.add.rexRoundRectangleCanvas(x, y, width, height, radiusConfig, fillStyle, strokeStyle, lineWidth, fillColor2, isHorizontalGradient);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import RoundRectangleCanvas from 'phaser4-rex-plugins/plugins/roundrectanglecanvas.js';
Add shape object
var rect = new RoundRectangleCanvas(scene, x, y, width, height, radiusConfig, fillStyle, strokeStyle, lineWidth, fillColor2, isHorizontalGradient);
scene.add.existing(rect);
Create shape object¶
var rect = scene.add.rexRoundRectangleCanvas(x, y, width, height, radiusConfig, fillStyle, strokeStyle, lineWidth, fillColor2, isHorizontalGradient);
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
fillStyle : Fill color in number or css string value, or a callback
Number, or css string value : Color value
Callback :
function(canvas, context) {
// Radial gradient
var grd = context.createRadialGradient(x0, y0, r0, x1, y1, r1);
grd.addColorStop(0, color0);
grd.addColorStop(1, color1);
return grd;
}
strokeStyle : Stroke color in number or css string value.
lineWidth : Stroke line width.
fillColor2 : Gradient color in number or css string value.
isHorizontalGradient :
true : Horizontal gradient.
false : Vertical gradient.
Note
If radius >= 0, draw convex corner, else draw concave corner
Deform¶
Rectangle, set radius of 4 corners to 0.
var rect = scene.add.rexRoundRectangleCanvas(x, y, width, height, 0, fillStyle, strokeStyle, lineWidth, fillColor2, isHorizontalGradient);
Circle, set width and height to 2*radius.
var rect = scene.add.rexRoundRectangleCanvas(x, y, (2*radius), (2*radius), radius, fillStyle, strokeStyle, lineWidth, fillColor2, isHorizontalGradient);
Ellipse, set width and height to 2*radiusX, 2*radiusY.
var rect = scene.add.rexRoundRectangleCanvas(x, y, (2*radiusX), (2*radiusX), {x: radiusX, y: radiusY}, fillColor, fillAlpha);
Rhombus, set width and height to 2*radius, and assign iteration to 0
var rect = scene.add.rexRoundRectangleCanvas(x, y, (2*radius), (2*radius), {
radius: radius,
iteration: 0
}, fillStyle, strokeStyle, lineWidth, fillColor2, isHorizontalGradient);
Octagon, assign iteration to 0
var rect = scene.add.rexRoundRectangleCanvas(x, y, width, height, {
radius: radius,
iteration: 0
}, fillStyle, strokeStyle, lineWidth, fillColor2, isHorizontalGradient);
Custom class¶
Define class
class MyRoundRectangleCanvas extends RexPlugins.GameObjects.RoundRectangleCanvas {
constructor(scene, x, y, width, height, radiusConfig, fillStyle, strokeStyle, lineWidth, fillColor2, isHorizontalGradient) {
super(scene, x, y, width, height, radiusConfig, fillStyle, strokeStyle, lineWidth, fillColor2, isHorizontalGradient);
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
var rect = new MyRoundRectangleCanvas(scene, x, y, width, height, radiusConfig, fillStyle, strokeStyle, lineWidth, fillColor2, isHorizontalGradient);
Color¶
Fill color
Get
var fillStyle = rect.fillStyle;
var fillColor2 = rect.fillColor2;
var isHorizontalGradient = rect.isHorizontalGradient;
Set
rect.setFillStyle(fillStyle);
// rect.setFillStyle(fillStyle, fillColor2, isHorizontalGradient);
fillStyle : Fill color in number or css string value, or a callback
Number, or css string value : Color value
Callback :
function(canvas, context) {
// Radial gradient
var grd = context.createRadialGradient(x0, y0, r0, x1, y1, r1);
grd.addColorStop(0, color0);
grd.addColorStop(1, color1);
return grd;
}
Clear
rect.setFillStyle();
Stroke color
Get
var strokeStyle = rect.strokeStyle;
var lineWidth = rect.lineWidth;
Set
rect.setStrokeStyle(strokeStyle, lineWidth);
Clear
rect.setStrokeStyle();
Size¶
Get
var width = rect.width;
var height = rect.height;
Set
rect.setSize(width, height);
or
rect.width = width;
rect.height = height;
Radius¶
Set
rect.setRadius(value);
or
rect.radius = radius;
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
{
tl: {x : radiusX, y: radiusY},
tr: {x : radiusX, y: radiusY},
bl: {x : radiusX, y: radiusY},
br: {x : radiusX, y: radiusY},
}
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
Compare with Shape-Roundrectangle¶
Gradient
Canvas-RoundRectangle can fill with gradient color.
Shape-Roundrectangle can't fill gradient color.
Drawing method
Canvas-RoundRectangle draw shape on canvas, then map this canvas to frame buffer.
Shape-Roundrectangle draw shape on frame buffer directly without drawing to canvas first.