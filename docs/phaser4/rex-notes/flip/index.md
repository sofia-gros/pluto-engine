Flip
Introduction¶
Flipping game object to another face by scaling width/height.
Author: Rex
Behavior of game object
Live demos¶
Flip image
Flip ui
Usage¶
Sample code, Sample code-2
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexflipplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexflipplugin.min.js', true);
Add flip behavior
var flip = scene.plugins.get('rexflipplugin').add(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import FlipPlugin from 'phaser4-rex-plugins/plugins/flip-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexFlip',
plugin: FlipPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add flip behavior
var flip = scene.plugins.get('rexFlip').add(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import Flip from 'phaser4-rex-plugins/plugins/flip.js';
Add flip behavior
var flip = new Flip(gameObject, config);
Create instance¶
var flip = scene.plugins.get('rexFlip').add(gameObject, {
face: 'back',
front: { key, frame }, // key, or callback
back: { key, frame },  // key, or callback
// orientation: 0, // 0|'x'|1|'y'
// duration: 500,
// delay: 0,
// ease: 'Sine',
});
face : Initial face.
0, 'front' : Front face.
1, 'back' : Back face.
front, back : Texture of front/back face.
undefined : Use current texture key, or frame name
key : A string for texture key.
{key, frame}, or {frame} : A texture key and frame name
callback : Configure game object via callback.
function(gameObject) {
}
orientation : Flipping orientation.
0, 'x', or 'horizontal' : Horizontal flipping.
1, 'y', or 'vertical' : Vertical flipping.
duration : Duration of flipping, in millisecond.
delay : Initial delay
ease Ease function. Default value is 'Sine'.
Start flipping¶
flip.flip();
// flip.flip(duration);
Stop flipping¶
flip.stop();
Set duration¶
flip.setDuration(duration);
// flip.duration = duration;
Set ease¶
flip.setEase(ease);
// flip.ease = ease;
Faces¶
Current face¶
Get
var face = flip.face;
0 : Front face
1 : Back face
Set
flip.setFace(face);
// flip.face = face;
0, 'front' : Front face.
1, 'back' : Back face.
Toggle face
flip.toggleFace();
Set texture of face¶
Front face
flip.setFrontFace(key, frame);
or
flip.setFrontFace(callback);
callback :
function(gameObject) {
// ...
}
Back face
flip.setBackFace(key, frame);
or
flip.setBackFace(callback);
callback :
function(gameObject) {
// ...
}
Events¶
On flipping complete
flip.on('complete', function(gameObject, flip){
// ...
});
Status¶
Is flipping
var isRunning = flip.isRunning;