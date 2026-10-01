Image box
Introduction¶
Keep aspect ratio of image game object when scale-down resizing.
A containerLite game object  with 1 image game object.
Author: Rex
Game object
Live demos¶
Resize
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('reximageboxplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/reximageboxplugin.min.js', true);
Add image object
var image = scene.add.rexImageBox(x, y, texture, frame, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import ImageBoxPlugin from 'phaser4-rex-plugins/plugins/imagebox-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexImageBoxPlugin',
plugin: ImageBoxPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add image object
var image = scene.add.rexImageBox(x, y, texture, frame, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import ImageBox from 'phaser4-rex-plugins/plugins/imagebox.js';
Add image object
var image = new ImageBox(scene, x, y, texture, frame, config);
scene.add.existing(image);
Create instance¶
var image = scene.add.rexImageBox(x, y, texture, frame, {
// scaleUp: false,
// width: undefined,
// height: undefined,
// background: undefined,
// image: undefined
});
or
var image = scene.add.rexImageBox({
// x: 0,
// y: 0,
// key: undefined,
// frame: undefined,
// scaleUp: false,
// width: undefined,
// height: undefined,
// background: undefined,
// image: undefined
});
width, height : Size of this image box
key, frame : Display texture by image game object.
scaleUp : Scale up or keep original size of image when size of imageBox is larger.
true : Scale up image when size of imageBox is larger.
false : Keep original size of image size of imageBox is larger. Default behavior.
background : Game object of background, optional. This background game object will be resized to fit the size of imageBox.
A game object
A plain object with {color, alpha, strokeColor, strokeWidth, strokeAlpha}, to create a rectangle shape as a background game object.
image : Custom image game object instance.
undefined : Use built-in image game object. Default behavior.
Add imagebox from JSON
var image = scene.make.rexImageBox({
x: 0,
y: 0,
key: null,
frame: null,
// scaleUp: false,
// width: undefined,
// height: undefined,
// background: undefined,
// image: undefined
// origin: {x: 0.5, y: 0.5},
add: true
});
Custom class¶
Define class
class MyImageBox extends ImageBox {
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
var image = new MyImageBox(scene, x, y, texture, frame, config);
Resize¶
image.resize(width, height);
Set texture¶
image.setTexture(key, frame);
Current texture¶
var textureKey = image.texture.key;
var frameName = image.frame.name;
Clear texture¶
image.setTexture();
Will set internal image game object to invisible.
Scale image¶
image.scaleImage();
image.resize(width, height), or image.setTexture(key, frame) will invoke this method internally.
Internal image game object¶
var internalImageGO = image.image;
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters