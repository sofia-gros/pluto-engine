Swirl
Introduction¶
Swirl post processing filter. Reference
Author: Rex
A filter shader effect
WebGL only
Only work in WebGL render mode.
Live demos¶
Swirl
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexswirlfilterplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexswirlfilterplugin.min.js', true);
Apply effect
Apply effect to game object
gameObject.enableFilters().focusFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.addRexSwirl(config);
or
var controller = scene.plugins.get('rexswirlfilterplugin').add(gameObject, config);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.addRexSwirl(config);
or
var controller = scene.plugins.get('rexswirlfilterplugin').add(camera, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import SwirlFilterPlugin from 'phaser4-rex-plugins/plugins/swirlfilter-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexSwirlFilter',
plugin: SwirlFilterPlugin,
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
var controller = filterList.addRexSwirl(config);
or
var controller = scene.plugins.get('rexSwirlFilter').add(gameObject, config);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.addRexSwirl(config);
or
var controller = scene.plugins.get('rexSwirlFilter').add(camera, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import filter and controller class
import { SwirlFilter, SwirlController } from 'phaser4-rex-plugins/plugins/swirlfilter.js';
Register effect
if (!scene.renderer.renderNodes.hasNode(SwirlFilter.FilterName)) {
scene.renderer.renderNodes.addNodeConstructor(SwirlFilter.FilterName, SwirlFilter);
}
Apply effect
Apply effect to game object
gameObject.enableFilters().focusFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.add(
new SwirlController(filterList.camera, config)
);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.add(
new SwirlController(filterList.camera, config)
);
Apply effect¶
Apply effect to game object. A game object only can add 1 swirl effect.
gameObject.enableFilters().focusFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.addRexSwirl({
// center: {
//    x: windowWidth / 2,
//    y: windowHeight / 2
//}
// radius: 0,
// rotation: 0,  // or angle: 0,
// name: 'rexSwirlPostFx'
});
center.x, center.y : Local position of swirl center.
radius : Swirl radius.
rotation (angle) : Swirl angle.
Apply effect to camera. A camera only can add 1 swirl effect.
var controller = scene.plugins.get('rexSwirlFilter').add(camera, config);
Disable effect¶
controller.setActive(false);
// controller.active = false;
Remove effect¶
Remove effect from game object
var filterList = gameObject.filters.internal;
filterList.remove(controller);
or
scene.plugins.get('rexSwirlFilter').remove(gameObject);
Remove effect from camera
var filterList = camera.filters.internal;
filterList.remove(controller);
or
scene.plugins.get('rexSwirlFilter').remove(camera);
Get effect¶
Get effect from game object
var controller = scene.plugins.get('rexSwirlFilter').get(gameObject)[0];
// var controllers = scene.plugins.get('rexSwirlFilter').get(gameObject);
Get effect from camera
var controller = scene.plugins.get('rexSwirlFilter').get(camera)[0];
// var controllers = scene.plugins.get('rexSwirlFilter').get(camera);
Radius¶
Get
var radius = controller.radius;
Set
controller.radius = radius;
// controller.radius += value;
or
controller.setRadius(radius);
Rotation¶
Get
var rotation = controller.rotation;  // radians
// var angle = controller.angle;     // degrees
Set
controller.rotation = rotation;
controller.rotation += value;
// controller.angle = angle;
// controller.angle += value;
or
controller.setRotation(rotation);
// controller.setAngle(angle);
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