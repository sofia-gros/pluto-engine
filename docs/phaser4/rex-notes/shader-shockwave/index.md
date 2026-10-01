Shockwave
Introduction¶
Shockwave post processing filter. Reference
Author: Rex
A filter shader effect
WebGL only
Only work in WebGL render mode.
Live demos¶
Shockwave
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexshockwavefilterplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexshockwavefilterplugin.min.js', true);
Apply effect
Apply effect to game object
gameObject.enableFilters().focusFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.addRexShockwave(config);
or
var controller = scene.plugins.get('rexshockwavefilterplugin').add(gameObject, config);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.addRexShockwave(config);
or
var controller = scene.plugins.get('rexshockwavefilterplugin').add(camera, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import ShockwaveFilterPlugin from 'phaser4-rex-plugins/plugins/shockwavefilter-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexShockwaveFilter',
plugin: ShockwaveFilterPlugin,
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
gameObject.enableFilters().focusFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.addRexShockwave(config);
or
var controller = scene.plugins.get('rexShockwaveFilter').add(gameObject, config);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.addRexShockwave(config);
or
var controller = scene.plugins.get('rexShockwaveFilter').add(camera, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import filter and controller class
import { ShockwaveFilter, ShockwaveController } from 'phaser4-rex-plugins/plugins/shockwavefilter.js';
Register effect
if (!scene.renderer.renderNodes.hasNode(ShockwaveFilter.FilterName)) {
scene.renderer.renderNodes.addNodeConstructor(ShockwaveFilter.FilterName, ShockwaveFilter);
}
Apply effect
Apply effect to game object
gameObject.enableFilters().focusFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.add(
new ShockwaveController(filterList.camera, config)
);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.add(
new ShockwaveController(filterList.camera, config)
);
Apply effect¶
Apply effect to game object. A game object only can add 1 shockwave effect.
gameObject.enableFilters().focusFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.addRexShockwave({
// center: {
//    x: windowWidth / 2,
//    y: windowHeight / 2
//}
// waveRadius: 0,
// waveWidth: 20,
// powBaseScale: 0.8,
// powExponent: 0.1,
// name: 'rexShockwavePostFx'
});
waveRadius : Radius of shockwave, in pixels.
waveWidth : Width of shockwave, in pixels.
powBaseScale, powExponent : Parameters of shockwave.
Apply effect to camera. A camera only can add 1 shockwave effect.
var controller = scene.plugins.get('rexShockwaveFilter').add(camera, config);
Disable effect¶
controller.setActive(false);
// controller.active = false;
Remove effect¶
Remove effect from game object
var filterList = gameObject.filters.internal;
filterList.remove(controller);
or
scene.plugins.get('rexShockwaveFilter').remove(gameObject);
Remove effect from camera
var filterList = camera.filters.internal;
filterList.remove(controller);
or
scene.plugins.get('rexShockwaveFilter').remove(camera);
Get effect¶
Get effect from game object
var controller = scene.plugins.get('rexShockwaveFilter').get(gameObject)[0];
// var controllers = scene.plugins.get('rexShockwaveFilter').get(gameObject);
Get effect from camera
var controller = scene.plugins.get('rexShockwaveFilter').get(camera)[0];
// var controllers = scene.plugins.get('rexShockwaveFilter').get(camera);
Wave radius¶
Get
var waveRadius = controller.waveRadius;
Set
controller.waveRadius = waveRadius;
or
controller.setWaveRadius(waveRadius);
Wave width¶
Get
var waveWidth = controller.waveWidth;
Set
controller.waveWidth = waveWidth;
or
controller.setWaveWidth(waveWidth);