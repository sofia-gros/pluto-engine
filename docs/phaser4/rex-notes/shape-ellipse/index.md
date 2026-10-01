Ellipse
Introduction¶
Ellipse shape, built-in game object of phaser.
Author: Phaser Team
Usage¶
Create shape object¶
var ellipse = scene.add.ellipse(x, y, width, height, fillColor);
// var ellipse = scene.add.ellipse(x, y, width, height, fillColor, fillAlpha);
Custom class¶
Define class
class MyEllipse extends Phaser.GameObjects.Ellipse {
constructor(scene, x, y, width, height, fillColor, fillAlpha) {
super(scene, x, y, width, height, fillColor, fillAlpha);
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
var ellipse = new MyEllipse(scene, x, y, width, height, fillColor, fillAlpha);
Color¶
Fill color
Get
var color = ellipse.fillColor;
var alpha = ellipse.fillAlpha;
Set
ellipse.setFillStyle(color, alpha);
Clear
ellipse.setFillStyle();
Stroke color
Get
var color = ellipse.strokeColor;
Set
ellipse.setStrokeStyle(lineWidth, color, alpha);
Clear
ellipse.setStrokeStyle();
No tint methods
Uses ellipse.setFillStyle(color, alpha) to change color.
Alpha¶
Get
var alpha = ellipse.alpha;
Set
ellipse.setAlpha(alpha);
// ellipse.alpha = alpha;
Size¶
Get
var width = ellipse.width;
var height = ellipse.height;
Set
ellipse.setSize(width, height);
Display size¶
Get
var width = ellipse.displayWidth;
var height = ellipse.displayHeight;
Set
ellipse.setDisplaySize(width, height);
or
ellipse.displayWidth = width;
ellipse.displayHeight = height;
Smoothness¶
The number of points used when rendering it. Increase this value for smoother curves, at the cost of more polygons being rendered.
ellipse.setSmoothness(smoothness);
or
ellipse.smoothness = smoothness;
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters