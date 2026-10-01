HSL adjust
Note
Phaser3.60 has a built-in Color Matrix effects.
Introduction¶
Adjust color in HSL domain, post processing filter.
Author: Rex
A filter shader effect
WebGL only
Only work in WebGL render mode.
Live demos¶
HSL adjust
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexhsladjustfilterplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexhsladjustfilterplugin.min.js', true);
Apply effect
Apply effect to game object
gameObject.enableFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.addRexHSLAdjust(config);
or
var controller = scene.plugins.get('rexhsladjustfilterplugin').add(gameObject, config);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.addRexHSLAdjust(config);
or
var controller = scene.plugins.get('rexhsladjustfilterplugin').add(camera, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import HSLAdjustFilterPlugin from 'phaser4-rex-plugins/plugins/hsladjustfilter-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexHSLAdjustFilter',
plugin: HSLAdjustFilterPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Apply effect
Apply effect to game object
gameObject.enableFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.addRexHSLAdjust(config);
or
var controller = scene.plugins.get('rexHSLAdjustFilter').add(gameObject, config);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.addRexHSLAdjust(config);
or
var controller = scene.plugins.get('rexHSLAdjustFilter').add(camera, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import filter and controller class
import { HSLAdjustFilter, HSLAdjustController } from 'phaser4-rex-plugins/plugins/hsladjustfilter.js';
Register effect
if (!scene.renderer.renderNodes.hasNode(HSLAdjustFilter.FilterName)) {
scene.renderer.renderNodes.addNodeConstructor(HSLAdjustFilter.FilterName, HSLAdjustFilter);
}
Apply effect
Apply effect to game object
gameObject.enableFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.add(
new HSLAdjustController(filterList.camera, config)
);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.add(
new HSLAdjustController(filterList.camera, config)
);
Apply effect¶
Apply effect to game object. A game object only can add 1 hsl-adjust effect.
gameObject.enableFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.addRexHslAdjust({
// hueRotate: 0,
// satAdjust: 1,
// lumAdjust: 0.5,
// name: 'rexHslAdjustPostFx'
});
hueRotate : Hue rotation
0 : Rotate 0 degrees, original color (Default value)
0.5 : Rotate 180 degrees
1 : Rotate 360 degrees
satAdjust : Saturation adjustment
0 : Gray
1 : Original color (Default value)
> 1 :
lumAdjust : Lumen adjustment
0 : Dark
0.5 : Original color (Default value)
1 : White
Apply effect to camera. A camera only can add 1 hsl-adjust effect.
var controller = scene.plugins.get('rexHslAdjustFilter').add(camera, config);
Disable effect¶
controller.setActive(false);
// controller.active = false;
Remove effect¶
Remove effect from game object
var filterList = gameObject.filters.internal;
filterList.remove(controller);
or
scene.plugins.get('rexHslAdjustFilter').remove(gameObject);
Remove effect from camera
var filterList = camera.filters.internal;
filterList.remove(controller);
or
scene.plugins.get('rexHslAdjustFilter').remove(camera);
Get effect¶
Get effect from game object
var controller = scene.plugins.get('rexHslAdjustFilter').get(gameObject)[0];
// var controllers = scene.plugins.get('rexHslAdjustFilter').get(gameObject);
Get effect from camera
var controller = scene.plugins.get('rexHslAdjustFilter').get(camera)[0];
// var controllers = scene.plugins.get('rexHslAdjustFilter').get(camera);
Hue rotation¶
Get
var hueRotate = controller.hueRotate;
Set
controller.hueRotate = hueRotate;
// controller.hueRotate += value;
or
controller.setHueRotate(value);
0 : Rotate 0 degrees, original color
0.5 : Rotate 180 degrees
1 : Rotate 360 degrees
Saturation adjustment¶
Get
var satAdjust = controller.satAdjust;
Set
controller.satAdjust = satAdjust;
// controller.satAdjust += value;
or
controller.setSatAdjust(value);
0 : Gray
1 : Original color
> 1 :
Lumen adjustment¶
Get
var lumAdjust = controller.lumAdjust;
Set
controller.lumAdjust = lumAdjust;
// controller.lumAdjust += value;
or
controller.setLumAdjust(value);
0 : Dark
0.5 : Original color
1 : White