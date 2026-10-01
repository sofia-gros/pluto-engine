Transition image pack
Introduction¶
Transit texture to another one, with some pre-build effects, extended from TransitionImage
Author: Rex
Game object
Live demos¶
Effect list
Slide modes
Fade modes
Mask modes
Shader effect modes
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rextransitionimagepackplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextransitionimagepackplugin.min.js', true);
Add image object
var image = scene.add.rexTransitionImagePack(x, y, texture, frame, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import TransitionImagePackPlugin from 'phaser4-rex-plugins/templates/transitionimagepack/transitionimagepack-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexTransitionImagePackPlugin',
plugin: TransitionImagePackPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add image object
var image = scene.add.rexTransitionImagePack(x, y, texture, frame, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import TransitionImagePack from 'phaser4-rex-plugins/templates/transitionimagepack/TransitionImagePack.js';
Add image object
var image = new TransitionImagePack(scene, x, y, texture, frame, config);
scene.add.existing(image);
Create instance¶
var image = scene.add.rexTransitionImagePack(x, y, texture, frame, {
// duration: 1000,
// width: undefined, height: undefined,
});
or
var image = scene.add.rexTransitionImagePack(x, y, texture, frame, {
// x: 0,
// y: 0,
// key:
// frame:
// duration: 1000,
// width: undefined, height: undefined,
});
duration : Duration of transition.
width, height : Scale images to fit this size (widthxheight).
undefined : Don't scale images.
Add transitionimage from JSON
var image = scene.make.rexTransitionImagePack({
x: 0,
y: 0,
key: null,
frame: null,
// duration: 1000,
// width: undefined, height: undefined,
// origin: {x: 0.5, y: 0.5},
add: true
});
Custom class¶
Define class
class MyTransitionImagePack extends TransitionImagePack {
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
var transitionimage = new MyTransitionImagePack(scene, x, y, texture, frame, config);
Transit¶
image
// .setDuration(duration)
// .setEaseFunction(ease)
.transit(texture, frame, modeName)
or
image.transit({
key: undefined,
// frame: undefined,
// duration: 1000,
// ease: 'Linear',
mode: modeName
})
duration : Override default duration setting.
ease : Override default ease setting.
mode : Pre-build effects
Fade effects :
'fade' : Tint old image to black, then tint new image from black to origin color.
'crossFade' : Ease alpha of old image from 1 to 0, and ease alpha of new image from 0 to 1 at the same time.
Slide effects : 'slideLeft', 'slideRight', 'slideUp', 'slideDown',
'slideAwayLeft', 'slideAwayRight', 'slideAwayUp', 'slideAwayDown',
'pushLeft', 'pushRight', 'pushUp', 'pushDown'.
Zoom(scale) effects : 'zoomOut', 'zoomIn', 'zoomInOut'.
Mask effects : 'wipeLeft', 'wipeRight', 'wipeUp', 'wipeDown',
'irisOut', 'irisIn',  'irisInOut', 'pieOut', 'pieIn', 'pieInOut',
'blinds', 'squares', 'diamonds', 'circles', 'curtain'.
Shader effects : 'pixellate', 'dissolve',
'revealLeft', 'revealRight', 'revealUp', 'revealDown'
Current texture¶
var textureKey = image.texture.key;
var frameName = image.frame.name;
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
Flip
image.flipX(value);
image.flipY(value);
image.flip(x, y);
Toggle
image.toggleFlipX();
image.toggleFlipY();
Other properties¶
See transition image object, game object