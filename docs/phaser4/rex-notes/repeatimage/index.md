Repeat image
Introduction¶
Stamp image repeatly on canvas, similar with TileSprite.
It has better rendering result when the texture size is not power of 2, in WebGL and pixelArt mode.
Author: Rex
Game object
Live demos¶
PixelArt, compared with TileSprite
Scroll
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexrepeatimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexrepeatimageplugin.min.js', true);
Add repeat-image object
var image = scene.add.rexRepeatImage(x, y, width, height, key, frame);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import RepeatImagePlugin from 'phaser4-rex-plugins/plugins/repeatimage-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexRepeatImagePlugin',
plugin: RepeatImagePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add repeat-image object
var image = scene.add.rexRepeatImage(x, y, width, height, key, frame);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import RepeatImage from 'phaser4-rex-plugins/plugins/repeatimage.js';
Add repeat-image object
var image = new RepeatImage(scene, x, y, key, frame, config);
scene.add.existing(image);
Install plugin¶
Install plugin in configuration of game
var config = {
// ...
plugins: {
global: [{
key: 'rexRepeatImagePlugin',
plugin: RepeatImagePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Create instance¶
var image = scene.add.rexRepeatImage(x, y, width, height, key, frame);
Add image from JSON
var image = scene.make.rexRepeatImage({
x: 0,
y: 0,
width: 512,
height: 512,
key: '',
add: true
});
Custom class¶
Define class
class MyImage extends RepeatImage {
constructor(scene, x, y, width, height, key, frame) {
super(scene, x, y, width, height, key, frame);
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
var image = new MyImage(scene, x, y, width, height, key, frame);
Set texture¶
image.setTexture(key, frame);
Properties of tiles¶
Position
image.setTilePosition(x, y);
or
image.tilePositionX = x;
image.tilePositionY = y;
Scale
image.setTileScale(scaleX, scaleY);
or
image.tileScaleX = scaleX;
image.tileScaleY = scaleY;
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters
Compare with TileSprite¶
Using this RepeatImage when the texture size is not power of 2, in WebGL and pixelArt mode.
Otherwise, using tileSprite