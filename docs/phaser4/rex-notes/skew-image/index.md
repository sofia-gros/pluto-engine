Image
Introduction¶
Skewable Image.
Author: Rex
Game object
WebGL only
It only works in WebGL render mode.
Live demos¶
Skew image
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexquadimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexquadimageplugin.min.js', true);
Add image object
var image = scene.add.rexSkewImage(x, y, texture, frame);
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
var image = scene.add.rexSkewImage(x, y, texture, frame);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { SkewImage } from 'phaser4-rex-plugins/plugins/quadimage.js';
Add image object
var image = new SkewImage(scene, x, y, texture, frame);
scene.add.existing(image);
Create instance¶
var image = scene.add.rexSkewImage(x, y, texture, frame);
or
var image = scene.add.rexSkewImage({
// x: 0,
// y: 0,
key,
// frame: null,
});
Add quadimage from JSON
var quadimage = scene.make.rexSkewImage({
x: 0,
y: 0,
key: null,
frame: null,
add: true
});
Custom class¶
Define class
class MySkewImage extends SkewImage {
constructor(scene, x, y, texture, frame) {
super(scene, x, y, texture, frame);
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
var image = new MySkewImage(scene, x, y, texture, frame);
Skew¶
Set
image.setSkewX(skewXRad);
image.setSkewXDeg(skewXDeg);
image.setSkewY(skewXRad);
image.setSkewYDeg(skewXDeg);
image.setSkew(skewXRad, skewYRad);
image.setSkewDeg(skewXDeg, skewYDeg);
image.skewX = skewXRad;
image.skewXDeg = skewXDeg;
image.skewY = skewYRad;
image.skewYDeg = skewYDeg;
Get
var skewXRad = image.skewX;
var skewXDeg = image.skewXDeg;
var skewYRad = image.skewY;
var skewYDeg = image.skewYDeg;
Other properties¶
See Mesh2D game object, game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters