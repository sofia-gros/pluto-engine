Fisheye
Introduction¶
Fish-eye post processing filter. Reference
Author: Rex
A filter shader effect
WebGL only
Only work in WebGL render mode.
Live demos¶
FishEye
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexfisheyefilterplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexfisheyefilterplugin.min.js', true);
Apply effect
Apply effect to game object
gameObject.enableFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.addRexFishEye(config);
or
var controller = scene.plugins.get('rexfisheyefilterplugin').add(gameObject, config);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.addRexFishEye(config);
or
var controller = scene.plugins.get('rexfisheyefilterplugin').add(camera, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import FishEyeFilterPlugin from 'phaser4-rex-plugins/plugins/fisheyefilter-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexFishEyeFilter',
plugin: FishEyeFilterPlugin,
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
var controller = filterList.addRexFishEye(config);
or
var controller = scene.plugins.get('rexFishEyeFilter').add(gameObject, config);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.addRexFishEye(config);
or
var controller = scene.plugins.get('rexFishEyeFilter').add(camera, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import filter and controller class
import { FishEyeFilter, FishEyeController } from 'phaser4-rex-plugins/plugins/fisheyefilter.js';
Register effect
if (!scene.renderer.renderNodes.hasNode(FishEyeFilter.FilterName)) {
scene.renderer.renderNodes.addNodeConstructor(FishEyeFilter.FilterName, FishEyeFilter);
}
Apply effect
Apply effect to game object
gameObject.enableFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.add(
new FishEyeController(filterList.camera, config)
);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.add(
new FishEyeController(filterList.camera, config)
);
Apply effect¶
Apply effect to game object. A game object only can add 1 fisheye effect.
gameObject.enableFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.addRexFishEye({
// center: {
//    x: windowWidth / 2,
//    y: windowHeight / 2
//}
// radius: 0,
// intensity: 1,
// mode:0,  // 0|1|'asin'|'sin'
// name: 'rexFishEyePostFx'
});
center.x, center.y : Local position of fisheye center.
radius : FishEye radius.
intensity : 0(original) ~ 1(fisheye). Default value is 1.
mode :
0, or 'asin' : asin mode. Defaule value is 0.
1, or 'sin' : sin mode.
Apply effect to camera. A camera only can add 1 fisheye effect.
var controller = scene.plugins.get('rexFishEyeFilter').add(camera, config);
Disable effect¶
controller.setActive(false);
// controller.active = false;
Remove effect¶
Remove effect from game object
var filterList = gameObject.filters.internal;
filterList.remove(controller);
or
scene.plugins.get('rexFishEyeFilter').remove(gameObject);
Remove effect from camera
var filterList = camera.filters.internal;
filterList.remove(controller);
or
scene.plugins.get('rexFishEyeFilter').remove(camera);
Get effect¶
Get effect from game object
var controller = scene.plugins.get('rexFishEyeFilter').get(gameObject)[0];
// var controllers = scene.plugins.get('rexFishEyeFilter').get(gameObject);
Get effect from camera
var controller = scene.plugins.get('rexFishEyeFilter').get(camera)[0];
// var controllers = scene.plugins.get('rexFishEyeFilter').get(camera);
Radius¶
Get
var radius = controller.radius;
Set
controller.radius = radius;
// controller.radius += value;
or
controller.setRadius(radius);
Intensity¶
Get
var intensity = controller.intensity;
Set
controller.intensity = intensity;
// controller.intensity += value;
or
controller.setIntensity(intensity);
intensity : 0(original) ~ 1(fisheye)
Center position¶
Default value is center of window.
Get
var x = controller.centerX;
var y = controller.centerY;
Set
controller.centerX = x;
controller.centerY = y;
or
controller.setCenter(x, y);
// controller.setCenter();   // set to center of window
Mode¶
Get
var mode = controller.fishEyeMode;
Set
controller.setFishEyeMode(mode);
0, or 'asin' : asin mode.
1, or 'sin' : sin mode.