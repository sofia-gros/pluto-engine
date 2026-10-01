Arc
Introduction¶
Arc shape, built-in game object of phaser.
Author: Phaser Team
Usage¶
Create shape¶
var arc = scene.add.arc(x, y, radius, startAngle, endAngle, anticlockwise, fillColor);
// var arc = scene.add.arc(x, y, radius, startAngle, endAngle, anticlockwise, fillColor, fillAlpha);
Custom class¶
Define class
class MyArc extends Phaser.GameObjects.Arc {
constructor(scene, x, y, radius, startAngle, endAngle, anticlockwise, fillColor) {
super(scene, x, y, radius, startAngle, endAngle, anticlockwise, fillColor);
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
var arc = new MyArc(scene, x, y, radius, startAngle, endAngle, anticlockwise, fillColor);
Color¶
Fill color
Get
var color = arc.fillColor;
var alpha = arc.fillAlpha;
Set
arc.setFillStyle(color, alpha);
Clear
arc.setFillStyle();
Stroke color
Get
var color = arc.strokeColor;
Set
arc.setStrokeStyle(lineWidth, color, alpha);
Clear
arc.setStrokeStyle();
No tint methods
Uses arc.setFillStyle(color, alpha) to change color.
Alpha¶
Get
var alpha = arc.alpha;
Set
arc.setAlpha(alpha);
// arc.alpha = alpha;
Angle¶
Start angle, in degrees.
Get
var startAngle = arc.startAngle;
Set
arc.setStartAngle(startAngle);
// arc.setStartAngle(startAngle, anticlockwise);
or
arc.startAngle = startAngle;
End angle, in degrees.
Get
var endAngle = arc.endAngle;
Set
arc.seEndAngle(endAngle);
or
arc.endAngle = endAngle;
Anticlockwise (true, or false)
Get
var anticlockwise = arc.anticlockwise;
Set
arc.anticlockwise = anticlockwise;
Radius¶
Radius
Get
var radius = arc.radius;
Set
arc.setRadius(radius);
or
arc.radius = radius;
Iterations: Increase this value for smoother arcs, at the cost of more polygons being rendered. Default is 0.01
Get
var iterations = arc.iterations;
Set
arc.iterations = iterations;
Display size¶
Get
var width = arc.displayWidth;
var height = arc.displayHeight;
Set
arc.setDisplaySize(width, height);
or
arc.displayWidth = width;
arc.displayHeight = height;
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters