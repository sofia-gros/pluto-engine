Render texture
Introduction¶
Skewable render texture.
Author: Rex
Game object
WebGL only
It only works in WebGL render mode.
Live demos¶
Usage¶
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexquadimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexquadimageplugin.min.js', true);
Add render texture object
var image = scene.add.rexSkewRenderTexture(x, y, width, height);
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
Add render texture object
var image = scene.add.rexSkewRenderTexturege(x, y, width, height);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { SkewRenderTexture } from 'phaser4-rex-plugins/plugins/quadimage.js';
Add render texture object
var image = new SkewRenderTexture(scene, x, y, width, height);
scene.add.existing(image);
Create instance¶
var image = scene.add.rexSkewRenderTexturege(x, y, width, height);
or
var image = scene.add.rexSkewRenderTexturege({
// x: 0,
// y: 0,
// width: 32,
// height: 32,
});
Add prespective render texture from JSON
var image = scene.make.rexSkewRenderTexturege({
x: 0,
y: 0,
width: 32,
height: 32,
add: true
});
Custom class¶
Define class
class MySkewRenderTexturege extends SkewRenderTexturege {
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
var image = new MySkewRenderTexturege(scene, x, y, width, height);
Internal render texture¶
var rt = image.rt;
rt : Render texture
Paste texture¶
Paste game object
image.rt.draw(gameObject, x, y).render();
// image.rt.draw(gameObject, x, y, alpha, tint).render();
gameObject : a game object, or an array of game objects
Paste game objects in a group
image.rt.draw(group, x, y).render();
// image.rt.draw(group, x, y, alpha, tint).render();
Paste game objects in a scene
image.rt.draw(scene.children, x, y).render();
// image.rt.draw(scene.children, x, y, alpha, tint).render();
Paste texture
image.rt.draw(key, x, y).render();
// image.rt.draw(key, x, y, alpha, tint).render();
or
image.rt.drawFrame(key, frame, x, y).render();
// image.rt.drawFrame(key, frame, x, y, alpha, tint).render();
key : The key of the texture to be used, as stored in the Texture Manager.
Erase¶
image.rt.erase(gameObject, x, y).render();
gameObject : a game object, or an array of game objects
Clear¶
image.rt.clear().render();
Fill¶
image.rt.fill(rgb, alpha).render();
// image.rt.fill(rgb, alpha, x, y, width, height).render();
Other properties¶
See Skew image game object, Mesh2D game object, game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters