Toonify
Introduction¶
Draw outlines and quantize color in HSV domain. Reference
Author: Rex
A filter shader effect
WebGL only
Only work in WebGL render mode.
Live demos¶
Toonify
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rextoonifyfilterplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextoonifyfilterplugin.min.js', true);
Apply effect
Apply effect to game object
gameObject.enableFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.addRexToonify(config);
or
var controller = scene.plugins.get('rextoonifyfilterplugin').add(gameObject, config);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.addRexToonify(config);
or
var controller = scene.plugins.get('rextoonifyfilterplugin').add(camera, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import ToonifyFilterPlugin from 'phaser4-rex-plugins/plugins/toonifyfilter-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexToonifyFilter',
plugin: ToonifyFilterPlugin,
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
var controller = filterList.addRexToonify(config);
or
var controller = scene.plugins.get('rexToonifyFilter').add(gameObject, config);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.addRexToonify(config);
or
var controller = scene.plugins.get('rexToonifyFilter').add(camera, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import filter and controller class
import { ToonifyFilter, ToonifyController } from 'phaser4-rex-plugins/plugins/toonifyfilter.js';
Register effect
if (!scene.renderer.renderNodes.hasNode(ToonifyFilter.FilterName)) {
scene.renderer.renderNodes.addNodeConstructor(ToonifyFilter.FilterName, ToonifyFilter);
}
Apply effect
Apply effect to game object
gameObject.enableFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.add(
new ToonifyController(filterList.camera, config)
);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.add(
new ToonifyController(filterList.camera, config)
);
Apply effect¶
Apply effect to game object.
gameObject.enableFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.addRexToonify({
// edgeThreshold: 0.2,
// hueLevels: 0,
// sLevels: 0,
// vLevels: 0,
// edgeColor: 0,
// name: 'rexToonifyPostFx'
});
edgeThreshold : Threshold of edge. Set 1.1 (or any number larger then 1) to disable this feature.
hueLevels : Amount of hue levels. Set 0 to disable this feature.
sLevels : Amount of saturation levels. Set 0 to disable this feature.
vLevels : Amount of value levels. Set 0 to disable this feature.
edgeColor : Color of edge, could be a number 0xRRGGBB, or a JSON object {r:255, g:255, b:255}
Apply effect to camera.
var controller = scene.plugins.get('rexToonifyFilter').add(camera, config);
Disable effect¶
controller.setActive(false);
// controller.active = false;
Remove effect¶
Remove effect from game object
var filterList = gameObject.filters.internal;
filterList.remove(controller);
or
scene.plugins.get('rexToonifyFilter').remove(gameObject);
Remove effect from camera
var filterList = camera.filters.internal;
filterList.remove(controller);
or
scene.plugins.get('rexToonifyFilter').remove(camera);
Get effect¶
Get effect from game object
var controller = scene.plugins.get('rexToonifyFilter').get(gameObject)[0];
// var controllers = scene.plugins.get('rexToonifyFilter').get(gameObject);
Get effect from camera
var controller = scene.plugins.get('rexToonifyFilter').get(camera)[0];
// var controllers = scene.plugins.get('rexToonifyFilter').get(camera);
Edge threshold¶
Get
var edgeThreshold = controller.edgeThreshold;
Set
controller.edgeThreshold = edgeThreshold;
or
controller.setEdgeThreshold(value);
Set 1.1 (or any number larger then 1) to disable this feature.
Hue levels¶
Get
var hueLevels = controller.hueLevels;
Set
controller.hueLevels = hueLevels;
or
controller.setHueLevels(value);
Set 0 to disable this feature.
Saturation levels¶
Get
var satLevels = controller.satLevels;
Set
controller.satLevels = satLevels;
or
controller.setSatLevels(value);
Set 0 to disable this feature.
Value levels¶
Get
var valLevels = controller.valLevels;
Set
controller.valLevels = valLevels;
or
controller.setValLevels(value);
Set 0 to disable this feature.
Edge color¶
Get
var color = controller.edgeColor;
color : Color object.
Red: color.red, 0~255.
Green: color.green, 0~255.
Blue: color.blue, 0~255.
Set
controller.setEdgeColor(value);
or
controller.edgeColor = value;
value : A number 0xRRGGBB, or a JSON object {r:255, g:255, b:255}