Render texture
Introduction¶
Render texture with perspective rotation.
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
scene.load.plugin('rexperspectiveimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexperspectiveimageplugin.min.js', true);
Add render texture object
var image = scene.add.rexPerspectiveRenderTexture(x, y, width, height, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import PerspectiveImagePlugin from 'phaser4-rex-plugins/plugins/perspectiveimage-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexPerspectiveImagePlugin',
plugin: PerspectiveImagePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add render texture object
var image = scene.add.rexPerspectiveRenderTexturege(x, y, width, height, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { PerspectiveRenderTexture } from 'phaser4-rex-plugins/plugins/perspectiveimage.js';
Add render texture object
var image = new PerspectiveRenderTexture(scene, x, y, width, height, config);
scene.add.existing(image);
Create instance¶
var image = scene.add.rexPerspectiveRenderTexturege(x, y, width, height, {
// hideBackFace: true,
// gridWidth: 32,
// girdHeight: 32
});
or
var image = scene.add.rexPerspectiveRenderTexturege({
// x: 0,
// y: 0,
// width: 32,
// height: 32,
// hideBackFace: true,
// gridWidth: 32,
// girdHeight: 32
});
Add prespective render texture from JSON
var image = scene.make.rexPerspectiveRenderTexturege({
x: 0,
y: 0,
width: 32,
height: 32,
// hideBackFace: false,
// gridWidth: 32,
// girdHeight: 32,
add: true
});
Custom class¶
Define class
class MyPerspectiveRenderTexturege extends PerspectiveRenderTexturege {
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
var image = new MyPerspectiveRenderTexturege(scene, x, y, width, height, config);
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
Snapshop game objects
image.snapshot(gameObjects);
gameObjects : Array of game objects.
Erase¶
image.rt.erase(gameObject, x, y).render();
gameObject : a game object, or an array of game objects
Clear¶
image.rt.clear();
Fill¶
image.rt.fill(rgb, alpha).render();
// image.rt.fill(rgb, alpha, x, y, width, height).render();
Other properties¶
See Perspective image game object, Mesh2D game object, game object
Shader effects¶
Support internal and external filters