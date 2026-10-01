Image
Introduction¶
Image with 4 or 9 vertex control points.
Author: Rex
Game object
WebGL only
It only works in WebGL render mode.
Live demos¶
Quad image
Nine points
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexquadimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexquadimageplugin.min.js', true);
Add image object
var image = scene.add.rexQuadImage(x, y, texture, frame, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import QuadImagePlugin from 'phaser4-rex-plugins/plugins/quadimage-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexQuadImagePlugin',
plugin: QuadImagePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add image object
var image = scene.add.rexQuadImage(x, y, texture, frame, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { QuadImage } from 'phaser4-rex-plugins/plugins/quadimage.js';
Add image object
var image = new QuadImage(scene, x, y, texture, frame, config);
scene.add.existing(image);
Create instance¶
var image = scene.add.rexQuadImage(x, y, texture, frame, {
// ninePointMode: false,
});
or
var image = scene.add.rexQuadImage({
// x: 0,
// y: 0,
key,
// frame: null,
// ninePointMode: false,
// rtl: false
});
ninePointMode :
true : Add 9 vertex control points.
false : Add 4 vertex control points. Default behavior.
rtl : Diagonal direction in 4 vertices mode.
true : Diagonal from right to left
false : Diagonal from left to right. Default behavior.
Add quadimage from JSON
var quadimage = scene.make.rexQuadImage({
x: 0,
y: 0,
key: null,
frame: null,
// ninePointMode: false,
// rtl: false
add: true
});
Custom class¶
Define class
class MyQuadImage extends QuadImage {
constructor(scene, x, y, texture, frame, config) {
super(scene, x, y, texture, frame, config);
// ...
scene.add.existing(this);
}
// ...
// preUpdate(time, delta) {
//     super.preUpdate(time, delta);
// }
}
scene.add.existing(gameObject) : Adds an existing Game Object to this Scene.
If the Game Object renders, it will be added to the Display List.
If it has a preUpdate method, it will be added to the Update List.
Create instance
var image = new MyQuadImage(scene, x, y, texture, frame, config);
Vertex objects¶
Array of vertex objects
var vertexObjects = image.vertexObjects;
4, or 9 vertex objects
4 vertex control points
var topLeftPoint = image.topLeft;         // image.vertexObjects[0]
var topRightPoint = image.topRight;       // image.vertexObjects[1]
var bottomLeftPoint = image.bottomLeft;   // image.vertexObjects[2]
var bottomRightPoint = image.bottomRight; // image.vertexObjects[3]
9 vertex objects
var topLeft = image.topLeft;               // image.vertexObjects[0]
var topCenter = image.topCenter;           // image.vertexObjects[1]
var topRight = image.topRight;             // image.vertexObjects[2]
var centerLeft = image.centerLeft;         // image.vertexObjects[3]
var center = image.center;                 // image.vertexObjects[4]
var centerRight = image.centerRight;       // image.vertexObjects[5]
var bottomLeft = image.bottomLeft;         // image.vertexObjects[6]
var bottomCenter = image.bottomCenter;     // image.vertexObjects[7]
var bottomRight = image.bottomRight;       // image.vertexObjects[8]
Position¶
Get
var worldXY = vertexObjects.getWorldXY();
var x = worldXY.x;
var y = worldXY.y;
or
var x = vertexObjects.x;
var y = vertexObjects.y;
Set
vertexObjects.setPosition(x, y);
// vertexObjects.setWorldXY(x, y);
or
vertexObjects.x = x;
vertexObjects.y = y;
Tint color¶
Get
var color = image.tint;
Set
image.tint = color;
or
image.setTint(color);
Other properties¶
See Mesh2D game object, game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters