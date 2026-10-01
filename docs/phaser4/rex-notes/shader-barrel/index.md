Shader barrel
Note
Phaser4 has a built-in barrel effect.
Introduction¶
Barrel post processing filter. Reference
Author: Rex
A filter shader effect
WebGL only
Only work in WebGL render mode.
Live demos¶
Barrel
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexbarrelfilterplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbarrelfilterplugin.min.js', true);
Apply effect
Apply effect to game object
gameObject.enableFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.addRexBarrel(config);
or
var controller = scene.plugins.get('rexbarrelfilterplugin').add(gameObject, config);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.addRexBarrel(config);
or
var controller = scene.plugins.get('rexbarrelfilterplugin').add(camera, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import BarrelFilterPlugin from 'phaser4-rex-plugins/plugins/barrelfilter-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexBarrelFilter',
plugin: BarrelFilterPlugin,
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
var controller = filterList.addRexBarrel(config);
or
var controller = scene.plugins.get('rexBarrelFilter').add(gameObject, config);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.addRexBarrel(config);
or
var controller = scene.plugins.get('rexBarrelFilter').add(camera, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import filter and controller class
```javascript
import { BarrelFilter, BarrelController } from 'phaser4-rex-plugins/plugins/barrelfilter.js';
Register effect
if (!scene.renderer.renderNodes.hasNode(BarrelFilter.FilterName)) {
scene.renderer.renderNodes.addNodeConstructor(BarrelFilter.FilterName, BarrelFilter);
}
Apply effect
Apply effect to game object
gameObject.enableFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.add(
new BarrelController(filterList.camera, config)
);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.add(
new BarrelController(filterList.camera, config)
);
Apply effect¶
Apply effect to game object. A game object only can add 1 barrel effect.
gameObject.enableFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.addRexBarrel({
// shrink: false,
// center: {
//    x: windowWidth / 2,
//    y: windowHeight / 2
//}
// radius: 0,
// power: 0.5,
// intensity: 1,
// name: 'rexBarrelPostFx'
});
shrink :
false : Fish-eye effect
true : Anti fish-eye effect.
center.x, center.y : Local position of barrel center.
radius : Barrel radius.
power : 0~1.
intensity : 0(original) ~ 1(barrel). Default value is 1.
Apply effect to camera. A camera only can add 1 barrel effect.
var controller = scene.plugins.get('rexBarrelFilter').add(camera, config);
Disable effect¶
controller.setActive(false);
// controller.active = false;
Remove effect¶
Remove effect from game object
var filterList = gameObject.filters.internal;
filterList.remove(controller);
or
scene.plugins.get('rexBarrelFilter').remove(gameObject);
Remove effect from camera
var filterList = camera.filters.internal;
filterList.remove(controller);
or
scene.plugins.get('rexBarrelFilter').remove(camera);
Get effect¶
Get effect from game object
var controller = scene.plugins.get('rexBarrelFilter').get(gameObject)[0];
// var controllers = scene.plugins.get('rexBarrelFilter').get(gameObject);
Get effect from camera
var controller = scene.plugins.get('rexBarrelFilter').get(camera)[0];
// var controllers = scene.plugins.get('rexBarrelFilter').get(camera);
Shrink mode¶
Get
var shrinkMode = controller.shrinkMode;
Set
controller.setShrinkMode(true);
// controller.setShrinkMode(false);
Radius¶
Get
var radius = controller.radius;
Set
controller.radius = radius;
// controller.radius += value;
or
controller.setRadius(radius);
Power¶
Get
var power = controller.power;
Set
controller.power = power;
or
controller.setPower(power);
Intensity¶
Get
var intensity = controller.intensity;
Set
controller.intensity = intensity;
// controller.intensity += value;
or
controller.setIntensity(radius);
intensity : 0(original) ~ 1(barrel)
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