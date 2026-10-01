Cross-stitching
Introduction¶
Cross-stitching post processing filter. Reference
Author: Rex
A filter shader effect
WebGL only
Only work in WebGL render mode.
Live demos¶
Cross-stitching
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexcrossstitchingfilterplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcrossstitchingfilterplugin.min.js', true);
Apply effect
Apply effect to game object
gameObject.enableFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.addRexCrossStitching(config);
or
var controller = scene.plugins.get('rexcrossstitchingfilterplugin').add(gameObject, config);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.addRexCrossStitching(config);
or
var controller = scene.plugins.get('rexcrossstitchingfilterplugin').add(camera, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import CrossStitchingFilterPlugin from 'phaser4-rex-plugins/plugins/crossstitchingfilter-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexCrossStitchingFilter',
plugin: CrossStitchingFilterPlugin,
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
var controller = filterList.addRexCrossStitching(config);
or
var controller = scene.plugins.get('rexCrossStitchingFilter').add(gameObject, config);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.addRexCrossStitching(config);
or
var controller = scene.plugins.get('rexCrossStitchingFilter').add(camera, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import filter and controller class
import { CrossStitchingFilter, CrossStitchingController } from 'phaser4-rex-plugins/plugins/crossstitchingfilter.js';
Register effect
if (!scene.renderer.renderNodes.hasNode(CrossStitchingFilter.FilterName)) {
scene.renderer.renderNodes.addNodeConstructor(CrossStitchingFilter.FilterName, CrossStitchingFilter);
}
Apply effect
Apply effect to game object
gameObject.enableFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.add(
new CrossStitchingController(filterList.camera, config)
);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.add(
new CrossStitchingController(filterList.camera, config)
);
Apply effect¶
Apply effect to game object. A game object only can add 1 cross-stitching effect.
gameObject.enableFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.addRexCrossStitching({
// stitchingWidth: 6,
// stitchingHeight: 6,
// brightness: 0,
// name: 'rexCrossStitchingPostFx'
});
stitchingWidth, stitchingHeight : Stitching size.
brightness : Brightness of stitching edges
Apply effect to camera. A camera only can add 1 cross-stitching effect.
var controller = scene.plugins.get('rexCrossStitchingFilter').add(camera, config);
Disable effect¶
controller.setActive(false);
// controller.active = false;
Remove effect¶
Remove effect from game object
var filterList = gameObject.filters.internal;
filterList.remove(controller);
or
scene.plugins.get('rexCrossStitchingFilter').remove(gameObject);
Remove effect from camera
var filterList = camera.filters.internal;
filterList.remove(controller);
or
scene.plugins.get('rexCrossStitchingFilter').remove(camera);
Get effect¶
Get effect from game object
var controller = scene.plugins.get('rexCrossStitchingFilter').get(gameObject)[0];
// var controllers = scene.plugins.get('rexCrossStitchingFilter').get(gameObject);
Get effect from camera
var controller = scene.plugins.get('rexCrossStitchingFilter').get(camera)[0];
// var controllers = scene.plugins.get('rexCrossStitchingFilter').get(camera);
Stitching size¶
Get
var stitchingWidth = controller.stitchingWidth;
var stitchingHeight = controller.stitchingHeight;
Set
controller.stitchingWidth = stitchingWidth;
controller.stitchingHeight = stitchingHeight;
// controller.stitchingWidth += value;
// controller.stitchingHeight += value;
or
controller.setStitchingWidth(stitchingWidth);
controller.setStitchingHeight(stitchingHeight);
controller.setStitchingSize(stitchingWidth, stitchingHeight);
Brightness¶
Get
var brightness = controller.brightness;
Set
controller.brightness = brightness;
// controller.brightness += value;
or
controller.setBrightness(radius);
brightness : 0(black) ~ 1(white)