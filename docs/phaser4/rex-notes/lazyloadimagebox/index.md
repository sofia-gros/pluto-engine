Lazy load image box
Introduction¶
Lazy-load image with spinner, then show scaled image, based on image-box game object.
Author: Rex
Game object
Live demos¶
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexlazyloadimageboxplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexlazyloadimageboxplugin.min.js', true);
Add image object
var image = scene.add.rexLazyLoadLazyLoadimagebox(config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import LazyLoadimageboxPlugin from 'phaser4-rex-plugins/templates/lazyloadimagebox/lazyloadimagebox-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexLazyLoadimageboxPlugin',
plugin: LazyLoadimageboxPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add image object
var image = scene.add.rexLazyLoadimagebox(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import LazyLoadimagebox from 'phaser4-rex-plugins/templates/lazyloadimagebox/lazyloadimagebox.js';
Add image object
var image = new LazyLoadimagebox(scene, config);
scene.add.existing(image);
Create instance¶
var image = scene.add.rexLazyLoadimagebox({
// x: 0,
// y: 0,
// width: 0,
// height: 0,
// key: undefined,
// frame: undefined,
// url: undefined,
// scaleUp: false,
// width: undefined,
// height: undefined,
// background: undefined,
// image: undefined,
// spinner: {
//     animationMode: 'ios',
//     sizeRatio: 0.6
// }
});
width, height : Size of this image box.
key, frame : Display texture by image game object.
url : Load texture if it is not ready yet.
scaleUp : Scale up or keep original size of image when size of imageBox is larger.
true : Scale up image when size of imageBox is larger.
false : Keep original size of image size of imageBox is larger. Default behavior.
background : Game object of background, optional. This background game object will be resized to fit the size of imageBox.
A game object
A plain object with {color, alpha, strokeColor, strokeWidth, strokeAlpha}, to create a rectangle shape as a background game object.
image : Custom image game object instance.
undefined : Use built-in image game object. Default behavior.
spinner : Custom spinner game object.
undefined, or a plain object : Use aio-spinner by default.
spinner.animationMode : See animationMode parameter of aio-spinner, default is ios
spinner.sizeRatio : Set the spinner size as a multiple (ratio) of the image size.
Custom class¶
Define class
class MyLazyLoadimagebox extends LazyLoadimagebox {
constructor(scene, config) {
super(scene, config);
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
var image = new MyLazyLoadimagebox(scene, x, y, texture, frame, config);
Resize¶
image.resize(width, height);
Set texture¶
image.setTexture(key, frame, url);
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