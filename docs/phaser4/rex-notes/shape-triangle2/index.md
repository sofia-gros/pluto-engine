Triangle 2
Introduction¶
Trangle shape inside a rectangle bounds.
Author: Rex
Game object
Live demos¶
Ease direction
Rotate
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rextriangleplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextriangleplugin.min.js', true);
Add triangle object
var triangle = scene.add.rexTriangle(x, y, width, height, fillColor, fillAlpha);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import TrianglePlugin from 'phaser4-rex-plugins/plugins/triangle-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexTrianglePlugin',
plugin: TrianglePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add triangle object
var triangle = scene.add.rexTriangle(x, y, width, height, fillColor, fillAlpha);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import Triangle from 'phaser4-rex-plugins/plugins/triangle.js';
Add triangle object
var triangle = new Triangle(scene, x, y, width, height, fillColor, fillAlpha);
scene.add.existing(triangle);
Install plugin¶
Install plugin in configuration of game
var config = {
// ...
plugins: {
global: [{
key: 'rexTrianglePlugin',
plugin: TrianglePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Create instance¶
var triangle = scene.add.rexTriangle(x, y, width, height, fillColor, fillAlpha);
or
var triangle = scene.add.rexTriangle({
x: 0,
y: 0,
width: 2,
height: 2,
color: undefined,
alpha: undefined,
strokeColor: undefined,
strokeAlpha: undefined,
strokeWidth: undefined,
arrowOnly: false,
direction: 0,
easeDuration: 0,
padding: 0,
// padding: {
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
// },
radius: undefined,
});
x, y : Position of this object.
width, height : Size of this object.
arrowOnly :
false : Fill and stroke triangle shape. Default behavior.
true : Only stroke arrow of triangle shape.
direction : Direction of triangle's arrow.
0, or 'right' : Arrow to right. Default value.
1, or 'down' : Arrow to down.
2, or 'left' : Arrow to left.
3, or 'up' : Arrow to up.
easeDuration : Ease duration when direction changed.
0 : No ease transform. Default value.
padding : Space around triagnle.
A number. Default value is 0.
A plain object
{
left:0, right:0, top: 0, bottom: 0
}
radius : Put 3 vertices of trangle in a circle.
undefined : Disable this mode. Default behavior.
0~1 : Radius in ratio of min(half-width, half-height)
Custom class¶
Define class
class MyTriangle extends Triangle {
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
var triangle = new MyTriangle(scene, x, y, width, height, fillColor, fillAlpha);
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
Size¶
Get
var width = triangle.width;
var height = triangle.height;
Set
triangle.setSize(width, height);
or
triangle.width = width;
triangle.height = height;
Display size¶
Get
var width = triangle.displayWidth;
var height = triangle.displayHeight;
Set
triangle.setDisplaySize(width, height);
or
triangle.displayWidth = width;
triangle.displayHeight = height;
Direction¶
Get
var direction = triangle.direction;
0 : Arrow to right. Default value.
1 : Arrow to down.
2 : Arrow to left.
3 : Arrow to up.
Set
triangle.setDirection(direction);
// triangle.direction = direction;
or
triangle.setDirection(direction, easeDuration);
direction :
0, or 'right' : Arrow to right.
1, or 'down' : Arrow to down.
2, or 'left' : Arrow to left.
3, or 'up' : Arrow to up.
easeDuration : Override current ease-duration time.
Toggle
triangle.toggleDirection();
// triangle.direction += 2;
or
triangle.toggleDirection(easeDuration);
Padding¶
Get
var padding = triangle.padding;
padding :
{ left, right, top, bottom }
Set
triangle.setPadding(padding);
or
triangle.setPadding({
left, right, top, bottom
});
or
triangle.setPadding({
x, y
});
Ease duration¶
Get
var easeDuration = triangle.easeDuration;
Set
triangle.setEaseDuration(easeDuration);
Arrow only¶
Get
var arrowOnly = triangle.arrowOnly;
Set
triangle.setArrowOnly(enable);
// triangle.arrowOnly = enable;
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters