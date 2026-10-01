Line2
Introduction¶
A line shape, composed of 4 points
Author: Rex
Game object
Live demos¶
Line type
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexlineshapelugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexlineshapelugin.min.js', true);
Add line object
var line = scene.add.rexLineShape(points, lineWidth, color, alpha, lineType);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import LineShapePlugin from 'phaser4-rex-plugins/plugins/line-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexLineShapePlugin',
plugin: LineShapePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(points, lineWidth, color, alpha, lineType);
Add line object
var line = scene.add.rexLineShape(points, lineWidth, color, alpha, lineType);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import LineShape from 'phaser4-rex-plugins/plugins/lineshape.js';
Add line object
var line = new LineShape(points, lineWidth, color, alpha, lineType);
scene.add.existing(line);
Install plugin¶
Install plugin in configuration of game
var config = {
// ...
plugins: {
global: [{
key: 'rexLineShapePlugin',
plugin: LineShapePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Create instance¶
var line = scene.add.rexLineShape(points, lineWidth, color, alpha, {
lineType: 0,
pointRadius: 10,
headShape: 0,
headSize: undefined,
headColor: undefined,
headAlpha: 1,
headStrokeWidth: undefined,
headStrokeColor: undefined,
headStrokeAlpha: 1,
tailShape: 0,
tailSize: undefined,
tailColor: undefined,
tailAlpha: 1,
tailStrokeWidth: undefined,
tailStrokeColor: undefined,
tailStrokeAlpha: 1,
dashPattern: undefined,
dashOffset: undefined,
});
or
var line = scene.add.rexLineShape({
points: [],
lineWidth: 2,
color: 0xffffff,
alpha: 1,
lineType: 0,
pointRadius: 10,
headShape: 0,
headSize: undefined,
headColor: undefined,
headAlpha: 1,
headStrokeWidth: undefined,
headStrokeColor: undefined,
headStrokeAlpha: 1,
tailShape: 0,
tailSize: undefined,
tailColor: undefined,
tailAlpha: 1,
tailStrokeWidth: undefined,
tailStrokeColor: undefined,
tailStrokeAlpha: 1,
dashPattern: undefined,
dashOffset: undefined,
});
lineType :
0 or 'bezier' : Bezier line type, default type.
1 or 'spline' : Spline line type.
2 or 'polyline', 'poly' : Polygon line type.
3 or 'straightline', 'straight' : Straight line type.
points : An array with 4 {x,y} elements
Straight line type will use 1st and last {x, y} elements
lineWidth : Line width.
color : Stroke color.
alpha : Stroke alpha.
pointRadius : Radius of the point used in interaction detection, default value is 10.
headShape, tailShape : Shape type of end point
0, or 'none' : No end point, default value
1, or 'triangle' : A triangle shape of end point
2, or 'dot' : A circle shape of end point
3, or 'box' : A rectangle shape of end point
4, or diamond : A diamond shape of end point
headSize, tailSize : Size of end point, default value is lineWidth * 4
headColor, headAlpha, tailColor, tailAlpha : Fill style of end point
headStrokeWidth, headStrokeColor, headStrokeAlpha, tailStrokeWidth, tailStrokeColor, tailStrokeAlpha : Stroke style of end point
dashPattern : Default style is solid line.
An array
[drawLength, skipLength], or
[drawLengthA, skipLengthA, drawLengthB, skipLengthB, ...]
An plain object
{
segments: 10,
drawRatio: 0.5
}
dashOffset : Offset of 1st dashed segment. Default value is 0
Custom class¶
Define class
class MyLineShape extends LineShape {
constructor(scene, points, lineWidth, color, alpha, lineType) {
super(scene, points, lineWidth, color, alpha, lineType);
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
var line = new MyLineShape(scene, points, lineWidth, color, alpha, lineType);
Color¶
Fill color
Get
var color = line.fillColor;
var alpha = line.fillAlpha;
Set
line.setFillStyle(color, alpha);
Clear
line.setFillStyle();
Stroke color
Get
var color = line.strokeColor;
Set
line.setStrokeStyle(lineWidth, color, alpha);
Clear
line.setStrokeStyle();
No tint methods
Uses line.setFillStyle(color, alpha) to change color.
Alpha¶
Get
var alpha = line.alpha;
Set
line.setAlpha(alpha);
// line.alpha = alpha;
Points¶
Get
var points = line.points;
Set
line.setLine(points, lineType);
lineType :
0 or 'bezier' : Bezier line type, default type.
1 or 'spline' : Spline line type.
2 or 'polyline', 'poly' : Polygon line type.
3 or 'straightline', 'straight' : Straight line type.
points : An array with 4 {x,y} elements
Straight line type will use 1st and last {x, y} elements
Line type¶
Get
var lineType = line.lineType;
Set
line.setLineType(lineType);
lineType :
0 or 'bezier' : Bezier line type, default type.
1 or 'spline' : Spline line type.
2 or 'polyline', 'poly' : Polygon line type.
3 or 'straightline', 'straight' : Straight line type.
Dashed¶
Set dash pattern
line.setDashPattern(pattern, offset);
pattern :
An array
[drawLength, skipLength], or
[drawLengthA, skipLengthA, drawLengthB, skipLengthB, ...]
An plain object
{
segments: 10,
drawRatio: 0.5
}
offset : Offset of 1st dashed segment. Default value is 0
Clear dashed
line.setDashed(false);
or
line.clearDashPattern();
Input event¶
line
.setInteractive()
.on('pointerover', function () {
})
.on('pointerout', function () {
})
Set point radius
line.setPointRadius(radius);
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters