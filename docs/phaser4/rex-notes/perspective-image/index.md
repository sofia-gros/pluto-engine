Image
Introduction¶
Image with perspective rotation.
Author: Rex
Game object
WebGL only
It only works in WebGL render mode.
Live demos¶
Flip image
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexperspectiveimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexperspectiveimageplugin.min.js', true);
Add image object
var image = scene.add.rexPerspectiveImage(x, y, texture, frame, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import PerspectiveImagePlugin from 'phaser4-rex-plugins/plugins/perspectiveimage-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexPerspectiveImagePlugin',
plugin: PerspectiveImagePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add image object
var image = scene.add.rexPerspectiveImage(x, y, texture, frame, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { PerspectiveImage } from 'phaser4-rex-plugins/plugins/perspectiveimage.js';
Add image object
var image = new PerspectiveImage(scene, x, y, texture, frame, config);
scene.add.existing(image);
Create instance¶
var image = scene.add.rexPerspectiveImage(x, y, texture, frame, {
// hideBackFace: true,
// gridWidth: 32,
// girdHeight: 32
});
or
var image = scene.add.rexPerspectiveImage({
// x: 0,
// y: 0,
key,
// frame: null,
// hideBackFace: true,
// gridWidth: 32,
// girdHeight: 32
});
Add perspectiveimage from JSON
var perspectiveimage = scene.make.rexPerspectiveImage({
x: 0,
y: 0,
key: null,
frame: null,
// hideBackFace: false,
// gridWidth: 32,
// girdHeight: 32,
add: true
});
Custom class¶
Define class
class MyPerspectiveImage extends PerspectiveImage {
constructor(scene, x, y, texture, frame, config) {
super(scene, x, y, texture, frame, config);
// ...
scene.add.existing(this);
}
// ...
preUpdate(time, delta) {
super.preUpdate(time, delta);
}
}
scene.add.existing(gameObject) : Adds an existing Game Object to this Scene.
If the Game Object renders, it will be added to the Display List.
If it has a preUpdate method, it will be added to the Update List.
Create instance
var image = new MyPerspectiveImage(scene, x, y, texture, frame, config);
Rotation¶
Get rotation angle
var angleX = image.angleX; // Angle in degrees
var angleY = image.angleY; // Angle in degrees
var angleZ = image.angleZ; // Angle in degrees
or
var rotationX = image.rotationX; // Angle in radians
var rotationY = image.rotationY; // Angle in radians
var rotationZ = image.rotationZ; // Angle in radians
Set rotation angle
image.angleX = angleX; // Angle in degrees
image.angleY = angleY; // Angle in degrees
image.angleZ = angleZ; // Angle in degrees
image.setAngleX(angleX);
image.setAngleY(angleY);
image.setAngleZ(angleZ);
image.setAngleXYZ(angleX, angleY, angleZ);
or
image.rotationX = rotationX; // Angle in radians
image.rotationY = rotationY; // Angle in radians
image.rotationZ = rotationZ; // Angle in radians
image.setRotationX(rotationX);
image.setRotationY(rotationY);
image.setRotationZ(rotationZ);
image.setRotationXYZ(rotationX, rotationY, rotationZ);
Flip¶
scene.tweens.add({
targets: image,
angleY: { start: 0, to: -180}
})
Tint color¶
Get
var color = image.tint;
Set
image.tint = color;
or
image.setTint(color);
Texture¶
image.setTexture(key);
// image.setTexture(key, frame);
Other properties¶
See Mesh2D game object, game object
Shader effects¶
Support internal and external filters