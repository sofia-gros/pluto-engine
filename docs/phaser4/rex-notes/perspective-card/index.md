Card
Introduction¶
A container with two perspective-images.
Author: Rex
Game object
WebGL only
It only works in WebGL render mode.
Live demos¶
Flip card
Label front face
Change texture
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexperspectiveimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexperspectiveimageplugin.min.js', true);
Add card object
var card = scene.add.rexPerspectiveCard(config);
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
Add card object
var card = scene.add.rexPerspectiveCard(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { PerspectiveCard } from 'phaser4-rex-plugins/plugins/perspectiveimage.js';
Add card object
var card = new PerspectiveCard(scene, config);
scene.add.existing(card);
Create instance¶
var card = scene.add.rexPerspectiveCard({
x: 0, y: 0,
back: {key, frame},
front: {key, frame},
face: 0,
orientation: 0,
// width,
// height,
// flip : {
//     frontToBack: 0,
//     backToFront: 1,
//     duration: 1000,
//     ease: 'Cubic',
//     delay: 0,
// }
// flip: false
});
front, back : Perspective image game object for front and back face.
{key, frame} : Texture key and frame name, to create perspective image
{width, height} : Width and height, to create perspective render texture.
Perspective image
Perspective render texture
face : Show front or back face.
'front', or 0 : Show front face.
'back', or 1 : Show back face.
orientation : Flipping orientation.
'horizontal','h', 'x', or 0 : Flipping left-to-right, or right-to-left.
'vertical','v', 'y', or 1 : Flipping top-to-bottom, or bottom-to-top.
width, height : Specific width and height of this card container.
undefined : Use width and height of front and back face.
flip : Configuration of flipping behavior.
flip.frontToBack, flip.backToFront : Flipping direction.
'right', 'left-to-right', or 0 : Flipping from right to left.
'left', 'right-to-left', or 1 : Flipping from left to right.
flip.duration : Duration of flipping, in millisecond.
flip.delay : Initial delay.
flip.ease : Ease function. Default value is 'Cubic'.
false : Don't add flipping behavior.
Add card from JSON
var card = scene.make.rexPerspectiveCard({
x: 0,
y: 0,
front,
back,
face: 0,
orientation: 0,
width,
height,
flip,
add: true
});
Custom class¶
Define class
class MyPerspectiveCard extends PerspectiveCard {
constructor(scene, config) {
super(scene, config);
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
var card = new MyPerspectiveCard(scene, config);
Face¶
Get
var face = card.face;
face:
0 : Show front face.
1 : Show back face.
Set
card.setFace(face)
face
'front', or 0 : Show front face.
'back', or 1 : Show back face.
Toggle
card.toggleFace()
Face instances¶
Front face
var frontFace = card.frontFace;
// var frontFace = card.faces.front;
Back face
var backFace = card.backFace;
// var backFace = card.faces.back;
Face texture¶
Set texture of front face, assume that front face is a perspective image
card.frontFace.setTexture(key);
// card.frontFace.setTexture(key, frame);
Set texture of back face, assume that back face is a perspective image
card.backFace.setTexture(key);
// card.backFace.setTexture(key, frame);
Flip behavior¶
Start flipping¶
card.flip.flip();
// card.flip.flip(duration, repeat);
duration : Overwrite default duration value.
repeat : Number of flipping time (repeat + 1) during duration. Default value is 0.
or
Flip-right
card.flip.flipRight();
// card.flip.flipRight(duration, repeat);
Flip-left
card.flip.flipLeft();
// card.flip.flipLeft(duration, repeat);
Stop flipping¶
card.flip.stop();
Set duration¶
card.flip.setDuration(duration);
// card.flip.duration = duration;
Set ease¶
card.flip.setEase(ease);
// card.flip.ease = ease;
Events¶
On flipping start
card.flip.on('start', function(flip, card){
// ...
});
On flipping complete
card.flip.on('complete', function(flip, card){
// ...
});
Status¶
Is flipping
var isRunning = card.flip.isRunning;
Rotation¶
Get rotation angle
var angleX = card.angleX; // Angle in degrees
var angleY = card.angleY; // Angle in degrees
var angleZ = card.angleZ; // Angle in degrees
or
var rotationX = card.rotationX; // Angle in radians
var rotationY = card.rotationY; // Angle in radians
var rotationZ = card.rotationZ; // Angle in radians
Set rotation angle
card.angleX = angleX; // Angle in degrees
card.angleY = angleY; // Angle in degrees
card.angleZ = angleZ; // Angle in degrees
image.setAngleX(angleX);
image.setAngleY(angleY);
image.setAngleZ(angleZ);
image.setAngleXYZ(angleX, angleY, angleZ);
or
card.rotationX = rotationX; // Angle in radians
card.rotationY = rotationY; // Angle in radians
card.rotationZ = rotationZ; // Angle in radians
image.setRotationX(rotationX);
image.setRotationY(rotationY);
image.setRotationZ(rotationZ);
image.setRotationXYZ(rotationX, rotationY, rotationZ);
Debug¶
Set debug Graphics
var debugGraphics = scene.add.graphics();
card.setDebug(debugGraphics);
Update Graphics in scene.update() method.
debugGraphics.clear();
debugGraphics.lineStyle(1, 0x00ff00);
Other properties¶
See container, Mesh2D game object, game object
Shader effects¶
Support internal and external filters