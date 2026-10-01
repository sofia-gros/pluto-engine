Image
Introduction¶
Split image to triangle faces. Similar with ShatterImage, with different spliting rule.
Reference: Delaunay Triangulation
Author: Rex
Game object
WebGL only
It only works in WebGL render mode.
Live demos¶
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexdelaunayimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexdelaunayimageplugin.min.js', true);
Add image object
var image = scene.add.rexDelaunayImage(x, y, texture, frame, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import DelaunayImagePlugin from 'phaser4-rex-plugins/plugins/delaunayimage-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexDelaunayImagePlugin',
plugin: DelaunayImagePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add image object
var image = scene.add.rexDelaunayImage(x, y, texture, frame, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { DelaunayImage } from 'phaser4-rex-plugins/plugins/delaunayimage.js';
Add image object
var image = new DelaunayImage(scene, x, y, texture, frame, config);
scene.add.existing(image);
Create instance¶
var image = scene.add.rexDelaunayImage(x, y, texture, frame, {
// triangleCount: 8,
});
or
var image = scene.add.rexDelaunayImage({
// x: 0,
// y: 0,
key,
// frame: null,
// triangleCount: 8,
});
triangleCount : Triangle count, an even number.
Add perspectiveimage from JSON
var perspectiveimage = scene.make.rexDelaunayImage({
x: 0,
y: 0,
key: null,
frame: null,
// triangleCount: 8,
add: true
});
Custom class¶
Define class
class MyDelaunayImage( extends DelaunayImage( {
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
var image = new MyDelaunayImage(scene, x, y, texture, frame, config);
Delaunay image¶
image.reTriangulate({triangleCount});
// image.reTriangulate();
triangleCount : Triangle count, an even number.
Delaunay image into triangle faces.
Faces¶
var faces = image.faces;
Faces will be sorted nearby delaunay-center to far away.
Properties¶
Alpha
Get
var alpha = face.alpha;
Set
face.alpha = alpha;
or
face.setAlpha(value);
Tint color
Get
var color = face.tint;
Set
face.tint = color;
or
face.setTint(color);
Angle
Get
var radians = face.rotation;
// var degree = face.angle;
Set
face.rotation = radians;
// face.angle = degree;
or
face.setRotation(radians);
// face.setAngle(degree);
Center position
Get
var x = face.x;
var y = face.y;
x : 0(left) ~ 1(right)
y : 1(top) ~ 0(bottom)
Set
face.x = x;
face.y = y;
or
face.translate(x, y);
x : 0(left) ~ 1(right)
y : 1(top) ~ 0(bottom)
Vertices
var vertex0 = face.vertex0;
var vertex1 = face.vertex1;
var vertex2 = face.vertex2;
or
var vertices = face.vertices;
var vertex0 = vertices[0];
var vertex1 = vertices[1];
var vertex2 = vertices[2];
Tween properties¶
image.startUpdate();
scene.tweens.add({
targets: image.faces,
alpha: 0,
angle: function () { return -90 + Math.random() * 180; },
y: '-=0.5',
ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
duration: 1000,
delay: scene.tweens.stagger(20),
repeat: 0,            // -1: infinity
yoyo: false,
onComplete: function () {
// image.resetImage()
}
});
Vertices¶
Each face has 3 vertices, and a face can use vertices shared by other faces.
var vertices = mesh.vertices;
vertices : Array of vertex.
var vertices = face.vertices;
Properties¶
World position
Get
var worldX = vertex.worldX;
var worldY = vertex.worldY;
// var worldX = vertex.x;
// var worldY = vertex.y;
or
var wordXY = vertex.getWorldXY();       // {x,y}
// var worldXY= vertex.getWorldXY(out);
Local position
Get
var localX = vertex.localX;
var localY = vertex.localY;
Reset to default position
vertex.resetPosition();
Alpha
Get
var alpha = vertex.alpha;
Set
vertex.alpha = alpha;
Tint
Get
var color = vertex.color;
Set
vertex.color = color;
Reset image¶
Display original image with 2 faces.
image.resetImage();
Tint color¶
Get
var color = image.tint;
Set
image.tint = color;
or
image.setTint(color);
Other properties¶
See Mesh game object, game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters