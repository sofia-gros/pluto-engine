Skew
Introduction¶
Snapshot children of containerlite, to a skew render texture.
Author: Rex
Behavior of containerlite
Live demos¶
Skew ui
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexquadimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexquadimageplugin.min.js', true);
Add skew behavior
// var container = scene.add.rexContainerLite(x, y);
var skew = scene.plugins.get('rexquadimageplugin').addContainerSkew(container, config);
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
Add skew behavior
// var container = scene.add.rexContainerLite(x, y);
var skew = scene.plugins.get('rexQuadImagePlugin').addContainerSkew(container, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { ContainerSkew } from 'phaser4-rex-plugins/plugins/quadimage.js';
Add skew behavior
// var container = scene.add.rexContainerLite(x, y);
var skew = new ContainerSkew(container, config);
Create instance¶
var quad = scene.plugins.get('rexQuadImagePlugin').addContainerSkew(container, {
useParentBounds: false
});
useParentBounds :
true : Use bounds of parent container
false : Union all visible children's bounds
Skew mode¶
Enter¶
skew.enter();
Snapshot current visible children into skew render texture
Set current visible children to invisible
Set this skew render texture to visible
Exit¶
skew.exit();
Inverse visible of children and skew render texture
Is in skew mode¶
var isInSkewMode = skew.skewState;
Skew¶
Set
image.setSkewX(skewXRad);
image.setSkewXDeg(skewXDeg);
image.setSkewY(skewXRad);
image.setSkewYDeg(skewXDeg);
image.setSkew(skewXRad, skewYRad);
image.setSkewDeg(skewXDeg, skewYDeg);
image.skewX = skewXRad;
image.skewXDeg = skewXDeg;
image.skewY = skewYRad;
image.skewYDeg = skewYDeg;
Get
var skewXRad = image.skewX;
var skewXDeg = image.skewXDeg;
var skewYRad = image.skewY;
var skewYDeg = image.skewYDeg;
Other properties¶
See Skew rendertexture game object.