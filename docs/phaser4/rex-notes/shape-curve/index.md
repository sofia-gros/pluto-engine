Curve
Introduction¶
Curve shape, built-in game object of phaser.
Author: Phaser Team
Usage¶
Create shape object¶
var curve = scene.add.curve(x, y, path, fillColor);
// var curve = scene.add.curve(x, y, path, fillColor, fillAlpha);
path : Path object.
Custom class¶
Define class
class MyCurve extends Phaser.GameObjects.Curve {
constructor(scene, x, y, path, fillColor, fillAlpha) {
super(scene, x, y, path, fillColor, fillAlpha);
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
var curve = new MyCurve(scene, x, y, path, fillColor, fillAlpha);
Color¶
Fill color
Get
var color = curve.fillColor;
var alpha = curve.fillAlpha;
Set
curve.setFillStyle(color, alpha);
Clear
curve.setFillStyle();
Stroke color
Get
var color = curve.strokeColor;
Set
curve.setStrokeStyle(lineWidth, color, alpha);
Clear
curve.setStrokeStyle();
No tint methods
Uses curve.setFillStyle(color, alpha) to change color.
Alpha¶
Get
var alpha = curve.alpha;
Set
curve.setAlpha(alpha);
// curve.alpha = alpha;
Smoothness¶
The number of points used when rendering it. Increase this value for smoother curves, at the cost of more polygons being rendered.
curve.setSmoothness(smoothness);
or
curve.smoothness = smoothness;
Display size¶
Get
var width = curve.displayWidth;
var height = curve.displayHeight;
Set
curve.setDisplaySize(width, height);
or
curve.displayWidth = width;
curve.displayHeight = height;
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters