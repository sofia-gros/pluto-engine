Triangle
Introduction¶
Triangle shape, built-in game object of phaser.
Author: Phaser Team
Usage¶
Create shape object¶
var triangle = scene.add.triangle(x, y, x1, y1, x2, y2, x3, y3, fillColor);
// var triangle = scene.add.triangle(x, y, x1, y1, x2, y2, x3, y3, fillColor, fillAlpha);
Custom class¶
Define class
class MyTriangle extends Phaser.GameObjects.Triangle {
constructor(scene, x, y, x1, y1, x2, y2, x3, y3, fillColor) {
super(scene, x, y, x1, y1, x2, y2, x3, y3, fillColor);
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
var triangle = new MyTriangle(scene, x, y, x1, y1, x2, y2, x3, y3, fillColor);
Color¶
Fill color
Get
var color = triangle.fillColor;
var alpha = triangle.fillAlpha;
Set
triangle.setFillStyle(color, alpha);
Clear
triangle.setFillStyle();
Stroke color
Get
var color = triangle.strokeColor;
Set
triangle.setStrokeStyle(lineWidth, color, alpha);
Clear
triangle.setStrokeStyle();
No tint methods
Uses triangle.setFillStyle(color, alpha) to change color.
Alpha¶
Get
var alpha = triangle.alpha;
Set
triangle.setAlpha(alpha);
// triangle.alpha = alpha;
Set vertices¶
triangle.setTo(x1, y1, x2, y2, x3, y3);
Triangle width¶
triangle.setLineWidth(startWidth, endWidth);
endWidth : The end width of the triangle. Only used in WebGL.
Display size¶
Get
var width = triangle.displayWidth;
var height = triangle.displayHeight;
Set
triangle.setDisplaySize(width, height);
or
triangle.displayWidth = width;
triangle.displayHeight = height;
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters