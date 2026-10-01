Line
Introduction¶
Line shape, built-in game object of phaser.
Author: Phaser Team
Usage¶
Create shape object¶
var line = scene.add.line(x, y, x1, y1, x2, y2, strokeColor);
// var line = scene.add.line(x, y, x1, y1, x2, y2, strokeColor, strokeAlpha);
Custom class¶
Define class
class MyCurve extends Phaser.GameObjects.Line {
constructor(scene, x, y, x1, y1, x2, y2, strokeColor) {
super(scene, x, y, x1, y1, x2, y2, strokeColor);
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
var line = new MyLine(scene, x, y, x1, y1, x2, y2, strokeColor);
Set color¶
Fill color
Get
var color = line.fillColor;
var alpha = line.fillAlpha;
Set
line.setFillStyle(color, alpha);
Clear
line.setFillStyle();
Stroke color
Get
var color = line.strokeColor;
Set
line.setStrokeStyle(lineWidth, color, alpha);
Clear
line.setStrokeStyle();
No tint methods
Uses line.setFillStyle(color, alpha) to change color.
Alpha¶
Get
var alpha = line.alpha;
Set
line.setAlpha(alpha);
// line.alpha = alpha;
Set end points¶
line.setTo(x1, y1, x2, y2);
Line width¶
line.setLineWidth(startWidth, endWidth);
endWidth : The end width of the line. Only used in WebGL.
Display size¶
Get
var width = line.displayWidth;
var height = line.displayHeight;
Set
line.setDisplaySize(width, height);
or
line.displayWidth = width;
line.displayHeight = height;
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters