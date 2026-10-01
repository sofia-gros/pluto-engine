Star
Introduction¶
Star shape, built-in game object of phaser.
Author: Phaser Team
Usage¶
Create shape object¶
var star = scene.add.star(x, y, points, innerRadius, outerRadius, fillColor);
// var star = scene.add.star(x, y, points, innerRadius, outerRadius, fillColor, fillAlpha);
points : The number of points on the star. Default is 5.
innerRadius : The inner radius of the star. Default is 32.
outerRadius : The outer radius of the star. Default is 64.
Custom class¶
Define class
class MyStar extends Phaser.GameObjects.Star {
constructor(scene, x, y, points, innerRadius, outerRadius, fillColor) {
super(scene, x, y, points, innerRadius, outerRadius, fillColor);
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
var star = new MyStar(scene, x, y, points, innerRadius, outerRadius, fillColor);
Color¶
Fill color
Get
var color = star.fillColor;
var alpha = star.fillAlpha;
Set
star.setFillStyle(color, alpha);
Clear
star.setFillStyle();
Stroke color
Get
var color = star.strokeColor;
Set
star.setStrokeStyle(lineWidth, color, alpha);
Clear
star.setStrokeStyle();
No tint methods
Uses star.setFillStyle(color, alpha) to change color.
Alpha¶
Get
var alpha = star.alpha;
Set
star.setAlpha(alpha);
// star.alpha = alpha;
Radius¶
Inner radius
Get
var innerRadius = star.innerRadius;
Set
star.setInnerRadius(innerRadius);
or
star.innerRadius = innerRadius;
Outer radius
Get
var outerRadius = star.outerRadius;
Set
star.setOuterRadius(outerRadius);
or
star.outerRadius = outerRadius;
Points
Get
var points = star.points;
Set
star.setPoints(points);
or
star.points = points;
Display size¶
Get
var width = star.displayWidth;
var height = star.displayHeight;
Set
star.setDisplaySize(width, height);
or
star.displayWidth = width;
star.displayHeight = height;
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters