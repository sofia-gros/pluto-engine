Custom shapes
Introduction¶
Custom shapes on shape.
Author: Rex
Game object
Live demos¶
Speech bubble
Jigsaw
Checkbox
World to localXY
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexcustomshapesplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcustomshapesplugin.min.js', true);
Add custom shapes object
var customShapes = scene.add.rexCustomShapes(x, y, width, height, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import CustomShapesPlugin from 'phaser4-rex-plugins/plugins/customshapes-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexCustomShapesPlugin',
plugin: CustomShapesPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add custom shapes object
var customShapes = scene.add.rexCustomShapes(x, y, width, height, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import CustomShapes from 'phaser4-rex-plugins/plugins/bbcodetext.js';
Add custom shapes object
var customShapes = new CustomShapes(scene, x, y, width, height, config);
scene.add.existing(customShapes);
Add custom shapes object¶
var customShapes = scene.add.rexCustomShapes(x, y, width, height, {
// type: 'rexCustomShapes',
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
});
or
var customShapes = scene.add.rexCustomShapes({
// x: 0,
// y: 0,
// width: 64,
// height: 64,
// type: 'rexCustomShapes',
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
}
Shape instances : Change properties of shape instances.
this.getShapes() : Return all shapes in an array.
this.getShape(name) : Return a shape by the unique string name.
Is size changed : this.isSizeChanged
Fill style : this.fillColor, this.fillAlpha
Stroke style : this.strokeColor, this.strokeAlpha, this.lineWidth
Set update shape callback¶
customShapes.setUpdateShapesCallback(callback);
callback :
function() {
// this : This custom shapes game object
var shapes = this.getShapes();
var shape = this.getShape(name);
// ...
// var isSizeChanged = this.isSizeChanged;
}
Shape instances : Change properties of shape instances.
this.getShapes() : Return all shapes in an array.
this.getShape(name) : Return a shape by the unique string name.
Is size changed: this.isSizeChanged
Size¶
customShapes.setSize(width, height);
or
customShapes.resize(width, height);
or
customShapes.width = width;
customShapes.height = height;
Will set dirty and redraw shapes
Styles¶
Fill style
customShapes.setFillStyle(color, alpha);
or
customShapes.fillColor = color;
customShapes.fillAlpha = alpha;
Stroke style
customShapes.setStrokeStyle(lineWidth, color, alpha);
or
customShapes.lineWidth = lineWidth;
customShapes.strokeColor = color;
customShapes.strokeAlpha = alpha;
Will set dirty and redraw shapes. Apply styles to shapes in update callback.
World position to local position¶
var localXY = customShapes.worldToLocalXY(worldX, worldY); // localXY: {x, y}
or
var out = customShapes.worldToLocalXY(worldX, worldY, camera, out);
Recreate shapes¶
Clear all shapes
customShapes.clear();
Add new shape
customShapes.createShape(shapeType, name);
shapeType :
'arc' : Create Arc shape.
'circle' : Create Circle shape.
'ellipse' : Create Ellipse shape.
'line' : Create Line shape.
'lines' : Create Lines shape.
'rectangle' : Create Rectangle shape.
'roundRectangle' : Create Round rectangle shape.
'triangle' : Create Triangle shape.
name : A string name of this shape.
Refresh¶
Redraw shapes when
Resize : customShapes.resize(width, height)
customShapes.isSizeChanged will also be true.
Set fill color : customShapes.setFillStyle(color, alpha)
Set stroke color : customShapes.setStrokeStyle(lineWidth, color, alpha)
Set dirty : customShapes.setDirty()
Set update shape callback : customShapes.setUpdateShapesCallback(callback)
Update shape data¶
Shape data will be updated during rendering, or call shape.updateData() to update shape data before rendering.
Shape class¶
Common properties¶
Style
Get
var fillColor = shape.fillColor;
var fillAlpha = shape.fillAlpha;
var lineWidth = shape.lineWidth;
var strokeColor = shape.strokeColor;
var strokeAlpha = shape.strokeAlpha;
Set
shape.fillStyle(color, alpha);
shape.lineStyle(lineWidth, color, alpha);
Clear
shape.fillStyle().lineStyle();
Dashed
Set dash pattern
shape.setDashPattern(pattern, offset);
pattern :
An array
[drawLength, skipLength], or
[drawLengthA, skipLengthA, drawLengthB, skipLengthB, ...]
An plain object
{
segments: 10,
drawRatio: 0.5
}
Clear dashed
shape.setDashed(false);
or
shape.clearDashPattern();
Visible
Get
var visible = shape.visible;
Set
javascript
shape.setVisible(visible);
Private data
Get
var data = shape.getData(key);
// var data = shape.getData(key, defaultValue);
Set
shape.setData(key, value);
or
shape.setData({key:value, ...});
Inc
shape.incData(key, incValue);
// shape.incData(key, incValue, defaultValue);
Mul
shape.mulData(key, mulValue);
// shape.mulData(key, mulValue, defaultValue);
Clear
shape.clearData();
Name
Get
var name = shape.name;
Line¶
End points
Get
var x0 = line.x0;
var y0 = line.y0;
var x1 = line.x1;
var y1 = line.y1;
Set
line.setP0(x, y);
line.setP1(x, y);
or
line.x0 = x0;
line.y0 = y0;
line.x1 = x1;
line.y1 = y1;
Lines¶
Create path¶
Start, clear points data
lines.start();
Start at position, clear points data
lines.startAt(x, y);
Line to
To position
lines.lineTo(x, y);
To relative position
lines.lineTo(x, y, true);
To vertical position
lines.verticalLineTo(x);
To relative vertical position
lines.verticalLineTo(x, true);
To horizontal position
lines.horizontalLineTo(y);
To relative horizontal position
lines.horizontalLineTo(y, true);
Add arc composed of lines
lines.arc(centerX, centerY, radius, startAngle, endAngle, anticlockwise);
startAngle, endAngle : Start and end angle in degrees.
Add elliptical arc composed of lines
lines.ellipticalArc(centerX, centerY, radiusX, radiusY, startAngle, endAngle, anticlockwise);
startAngle, endAngle : Start and end angle in degrees.
Add quadratic bezier of lines
lines.quadraticBezierTo(cx, cy, x, y);
cx, cy : Control point
x, y : End point
Add cubic bezier of lines
lines.cubicBezierTo(cx0, cy0, cx1, cy1, x, y);
cx0, cy0 : Control point0
cx1, cy1 : Control point1
x, y : End point
Add spline(catmullRom) of lines
lines.catmullRomTo(x1, y1, x2, y2, x3, y3, ...);
x1, y1 : Next point
x2, y2 : Next point
...
End commands
Close path, to fill color
lines.close();
End path, to draw lines only
lines.end();
Copy path from another lines
lines.copyPathFrom(srcLine);
or
lines.copyPathFrom(srcLine, startT, endT);
Append path from another lines
lines.appendPathFrom(srcLine);
or
lines.appendPathFrom(srcLine, startT, endT);
Transform¶
Offset all points
lines.offset(x, y);
Rotation all points
lines.rotateAround(centerX, centerY, angle);
angle : Rotate angle in degrees.
Display path segment¶
Create path, under customShapes.isSizeChanged condition.
Display segment of path
lines.setDisplayPathSegment(startT, endT);
or
lines.setDisplayPathSegment(endT);  // startT = 0
startT, endT : 0~1. Start, end position on path, in percentage of path.
0 : Start position of path
1 : End position of path
Misc¶
Get polygon
var polygon = lines.toPolygon();
Can be used in setInteractive method
shape.setInteractive({
hitArea: shape.getShapes()[0].toPolygon(),
hitAreaCallback: Phaser.Geom.Polygon.Contains,
})
Position of first or last point
var p0x = lines.firstPointX;
var p0y = lines.firstPointY;
var pNx = lines.lastPointX;
var pNy = lines.lastPointY;
Rectangle¶
Top-left
Get
var left = rectangle.x;
var top = rectangle.y;
Set
rectangle.setTopLeftPosition(x, y);
or
rectangle.x = left;
rectangle.y = top;
Center
Get
var centerX = rectangle.centerX;
var centerY = rectangle.centerY;
Set
rectangle.setCenterPosition(x, y);
or
rectangle.centerX = centerX;
rectangle.centerY = centerY;
Will change rectangle.x, rectangle.y
Size
Get
var width = rectangle.width;
var height = rectangle.height;
Set
rectangle.setSize(width, height);
or
rectangle.width = width;
rectangle.height = height;
Round rectangle¶
Top-left
Get
var left = roundRectangle.x;
var top = roundRectangle.y;
Set
roundRectangle.setTopLeftPosition(x, y);
or
roundRectangle.x = left;
roundRectangle.y = top;
Center
Get
var centerX = roundRectangle.centerX;
var centerY = roundRectangle.centerY;
Set
roundRectangle.setCenterPosition(x, y);
or
roundRectangle.centerX = centerX;
roundRectangle.centerY = centerY;
Will change roundRectangle.x, roundRectangle.y
Size
Get
var width = roundRectangle.width;
var height = roundRectangle.height;
Set
roundRectangle.setSize(width, height);
or
roundRectangle.width = width;
roundRectangle.height = height;
Radius
Get
var radius = roundRectangle.radius;
or
var radiusTL = roundRectangle.radiusTL;
var radiusTR = roundRectangle.radiusTR;
var radiusBL = roundRectangle.radiusBL;
var radiusBR = roundRectangle.radiusBR;
Set
roundRectangle.setRadius(radius);
// roundRectangle.radius = radius;
or
roundRectangle.setRadius({
tl: radiusTL, tr: radiusTR,
bl: radiusBL, br: radiusBR,
});
// roundRectangle.radiusTL = radiusTL;
// roundRectangle.radiusTR = radiusTR;
// roundRectangle.radiusBL = radiusBL;
// roundRectangle.radiusBR = radiusBR;
radius :
0  : No round corner
> 0 : Convex round corner
< 0 : Concave round corner
Triangle¶
Vertices
Get
var x0 = triangle.x0;
var y0 = triangle.x0;
var x1 = triangle.x1;
var y1 = triangle.x1;
var x2 = triangle.x2;
var y2 = triangle.x2;
Set
triangle.setP0(x, y);
triangle.setP1(x, y);
triangle.setP2(x, y);
or
triangle.x0 = x0;
triangle.x0 = y0;
triangle.x1 = x1;
triangle.x1 = y1;
triangle.x2 = x2;
triangle.x2 = y2;
Arc¶
Center position
Get
var x = arc.x;
var y = arc.y;
Set
arc.setCenterPosition(x, y);
or
arc.x = x;
arc.y = y;
Radius
Get
var radiusX = arc.radiusX;
var radiusY = arc.radiusY;
Set
arc.setRadius(radiusX, radiusY);
// arc.setRadius(radius);
or
arc.radiusX = radiusX;
arc.radiusY = radiusY;
Angles
Get
var startAngle = arc.startAngle;
var endAngle = arc.endAngle;
var anticlockwise = arc.anticlockwise; // boolean
Set
arc.setAngle(startAngle, endAngle);  // anticlockwise = false
// arc.setAngle(startAngle, endAngle, anticlockwise);
or
arc.startAngle = startAngle;
arc.endAngle = endAngle;
arc.anticlockwise = anticlockwise; // boolean
startAngle, endAngle : Start/end angle in degrees.
Pie
Get
var pie = arc.pie; // boolean
Set
arc.setPie();
or
arc.pie = true;
Circle¶
Center position
Get
var x = circle.x;
var y = circle.y;
Set
circle.setCenterPosition(x, y);
or
circle.x = x;
circle.y = y;
Radius
Get
var radiusX = circle.radiusX;
var radiusY = circle.radiusY;
Set
circle.setRadius(radiusX, radiusY);
// arc.setRadius(radius);
or
circle.radiusX = radiusX;
circle.radiusY = radiusY;
Ellipse¶
The same as Circle.
Alpha¶
Get
var alpha = shape.alpha;
Set
shape.setAlpha(alpha);
// shape.alpha = alpha;
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters
Compare with similar plugins¶
Custom Shapes : Draw shapes.
Custom Porgress : Similar with custom-shapes, plus a value property
Custom Spinner : Similar with custom-progress, plus a value tween task.