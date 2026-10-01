Grid
Introduction¶
Grid shape, built-in game object of phaser.
Author: Phaser Team
Usage¶
Create shape object¶
var grid = scene.add.grid(x, y, width, height, cellWidth, cellHeight, fillColor, fillAlpha, outlineFillColor, outlineFillAlpha);
Custom class¶
Define class
class MyGrid extends Phaser.GameObjects.Grid {
constructor(scene, x, y, width, height, cellWidth, cellHeight, fillColor, fillAlpha, outlineFillColor, outlineFillAlpha) {
super(scene, x, y, width, height, cellWidth, cellHeight, fillColor, fillAlpha, outlineFillColor, outlineFillAlpha);
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
var grid = new MyGrid(scene, x, y, width, height, cellWidth, cellHeight, fillColor, fillAlpha, outlineFillColor, outlineFillAlpha);
Color¶
Fill color
Get
var color = grid.fillColor;
var alpha = grid.fillAlpha;
Set
grid.setFillStyle(color, alpha);
Clear
grid.setFillStyle();
Stroke color
Get
var color = grid.strokeColor;
Set
grid.setStrokeStyle(lineWidth, color, alpha);
Clear
grid.setStrokeStyle();
Alternating color
Get
var color = grid.altFillColor;
Set
grid.setAltFillStyle(color, alpha);
Clear
grid.setAltFillStyle();
Outline color
Get
var color = grid.outlineFillColor;
Set
grid.setOutlineStyle(color, alpha;
Clear
grid.setOutlineStyle();
No tint methods
Uses grid.setFillStyle(color, alpha) to change color.
Alpha¶
Get
var alpha = grid.alpha;
Set
grid.setAlpha(alpha);
// grid.alpha = alpha;
Display size¶
Get
var width = grid.displayWidth;
var height = grid.displayHeight;
Set
grid.setDisplaySize(width, height);
or
grid.displayWidth = width;
grid.displayHeight = height;
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters