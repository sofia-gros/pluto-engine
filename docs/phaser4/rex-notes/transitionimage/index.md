Transition image
Introduction¶
Transit texture to another one. A containerLite game object with 2 image game objects.
Author: Rex
Game object
Live demos¶
Ease property of current/next image
Cross-fade
Scale
Slide
Apply shader effect to current/next image, then ease property this shader effect.
Split
Dissolve
Grid cut current/next image to cell images, then ease property of cell images
Grid cut
3 columns
Morph custom mask game object
Pie mask
Transition modes
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rextransitionimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextransitionimageplugin.min.js', true);
Add image object
var image = scene.add.rexTransitionImage(x, y, texture, frame, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import TransitionImagePlugin from 'phaser4-rex-plugins/plugins/transitionimage-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexTransitionImagePlugin',
plugin: TransitionImagePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add image object
var image = scene.add.rexTransitionImage(x, y, texture, frame, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import TransitionImage from 'phaser4-rex-plugins/plugins/transitionimage.js';
Add image object
var image = new TransitionImage(scene, x, y, texture, frame, config);
scene.add.existing(image);
Create instance¶
var image = scene.add.rexTransitionImage(x, y, texture, frame, {
// dir: 0,
// onStart: function(parent, currentImage, nextImage, t) { },
// onStartScope: undefined,
// onProgress: function(parent, currentImage, nextImage, t) { },
// onProgressScope: undefined,
// onComplete: function(parent, currentImage, nextImage, t) { },
// onCompleteScope: undefined,
// duration: 1000,
// ease: 'Linear',
// mask: undefined,
// width: undefined, height: undefined,
});
or
var image = scene.add.rexTransitionImage(x, y, texture, frame, {
// x: 0,
// y: 0,
// key:
// frame:
// dir: 0,
// onStart: function(parent, currentImage, nextImage, t) { },
// onStartScope: undefined,
// onProgress: function(parent, currentImage, nextImage, t) { },
// onProgressScope: undefined,
// onComplete: function(parent, currentImage, nextImage, t) { },
// onCompleteScope: undefined,
// duration: 1000,
// ease: 'Linear',
// mask: undefined,
// width: undefined, height: undefined,
});
dir : Transition direction.
0, or 'out' : Transit current texture/image out.
1, or 'in' : Transit next texture/image in.
onStart, onStartScope : Callback and scope of transition-start. See Set transition callbacks
onProgress, onProgressScope : Callback and scope of transition-progress. See Set transition callbacks
onComplete, onCompleteScope : Callback and scope of transition-complete. See Set transition callbacks
duration : Duration of transition.
ease : Ease function of transition-progress.
mask : Mask game object.
true : Default graphics game object.
Any shape game object, or custom shape, custom progress game object.
width, height : Scale images to fit this size (widthxheight).
undefined : Don't scale images.
If onStart, onProgress and onComplete are all undefined, it will use cross-fade as default transition callbacks.
Add transitionimage from JSON
var image = scene.make.rexTransitionImage({
x: 0,
y: 0,
key: null,
frame: null,
// dir: 0,
// onStart: function(parent, currentImage, nextImage, t) { },
// onStartScope: undefined,
// onProgress: function(parent, currentImage, nextImage, t) { },
// onProgressScope: undefined,
// onComplete: function(parent, currentImage, nextImage, t) { },
// onCompleteScope: undefined,
// duration: 1000,
// ease: 'Linear',
// mask: undefined,
// width: undefined, height: undefined,
// origin: {x: 0.5, y: 0.5},
add: true
});
Custom class¶
Define class
class MyTransitionImage extends TransitionImage {
constructor(scene, x, y, texture, frame, config) {
super(scene, x, y, texture, frame, config);
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
var transitionimage = new MyTransitionImage(scene, x, y, texture, frame, config);
Transit¶
image
// .setTransitionDirection(dir)
// .setTransitionStartCallback(onStart, onStartScope)
// .setTransitionProgressCallback(onProgress, onProgressScope)
// .setTransitionCompleteCallback(onComplete, onCompleteScope)
// .setDuration(duration)
// .setEaseFunction(ease)
// .setMaskEnable(enable)
.transit(texture, frame)
or
image.transit({
key: undefined,
// frame: undefined,
// dir: 0,
// onStart: function(parent, currentImage, nextImage, t) { },
// onStartScope: undefined,
// onProgress: function(parent, currentImage, nextImage, t) { },
// onProgressScope: undefined,
// onComplete: function(parent, currentImage, nextImage, t) { },
// onCompleteScope: undefined,
// duration: 1000,
// ease: 'Linear',
// mask: undefined,
})
mask : Mask game object.
true : Default graphics game object. Also apply this mask to current and next textures/images
Any shape game object, or custom shape, custom progress game object.
Apply mask to current texture :
image.setCurrentImageMaskEnable();
// image.setCurrentImageMaskEnable(enable, invertAlpha);
Apply mask to next texture :
image.setNextImageMaskEnable();
// image.setNextImageMaskEnable(enable, invertAlpha);
Apply mask to both current and next trextures :
image.setMaskEnable();
// image.setMaskEnable(enable, invertAlpha);
Fire 'complete' event when transition completed.
Register transtion mode¶
Register transtion mode
image.addTransitionMode(modeName, {
// dir: 0,
// onStart: function(parent, currentImage, nextImage, t) { },
// onStartScope: undefined,
// onProgress: function(parent, currentImage, nextImage, t) { },
// onProgressScope: undefined,
// onComplete: function(parent, currentImage, nextImage, t) { },
// onCompleteScope: undefined,
// duration: 1000,
// ease: 'Linear',
// mask: undefined,
});
Trnasit by transition mode
image.transit(texture, frame, modeName);
// image.transit(texture, frame, modeNames);
or
image.transit({
key: undefined,
// frame: undefined,
mode: modeName, // or modeName
// dir: 0,
// onStart: function(parent, currentImage, nextImage, t) { },
// onStartScope: undefined,
// onProgress: function(parent, currentImage, nextImage, t) { },
// onProgressScope: undefined,
// onComplete: function(parent, currentImage, nextImage, t) { },
// onCompleteScope: undefined,
// duration: 1000,
// ease: 'Linear',
// mask: undefined,
})
Can override configuration of transition mode
modeName : A string, or an array of string to pick a random mode.
Current transition mode
var modeName = image.currentTransitionMode;
Current texture¶
var textureKey = image.texture.key;
var frameName = image.frame.name;
Transition callbacks¶
Set transition direction
image.setTransitionDirection(dir);
0, or 'out' : Transit current texture out.
1, or 'in' : Transit next texture in.
Set transition-start callback
image.setTransitionStartCallback(onStart, onStartScope)
onStart
function(parent, currentImage, nextImage, t) { }
parent : Transition image game object, extends from ContainerLite
currentImage : Image game object to display current texture.
nextImage : Image game object to display next texture.
t : Progress percentage. It is 0 in this case.
Set transition-progress callback
image.setTransitionProgressCallback(onProgress, onProgressScope)
onProgress
function(parent, currentImage, nextImage, t) {
// parent.setChildLocalAlpha(currentImage, 1 - t);
// parent.setChildLocalScale(currentImage, 1 - t);
// parent.setChildLocalPosition(currentImage, x, 0);
}
parent : Transition image game object, extends from ContainerLite
currentImage : Image game object to display current texture.
Set alpha of currentImage, or nextImage by parent.setChildLocalAlpha(currentImage, alpha).
Set scale of currentImage, or nextImage by parent.setChildLocalScale(currentImage, scale).
Set position of currentImage, or nextImage by parent.setChildLocalScale(currentImage, x, y).
nextImage : Image game object to display next texture.
t : Progress percentage. 0~1.
Set transition-complete callback
image.setTransitionCompleteCallback(onComplete, onCompleteScope)
onComplete
function(parent, currentImage, nextImage, t) { }
parent : Transition image game object, extends from ContainerLite
currentImage : Image game object to display current texture.
nextImage : Image game object to display next texture.
t : Progress percentage. It is 1 in this case.
Transition duration¶
Set
image.setDuration(duration);
Get
var duration = image.duration;
Ease function¶
Set
image.setEaseFunction(ease);
ease : Ease function of transition-progress.
Get
var ease = image.easeFunction;
Mask¶
Apply mask to current texture :
image.setCurrentImageMaskEnable();
// image.setCurrentImageMaskEnable(enable, invertAlpha);
Apply mask to next texture :
image.setNextImageMaskEnable();
// image.setNextImageMaskEnable(enable, invertAlpha);
Apply mask to both current and next trextures :
image.setMaskEnable();
// image.setMaskEnable(enable, invertAlpha);
Assign default mask game object
image.setMaskGameObject(true);
Assign custom mask game object
image.setMaskGameObject(maskGameObject);
maskGameObject : A graphics game object, or any shape game objects, custom-progress shape game object
Grid cut¶
Grid cut texture to cells.
Grid cut current texture :
var cellImageGameObjects = image.gridCutCurrentImage(columns, rows);
cellImageGameObjects : Array of cell game objects.
Grid cut next texture :
var cellImageGameObjects = image.gridCutNextImage(columns, rows);
cellImageGameObjects : Array of cell game objects.
Get cut cell image game objects, after cutting.
var cellImageGameObjects = image.getCellImages();
Apply mask to cell images
image.setCellImagesMaskEnable();
// image.setCellImagesMaskEnable(enable, invertAlpha);
Cut cell image game objects will be set to invisible after transition complete.
Pause/Resume¶
image.pause();
image.resume();
Stop¶
image.stop();
Also will fire 'complete' event.
Events¶
On complete
image.on('complete', function(){
})
Flip¶
Apply flipX, flipY to both current and next trextures.
Flip
image.flipX(value);
image.flipY(value);
image.flip(x, y);
Toggle
image.toggleFlipX();
image.toggleFlipY();
Tint¶
Apply tint to both current and next trextures.
image.setTint(value);
Use cases¶
Ease property of current/next image.
Scale
Slide, apply mask to current/next image.
Apply shader effect to current/next image, then ease property this shader effect.
Dissolve
Split
Grid cut current/next image to cell images, then ease property of cell images
Grid cut
Three-columns, apply mask to cell images.
Morph custom mask game object
Pie-mask, mask current/next image by a custom-progress game object.
Internal image game object¶
Current, next image game object
var curentImageGO = image.currentImage;
var nextImageGO = image.nextImage;
Front, back image game object
var frontImageGO = image.frontImage;
var backImageGO = image.backImage;
Other properties¶
See game object
Shader effects¶
Internal image game objects (image.currentImage, image.nextImage) support internal and external filters