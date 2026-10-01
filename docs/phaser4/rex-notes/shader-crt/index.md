CRT
Introduction¶
CRT effect. Reference
Author: Rex
A filter shader effect
WebGL only
Only work in WebGL render mode.
Live demos¶
CRT
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexcrtfilterplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcrtfilterplugin.min.js', true);
Apply effect
Apply effect to game object
gameObject.enableFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.addRexCrt(config);
or
var controller = scene.plugins.get('rexcrtfilterplugin').add(gameObject, config);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.addRexCrt(config);
or
var controller = scene.plugins.get('rexcrtfilterplugin').add(camera, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import CrtFilterPlugin from 'phaser4-rex-plugins/plugins/crtfilter-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexCrtFilter',
plugin: CrtFilterPlugin,
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
var controller = filterList.addRexCrt(config);
or
var controller = scene.plugins.get('rexCrtFilter').add(gameObject, config);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.addRexCrt(config);
or
var controller = scene.plugins.get('rexCrtFilter').add(camera, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import filter and controller class
import { CrtFilter, CrtController } from 'phaser4-rex-plugins/plugins/crtfilter.js';
Register effect
if (!scene.renderer.renderNodes.hasNode(CrtFilter.FilterName)) {
scene.renderer.renderNodes.addNodeConstructor(CrtFilter.FilterName, CrtFilter);
}
Apply effect
Apply effect to game object
gameObject.enableFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.add(
new CrtController(filterList.camera, config)
);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.add(
new CrtController(filterList.camera, config)
);
Apply effect¶
Apply effect to game object.
gameObject.enableFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.addRexCrt({
// warpX: 0.75,
// warpY: 0.75,
// scanLineStrength: 0.2,
// scanLineWidth: 1024,
// name: 'rexCrtPostFx'
});
warpX, warpY : Horizontal and Vertical warp.
scanLineStrength, scanLineWidth : Scan line parameters.
Apply effect to camera.
var controller = scene.plugins.get('rexCrtFilter').add(camera, config);
Disable effect¶
controller.setActive(false);
// controller.active = false;
Remove effect¶
Remove effect from game object
var filterList = gameObject.filters.internal;
filterList.remove(controller);
or
scene.plugins.get('rexCrtFilter').remove(gameObject);
Remove effect from camera
var filterList = camera.filters.internal;
filterList.remove(controller);
or
scene.plugins.get('rexCrtFilter').remove(camera);
Get effect¶
Get effect from game object
var controller = scene.plugins.get('rexCrtFilter').get(gameObject)[0];
// var controllers = scene.plugins.get('rexCrtFilter').get(gameObject);
Get effect from camera
var controller = scene.plugins.get('rexCrtFilter').get(camera)[0];
// var controllers = scene.plugins.get('rexCrtFilter').get(camera);
Warp¶
Get
var warpX = controller.warpX;
var warpY = controller.warpY;
Set
controller.setWarp(warpX, warpY);
or
controller.warpX = warpX;
controller.warpY = warpY;
Scan lines¶
Get
var scanLineStrength = controller.scanLineStrength;
var scanLineWidth = controller.scanLineWidth;
Set
controller.setScanLineStrength(scanLineStrength);
controller.setScanLineWidth(scanLineWidth);
or
controller.scanLineStrength = scanLineStrength;
controller.scanLineWidth = scanLineWidth;