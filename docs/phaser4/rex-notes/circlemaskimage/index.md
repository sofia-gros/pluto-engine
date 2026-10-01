Circle mask image
Introduction¶
Load a texture, then apply a circle mask. Extended from canvas plugin.
Author: Rex
Game object
Live demos¶
Circle-mask-image
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexcirclemaskimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcirclemaskimageplugin.min.js', true);
Add circle-mask-image object
var image = scene.add.rexCircleMaskImage(x, y, key, frame, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import CircleMaskImagePlugin from 'phaser4-rex-plugins/plugins/circlemaskimage-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexCircleMaskImagePlugin',
plugin: CircleMaskImagePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add circle-mask-image object
var image = scene.add.rexCircleMaskImage(x, y, key, frame, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import CircleMaskImage from 'phaser4-rex-plugins/plugins/circlemaskimage.js';
Add circle-mask-image object
var image = new CircleMaskImage(scene, x, y, key, frame, config);
scene.add.existing(image);
Install plugin¶
Install plugin in configuration of game
var config = {
// ...
plugins: {
global: [{
key: 'rexCircleMaskImagePlugin',
plugin: CircleMaskImagePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Create instance¶
var image = scene.add.rexCircleMaskImage(x, y, key, frame, {
maskType: 0,
// radius: undefined,
// backgroundColor: undefined,
// strokeColor: undefined,
// strokeWidth: 0,
});
or
var image = scene.add.rexCircleMaskImage(x, y, key, {
maskType: 0,
// radius: undefined,
// backgroundColor: undefined,
// strokeColor: undefined,
// strokeWidth: 0,
});
maskType : Type of mask.
null : No mask.
'circle', or 0 : Circle mask.
'ellipse', or 1 : Ellipse mask.
'roundRectangle', or 2 : Round rectangle mask.
radius : Radius of round rectangle mask.
0 : Disable round corner.
Number: 4 corners with the same radius.
JSON
4 corners with the same radius X/Y
{
x: radiusX,
y: radiusY
}
Eeach radius of corner
{
tl: radius,
tr: radius,
bl: radius,
br: radius
}
or
{
tl: {x : radiusX, y: radiusY},
tr: {x : radiusX, y: radiusY},
bl: {x : radiusX, y: radiusY},
br: {x : radiusX, y: radiusY},
}
backgroundColor : Fill background with color.
undefined, or null : No background filling. Default behavior.
strokeColor : Add stroke around masked image.
undefined, or null : No stroke line. Default behavior.
strokeWidth : Stroke line width.
Add image from JSON
var image = scene.make.rexCircleMaskImage({
x: 0,
y: 0,
key: key,
frame: name,
maskType: 0,
// radius: undefined
// origin: {x: 0.5, y: 0.5},
// backgroundColor: undefined,
// strokeColor: undefined,
// strokeWidth: 0,
add: true
});
Custom class¶
Define class
class MyImage extends CircleMaskImage {
constructor(scene, x, y, key, frame, config) {
super(scene, x, y, key, frame, config);
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
var image = new MyImage(scene, key, frame, config);
Set texture¶
image.setTexture(key, frame);
// image.setTexture(key, frame, maskType);
or
image.setTexture(key, frame, {
maskType: 0,
// radius: undefined
});
maskType : Type of mask
null : No mask.
0, or 'circle' : Circle mask. Default value.
1, or 'ellipse' : Ellipse mask.
radius : Radius of round rectangle mask.
0 : Disable round corner.
Number: 4 corners with the same radius.
JSON
4 corners with the same radius X/Y
{
x: radiusX,
y: radiusY
}
Eeach radius of corner
{
tl: radius,
tr: radius,
bl: radius,
br: radius
}
or
{
tl: {x : radiusX, y: radiusY},
tr: {x : radiusX, y: radiusY},
bl: {x : radiusX, y: radiusY},
br: {x : radiusX, y: radiusY},
}
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters