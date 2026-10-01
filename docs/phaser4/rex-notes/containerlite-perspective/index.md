Perspective
Introduction¶
Snapshot children of containerlite, to a perspective render texture.
Author: Rex
Behavior of containerlite
Live demos¶
Flip ui
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexperspectiveimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexperspectiveimageplugin.min.js', true);
Add perspective behavior
// var container = scene.add.rexContainerLite(x, y);
var perspective = scene.plugins.get('rexperspectiveimageplugin').addContainerPerspective(container, config);
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
Add perspective behavior
// var container = scene.add.rexContainerLite(x, y);
var perspective = scene.plugins.get('rexPerspectiveImagePlugin').addContainerPerspective(container, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { ContainerPerspective } from 'phaser4-rex-plugins/plugins/perspectiveimage.js';
Add perspective behavior
// var container = scene.add.rexContainerLite(x, y);
var perspective = new ContainerPerspective(container, config);
Create instance¶
var perspective = scene.plugins.get('rexPerspectiveImagePlugin').addContainerPerspective(container, {
useParentBounds: false,
// hideBackFace: true,
});
useParentBounds :
true : Use bounds of parent container
false : Union all visible children's bounds
hideBackFace :
true : Hide backward facing Faces. Default behavior.
false : Show backward facing Faces
Perspective mode¶
Enter¶
perspective.enter();
Snapshot current visible children into perspective render texture
Set current visible children to invisible
Set this perspective render texture to visible
Exit¶
perspective.exit();
Inverse visible of children and perspective render texture
Is in perspective mode¶
var isInPerspectiveMode = perspective.perspectiveState;
Rotation¶
Get rotation angle
var angleX = perspective.angleX; // Angle in degrees
var angleY = perspective.angleY; // Angle in degrees
var angleZ = perspective.angleZ; // Angle in degrees
or
var rotationX = perspective.rotationX; // Angle in radians
var rotationY = perspective.rotationY; // Angle in radians
var rotationZ = perspective.rotationZ; // Angle in radians
Set rotation angle
perspective.angleX = angleX; // Angle in degrees
perspective.angleY = angleY; // Angle in degrees
perspective.angleZ = angleZ; // Angle in degrees
or
perspective.rotationX = rotationX; // Angle in radians
perspective.rotationY = rotationY; // Angle in radians
perspective.rotationZ = rotationZ; // Angle in radians
Flip¶
scene.tweens.add({
targets: perspective,
angleY: { start: 0, to: -180}
})
Other properties¶
See Perspective rendertexture game object.