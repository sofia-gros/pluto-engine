Iso triangle
Introduction¶
Iso-triangle shape, built-in game object of phaser.
Author: Phaser Team
Usage¶
Create shape object¶
var isoTriangle = scene.add.isotriangle(x, y, width, height, reversed, fillTop, fillLeft, fillRight);
Custom class¶
Define class
class MyIsoTriangle extends Phaser.GameObjects.IsoTriangle {
constructor(scene, x, y, width, height, reversed, fillTop, fillLeft, fillRight) {
super(scene, x, y, width, height, reversed, fillTop, fillLeft, fillRight);
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
var isoTriangle = new MyIsoTriangle(scene, x, y, width, height, reversed, fillTop, fillLeft, fillRight);
Set color¶
Fill color
isoTriangle.setFillStyle(fillTop, fillLeft, fillRight);
Show face
isoTriangle.setFaces(showTop, showLeft, showRight);
showTop, showLeft, showRight: Set true to show that face
No tint methods
Uses isoTriangle.setFillStyle(fillTop, fillLeft, fillRight) to change color.
Alpha¶
Get
var alpha = isoTriangle.alpha;
Set
isoTriangle.setAlpha(alpha);
// isoTriangle.alpha = alpha;
Projection¶
Get
var projection = isoTriangle.projection;
Set
isoTriangle.setProjection(value)
or
isoTriangle.projection = value;
Reverse¶
Get
var isReversed = isoTriangle.isReversed;
Set
isoTriangle.setReversed(reversed);
or
isoTriangle.reversed = reversed;
Set true to render upside down.
Display size¶
Get
var width = isoTriangle.displayWidth;
var height = isoTriangle.displayHeight;
Set
isoTriangle.setDisplaySize(width, height);
or
isoTriangle.displayWidth = width;
isoTriangle.displayHeight = height;
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters