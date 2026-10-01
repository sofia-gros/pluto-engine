Rectangle
Introduction¶
Rectangle shape, built-in game object of phaser.
Author: Phaser Team
Usage¶
Create shape object¶
var rect = scene.add.rectangle(x, y, width, height, fillColor);
// var rect = scene.add.rectangle(x, y, width, height, fillColor, fillAlpha);
Custom class¶
Define class
class MyRectangle extends Phaser.GameObjects.Rectangle {
constructor(scene, x, y, width, height, fillColor) {
super(scene, x, y, width, height, fillColor);
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
var rect = new MyRectangle(scene, x, y, width, height, fillColor);
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
Round¶
Set
rect.setRounded(radius);
radius :
> 0 : The radius of all four rounded corners.
0 : Disable rounded corners.
Get
var radius = rect.radius;
Is rounded
var isRounded = rect.isRounded;
See also round-rectangle
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters