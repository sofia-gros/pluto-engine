Image
Introduction¶
Shatter image to triangle faces.
Reference: Delaunay Triangulation
Author: Rex
Game object
WebGL only
It only works in WebGL render mode.
Live demos¶
Shatter image
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexshatterimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexshatterimageplugin.min.js', true);
Add image object
var image = scene.add.rexShatterImage(x, y, texture, frame, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import ShatterImagePlugin from 'phaser4-rex-plugins/plugins/shatterimage-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexShatterImagePlugin',
plugin: ShatterImagePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add image object
var image = scene.add.rexShatterImage(x, y, texture, frame, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { ShatterImage } from 'phaser4-rex-plugins/plugins/shatterimage.js';
Add image object
var image = new ShatterImage(scene, x, y, texture, frame, config);
scene.add.existing(image);
Create instance¶
var image = scene.add.rexShatterImage(x, y, texture, frame, {
// ringRadiusList: [1 / 27, 3 / 27, 9 / 27],
// ringRadiusList: function(width, height) {
//    return [1 / 27, 3 / 27, 9 / 27];
// },
// samplesPerRing: 12
// variation: 0.25,
});
or
var image = scene.add.rexShatterImage({
// x: 0,
// y: 0,
key,
// frame: null,
// ringRadiusList: [1 / 27, 3 / 27, 9 / 27],
// ringRadiusList: function(width, height) {
//    return [1 / 27, 3 / 27, 9 / 27];
// },
// samplesPerRing: 12,
// variation: 0.25,
});
ringRadiusList :
A list of number. Default value is [1 / 27, 3 / 27, 9 / 27]
A callback to return a list of number
function(width, height) {
return [1 / 27, 3 / 27, 9 / 27];
}
Add perspectiveimage from JSON
var perspectiveimage = scene.make.rexShatterImage({
x: 0,
y: 0,
key: null,
frame: null,
// ringRadiusList: [1 / 27, 3 / 27, 9 / 27],
// ringRadiusList: function(width, height) {
//    return [1 / 27, 3 / 27, 9 / 27];
// },
// samplesPerRing: 12,
// variation: 0.25,
add: true
});
Custom class¶
Define class
class MyShatterImage( extends ShatterImage( {
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
var image = new MyShatterImage(scene, x, y, texture, frame, config);
Shatter image¶
image.shatter(centerX, centerY);
// image.shatter();
or
image.shatter(centerX, centerY, {
// ringRadiusList:
// samplesPerRing:
// variation
});
or
image.shatter({
// centerX:
// centerY:
// ringRadiusList:
// samplesPerRing:
// variation
});
centerX, centerY : Center position of shatter.
undefined : Default value is center of image.
Shatter image into triangle faces.
Position of Shatter center¶
var shatterCenter = image.shatterCenter; // {x, y}
Faces¶
var faces = image.faces;
Faces will be sorted nearby shatter-center to far away.
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