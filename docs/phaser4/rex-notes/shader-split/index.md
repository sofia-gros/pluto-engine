Split
Introduction¶
Split image into 4 parts.
Author: Rex
A filter shader effect
WebGL only
Only work in WebGL render mode.
Live demos¶
Split
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexsplitfilterplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexsplitfilterplugin.min.js', true);
Apply effect
Apply effect to game object
gameObject.enableFilters().focusFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.addRexSplit(config);
or
var controller = scene.plugins.get('rexsplitfilterplugin').add(gameObject, config);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.addRexSplit(config);
or
var controller = scene.plugins.get('rexsplitfilterplugin').add(camera, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import SplitFilterPlugin from 'phaser4-rex-plugins/plugins/splitfilter-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexSplitFilter',
plugin: SplitFilterPlugin,
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
var controller = filterList.addRexSplit(config);
or
var controller = scene.plugins.get('rexSplitFilter').add(gameObject, config);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.addRexSplit(config);
or
var controller = scene.plugins.get('rexSplitFilter').add(camera, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import filter and controller class
import { SplitFilter, SplitController } from 'phaser4-rex-plugins/plugins/splitfilter.js';
Register effect
if (!scene.renderer.renderNodes.hasNode(SplitFilter.FilterName)) {
scene.renderer.renderNodes.addNodeConstructor(SplitFilter.FilterName, SplitFilter);
}
Apply effect
Apply effect to game object
gameObject.enableFilters().focusFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.add(
new SplitController(filterList.camera, config)
);
Apply effect to camera
var filterList = camera.filters.internal;
var controller = filterList.add(
new SplitController(filterList.camera, config)
);
Apply effect¶
Apply effect to game object. A game object only can add 1 split effect.
gameObject.enableFilters().focusFilters();
var filterList = gameObject.filters.internal;
var controller = filterList.addRexSplit({
// x: undefined,  // renderer.width / 2
// y: undefined,  // renderer.height / 2
// width: undefined,
// left: 0,
// right: 0,
// height: undefined,
// top: 0,
// bottom: 0,
// angle: undefined,  // Degrees
// rotation: 0,       // Radian
// shiftEnable: true,
// name: 'rexSplitPostFx'
});
x : Vertical split position. Default value is center of render width.
y : Horizontal split position. Default value is center of render height.
width, height : Vertical/Horizontal split length.
left, right : Specify left/right part length of vertical split. Default value is half Vertical split length.
top, bottom : Specify top/bottom part length of horizontal split. Default value is half Horizontal split length.
angle, rotation : Rotation of split axis. Default value is 0.
shiftEnable :
true : Shift splitted parts out. Default value.
false : Don't shift splitted parts. Equal to apply mask on this image.
Apply effect to camera. A camera only can add 1 split effect.
var controller = scene.plugins.get('rexSplitFilter').add(camera, config);
Disable effect¶
controller.setActive(false);
// controller.active = false;
Remove effect¶
Remove effect from game object
var filterList = gameObject.filters.internal;
filterList.remove(controller);
or
scene.plugins.get('rexSplitFilter').remove(gameObject);
Remove effect from camera
var filterList = camera.filters.internal;
filterList.remove(controller);
or
scene.plugins.get('rexSplitFilter').remove(camera);
Get effect¶
Get effect from game object
var controller = scene.plugins.get('rexSplitFilter').get(gameObject)[0];
// var controllers = scene.plugins.get('rexSplitFilter').get(gameObject);
Get effect from camera
var controller = scene.plugins.get('rexSplitFilter').get(camera)[0];
// var controllers = scene.plugins.get('rexSplitFilter').get(camera);
Split position¶
Get
var splitX = controller.splitX;
var splitY = controller.splitY;
Set
controller.splitX = splitX;
controller.splitY = splitY;
or
controller.setSplit(x, y);
Split at center of render¶
controller.splitAtCenter();
// controller.splitAtCenter(width, height);
Split length¶
Get
var splittedWidth = controller.splittedWidth;
var splittedHeight = controller.splittedHeight;
Set
controller.splittedWidth = splittedWidth;
controller.splittedHeight = splittedHeight;
or
controller.setSplittedWidth(splittedWidth);
controller.setSplittedHeight(splittedHeight);
or specify left/right/top/bottom of split length
Get
var left = controller.spaceLeft;
var right = controller.spaceRight;
var top = controller.spaceTop;
var bottom = controller.spaceBottom;
Set
controller.spaceLeft = left;
controller.spaceRight = right;
controller.spaceTop = top;
controller.spaceBottom = bottom;
or
controller.setSpace(left, right, top, bottom);
Rotation Axis of Split edge¶
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
Shift enable¶
Get
var enable = controller.shiftEnable;
Set
controller.shiftEnable = enable;
or
controller.setShiftEnable(enable);