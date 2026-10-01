Scale outer
Introduction¶
Scroll and zoom camera to make default game window fit the display area, in RESIZE scale mode.
Author: Rex
Member of scene
Live demos¶
Viewport
Static camera
Tween camera
Usage¶
Sample code
Install plugin¶
Set scale mode to RESIZE¶
var config = {
// ...
scale: {
parent: divId,
mode: Phaser.Scale.RESIZE,
width: 1024,    // Default game window width
height: 768,    // Default game window height
// ...
}
}
var game = new Phaser.Game(config);
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexscaleouterplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexscaleouterplugin.min.js', 'rexScaleOuter', 'rexScaleOuter');
Scale outer is created as a member of scene (scene.rexScaleOuter) for each scene.
It will control main camera (scene.cameras.main) by default.
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install scene plugin in configuration of game
import ScaleOuterPlugin from 'phaser4-rex-plugins/plugins/scaleouter-plugin.js';
var config = {
// ...
plugins: {
scene: [{
key: 'rexScaleOuter',
plugin: ScaleOuterPlugin,
mapping: 'rexScaleOuter'
}]
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Scale outer is created as a member of scene (scene.rexScaleOuter) for each scene.
It will control main camera (scene.cameras.main) by default.
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import ScaleOuter from 'phaser4-rex-plugins/plugins/scaleouter.js';
Add scaleouter object
var scaleouter = new ScaleOuter(scene);
Create instance¶
ScaleOuter plugin is a scene plugin, which created as a member of scene (scene.rexScaleOuter)
for each scene. It does not have to create other scale outer instance.
Remove instance¶
Invoke scene.rexScaleOuter.destroy() under scene.create() { ... }.
Add camera¶
Add camera manually, under scene.create() { ... }
scene.rexScaleOuter.add(camera);
Scale outer will control main camera (scene.cameras.main) if no camera added.
Viewport¶
Inner viewport, a recangle object, for area of default size in game config after camera zoom/scroll.
var innerViewport = scene.rexScaleOuter.innerViewport;
Outer viewport, a recangle object, for the visible area after camera zoom/scroll.
var outerViewport = scene.rexScaleOuter.outerViewport;
Manual scale¶
Stop resize callback
scene.rexScaleOuter.stop()
Manual scale
scene.rexScaleOuter.scale();