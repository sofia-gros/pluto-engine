Polygon
Introduction¶
Polygon shape, built-in game object of phaser.
Author: Phaser Team
Usage¶
Create shape object¶
var polygon = scene.add.polygon(x, y, points, fillColor);
// var polygon = scene.add.polygon(x, y, points, fillColor, fillAlpha);
points :
An array of number : [x0, y0, x1, y1, ...]
An array of points : [{x:x0, y:y0}, {x:x1, y:y1}, ...]
A string : 'x0 y0 x1 y1 ...'
Note
Shift given points to align position (0, 0), not around (0, 0)
Custom class¶
Define class
class MyPolygon extends Phaser.GameObjects.Polygon {
constructor(scene, x, y, points, fillColor) {
super(scene, x, y, points, fillColor);
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
var polygon = new MyPolygon(scene, x, y, points, fillColor);
Color¶
Fill color
Get
var color = polygon.fillColor;
var alpha = polygon.fillAlpha;
Set
polygon.setFillStyle(color, alpha);
Clear
polygon.setFillStyle();
Stroke color
Get
var color = polygon.strokeColor;
Set
polygon.setStrokeStyle(lineWidth, color, alpha);
Clear
polygon.setStrokeStyle();
No tint methods
Uses polygon.setFillStyle(color, alpha) to change color.
Alpha¶
Get
var alpha = polygon.alpha;
Set
polygon.setAlpha(alpha);
// polygon.alpha = alpha;
Smooth¶
Smooths the polygon over the number of iterations specified.
polygon.smooth(iterations);
Set points¶
polygon.setTo(points);
point :
A string containing paired values separated by a single space : '40 0 40 20 100 20 100 80 40 80 40 100 0 50'
An array of Point objects : [new Phaser.Point(x1, y1), ...]
An array of objects with public x/y properties : [obj1, obj2, ...]
An array of paired numbers that represent point coordinates : [x1,y1, x2,y2, ...]
An array of arrays with two elements representing x/y coordinates : [[x1, y1], [x2, y2], ...]
Display size¶
Get
var width = polygon.displayWidth;
var height = polygon.displayHeight;
Set
polygon.setDisplaySize(width, height);
or
polygon.displayWidth = width;
polygon.displayHeight = height;
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters