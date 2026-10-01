Render texture
Introduction¶
Shatter render texture to triangle faces.
Author: Rex
Game object
WebGL only
It only works in WebGL render mode.
Live demos¶
RenderTexture
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexshatterimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexshatterimageplugin.min.js', true);
Add render texture object
var image = scene.add.rexShatterRenderTexture(x, y, width, height, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import ShatterImagePlugin from 'phaser4-rex-plugins/plugins/shatterimage-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexShatterImagePlugin',
plugin: ShatterImagePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add render texture object
var image = scene.add.rexShatterRenderTexturege(x, y, width, height, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { ShatterRenderTexture } from 'phaser4-rex-plugins/plugins/shatterimage.js';
Add render texture object
var image = new ShatterRenderTexture(scene, x, y, width, height, config);
scene.add.existing(image);
Create instance¶
var image = scene.add.rexShatterRenderTexturege(x, y, width, height, {
// gridWidth: 32,
// girdHeight: 32
});
or
var image = scene.add.rexShatterRenderTexturege({
// x: 0,
// y: 0,
// width: 32,
// height: 32,
// gridWidth: 32,
// girdHeight: 32
});
Add prespective render texture from JSON
var image = scene.make.rexShatterRenderTexturege({
x: 0,
y: 0,
width: 32,
height: 32,
// gridWidth: 32,
// girdHeight: 32,
add: true
});
Custom class¶
Define class
class MyShatterRenderTexturege extends ShatterRenderTexturege {
constructor(scene, x, y, width, height, config) {
super(scene, x, y, width, height, config);
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
var image = new MyShatterRenderTexturege(scene, x, y, width, height, config);
Internal render texture¶
var rt = image.rt;
rt : Render texture
Paste texture¶
Paste game object
image.rt.draw(gameObject, x, y);
// image.rt.draw(gameObject, x, y, alpha, tint);
gameObject : a game object, or an array of game objects
Paste game objects in a group
image.rt.draw(group, x, y);
// image.rt.draw(group, x, y, alpha, tint);
Paste game objects in a scene
image.rt.draw(scene.children, x, y);
// image.rt.draw(scene.children, x, y, alpha, tint);
Paste texture
image.rt.draw(key, x, y);
// image.rt.draw(key, x, y, alpha, tint);
or
image.rt.drawFrame(key, frame, x, y);
// image.rt.drawFrame(key, frame, x, y, alpha, tint);
key : The key of the texture to be used, as stored in the Texture Manager.
Erase¶
image.rt.erase(gameObject, x, y);
gameObject : a game object, or an array of game objects
Clear¶
image.rt.clear();
Fill¶
image.rt.fill(rgb, alpha);
// image.rt.fill(rgb, alpha, x, y, width, height);
Other properties¶
See Shatter image game object, Mesh game object, game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters