Circle
Introduction¶
Circle shape, built-in game object of phaser.
Author: Phaser Team
Usage¶
Create shape object¶
var circle = scene.add.circle(x, y, radius, fillColor);
// var circle = scene.add.circle(x, y, radius, fillColor, fillAlpha);
Custom class¶
Define class
class MyCircle extends Phaser.GameObjects.Arc {
constructor(scene, x, y, radius, fillColor, fillAlpha) {
super(scene, x, y, radius, 0, 360, false, fillColor, fillAlpha);
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
var circle = new MyCircle(scene, x, y, radius, fillColor, fillAlpha);
Color¶
Fill color
Get
var color = circle.fillColor;
var alpha = circle.fillAlpha;
Set
circle.setFillStyle(color, alpha);
Clear
circle.setFillStyle();
Stroke color
Get
var color = circle.strokeColor;
Set
circle.setStrokeStyle(lineWidth, color, alpha);
Clear
circle.setStrokeStyle();
No tint methods
Uses circle.setFillStyle(color, alpha) to change color.
Alpha¶
Get
var alpha = circle.alpha;
Set
circle.setAlpha(alpha);
// circle.alpha = alpha;
Radius¶
Radius
Get
var radius = circle.radius;
Set
circle.setRadius(radius);
or
circle.radius = radius;
Iterations: Increase this value for smoother arcs, at the cost of more polygons being rendered. Default is 0.01
Get
var iterations = circle.iterations;
Set
circle.iterations = iterations;
Display size¶
Get
var width = circle.displayWidth;
var height = circle.displayHeight;
Set
circle.setDisplaySize(width, height);
or
circle.displayWidth = width;
circle.displayHeight = height;
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters