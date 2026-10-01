Iso box
Introduction¶
Iso-box shape, built-in game object of phaser.
Author: Phaser Team
Usage¶
Create shape object¶
var isoBox = scene.add.isobox(x, y, width, height, fillTop, fillLeft, fillRight);
Custom class¶
Define class
class MyIsoBox extends Phaser.GameObjects.IsoBox {
constructor(scene, x, y, width, height, fillTop, fillLeft, fillRight) {
super(scene, x, y, width, height, fillTop, fillLeft, fillRight);
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
var isoBox = new MyIsoBox(scene, x, y, width, height, fillTop, fillLeft, fillRight);
Set color¶
Fill color
isoBox.setFillStyle(fillTop, fillLeft, fillRight);
Show face
isoBox.setFaces(showTop, showLeft, showRight);
showTop, showLeft, showRight: Set true to show that face
No tint methods
Uses isoBox.setFillStyle(fillTop, fillLeft, fillRight) to change color.
Alpha¶
Get
var alpha = isoBox.alpha;
Set
isoBox.setAlpha(alpha);
// isoBox.alpha = alpha;
Projection¶
Get
var projection = isoBox.projection;
Set
isoBox.setProjection(value)
or
isoBox.projection = value;
Display size¶
Get
var width = isoBox.displayWidth;
var height = isoBox.displayHeight;
Set
isoBox.setDisplaySize(width, height);
or
isoBox.displayWidth = width;
isoBox.displayHeight = height;
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters