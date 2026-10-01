Quad
Introduction¶
Quad shape, offsets can be given on four vertices, and additional points can be added on the four sides.
Author: Rex
Game object
Live demos¶
Ease vertices
Ease side-points
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexquadshapeplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexquadshapeplugin.min.js', true);
Add shape object
var quad = scene.add.rexQuadShape(x, y, width, height, fillColor, fillAlpha);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import QuadShapePlugin from 'phaser4-rex-plugins/plugins/quadshape-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexQuadShapePlugin',
plugin: QuadShapePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add shape object
var quad = scene.add.rexQuadShape(x, y, width, height, fillColor, fillAlpha);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import QuadShape from 'phaser4-rex-plugins/plugins/quadshape.js';
Add shape object
var quad = new QuadShape(scene, x, y, width, height, fillColor, fillAlpha);
scene.add.existing(quad);
Create shape object¶
var quad = scene.add.rexQuadShape(x, y, width, height, fillColor, fillAlpha);
or
var quad = scene.add.rexQuadShape({
x: 0,
y: 0,
width: undefined,
height: undefined,
color: undefined,
alpha: undefined,
strokeColor: undefined,
strokeAlpha: undefined,
strokeWidth: 2,
tlx: 0,
tly: 0,
trx: 0,
try: 0,
blx: 0,
bly: 0,
brx: 0,
bry: 0,
leftSidePoints: [
// {t, x, y, key},
// {t, x, y, key},
// ...
],
rightSidePoints: [
// {t, x, y, key},
// {t, x, y, key},
// ...
],
topSidePoints: [
// {t, x, y, key},
// {t, x, y, key},
// ...
],
bottomSidePoints: [
// {t, x, y, key},
// {t, x, y, key},
// ...
],
});
width, height : Size of quadangle.
undefined : Set ot undefined to draw a circle.
tlx, tly : Offset of top-left vertex.
trx, try : Offset of top-right vertex.
blx, bly : Offset of bottom-left vertex.
brx, bry : Offset of bottom-right vertex.
leftSidePoints, rightSidePoints, topSidePoints, bottomSidePoints : A list of points, additional points on left-side/right-side/top-side/bottom-side.
{
t, x, y, key
}
t : Position in percent of edge.
x, y : Offset of this point on edge.
key :
undefined : Ignore this feature. Default value.
A string: Inject key+'Ｘ', key+'Y', key+'T' properties into this quad shape game object.
Custom class¶
Define class
class MyQuadShape extends RexPlugins.GameObjects.QuadShape {
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
var quad = new MyQuadShape(scene, x, y, width, height, fillColor, fillAlpha);
Color¶
Fill color
Get
var color = quad.fillColor;
var alpha = quad.fillAlpha;
Set
quad.setFillStyle(color, alpha);
Clear
quad.setFillStyle();
Stroke color
Get
var color = quad.strokeColor;
Set
quad.setStrokeStyle(lineWidth, color, alpha);
Clear
quad.setStrokeStyle();
No tint methods
Uses quad.setFillStyle(color, alpha) to change color.
Alpha¶
Get
var alpha = quad.alpha;
Set
quad.setAlpha(alpha);
// quad.alpha = alpha;
Size¶
Get
var width = quad.width;
var height = quad.height;
Set
quad.setSize(width, height);
or
quad.width = width;
quad.height = height;
Display size¶
Get
var width = quad.displayWidth;
var height = quad.displayHeight;
Set
quad.setDisplaySize(width, height);
or
quad.displayWidth = width;
quad.displayHeight = height;
Position of vertices¶
Top-left vertex
Get
var x = quad.tlx;
var y = quad.tly;
Set
quad.setTLPosition(x, y);
or
quad.tlx = x;
quad.tly = y;
Top-right vertex
Get
var x = quad.trx;
var y = quad.try;
Set
quad.setTRPosition(x, y);
or
quad.trx = x;
quad.try = y;
Bottom-left vertex
Get
var x = quad.blx;
var y = quad.bly;
Set
quad.setBLPosition(x, y);
or
quad.blx = x;
quad.bly = y;
Bottom-right vertex
Get
var x = quad.brx;
var y = quad.bry;
Set
quad.setBRPosition(x, y);
or
quad.brx = x;
quad.bry = y;
Position of side points¶
Top side
quad.insertTopSidePoint(t, x, y);
// quad.insertTopSidePoint(t, x, y, key);
// quad.insertTopSidePoint({t, x, y, key});
t : Position in percent of edge.
x, y : Offset of this point on edge.
key :
- undefined : Ignore this feature. Default value.
- A string: Inject key+'Ｘ', key+'Y', key+'T' properties into this quad shape game object.
Right side
quad.insertRightSidePoint(t, x, y);
// quad.insertRightSidePoint(t, x, y, key);
// quad.insertRightSidePoint({t, x, y, key});
t : Position in percent of edge.
x, y : Offset of this point on edge.
key :
- undefined : Ignore this feature. Default value.
- A string: Inject key+'Ｘ', key+'Y', key+'T' properties into this quad shape game object.
Bottom side
quad.insertBottomSidePoint(t, x, y);
// quad.insertBottomSidePoint(t, x, y, key);
// quad.insertBottomSidePoint({t, x, y, key});
t : Position in percent of edge.
x, y : Offset of this point on edge.
key :
- undefined : Ignore this feature. Default value.
- A string: Inject key+'Ｘ', key+'Y', key+'T' properties into this quad shape game object.
Left side
quad.insertLeftSidePoint(t, x, y);
// quad.insertLeftSidePoint(t, x, y, key);
// quad.insertLeftSidePoint({t, x, y, key});
t : Position in percent of edge.
x, y : Offset of this point on edge.
key :
- undefined : Ignore this feature. Default value.
- A string: Inject key+'Ｘ', key+'Y', key+'T' properties into this quad shape game object.
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters