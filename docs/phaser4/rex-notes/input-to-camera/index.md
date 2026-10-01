Control by input
Introduction¶
Control camera's scroll by pan/cursor-at-bounds(scroll), and zoom by pinch/mouse-wheel.
Author: Rex
Member of scene
Live demos¶
Camera controller
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexcameracontrollerplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcameracontrollerplugin.min.js', true);
Add camera-controller object
var cameraController = scene.plugins.get('rexcameracontrollerplugin').add(scene, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import CameraControllerPlugin from 'phaser4-rex-plugins/plugins/cameracontroller-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexCameraController',
plugin: CameraControllerPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add camera-controller object
var cameraController = scene.plugins.get('rexCameraController').add(scene, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import CameraController from 'phaser4-rex-plugins/plugins/cameracontroller.js';
Add camera-controller object
var cameraController = new CameraController(scene, config);
Create instance¶
var cameraController = scene.plugins.get('rexCameraController').add(scene, {
// camera: scene.cameras.main,
// minZoom: undefined,
// maxZoom: undefined,
// panScroll: true,
// panScrollEnable: true,
// pinchZoom: true,
// pinchZoomEnable: true,
// pinchZoomMin: undefined,
// pinchZoomMax: undefined,
// pinchZoomFocusEnable: true,
// inputTarget: undefined,
// boundsScroll: true,
// boundsScrollEnable: true,
// mouseWheelZoom: truem
// mouseWheelZoomEnable: true,
// mouseWheelZoomStep: 0.01,
// mouseWheelZoomMin: undefined,
// mouseWheelZoomMax: undefined,
// enable: true
});
scene : Target scene.
camera :
undefined : Default camera of this scene.
A camera object : Control this camera object.
minZoom, maxZoom  : Minumun/maximum camera zoom value for pinchZoom and mouseWheelZoom behaviors.
undefined : No max/min constraint. Default behavior.
Pan scroll:
panScroll : Set to false will discard pan-scroll controller. Default is true.
panScrollEnable : Set to true to enable pan-scroll behavior. Default value is true.
inputTarget :
undefined : Receive pan/pinch input by scene's input event. Default behavior.
A game object : Receive pan/pinch input only on this game object.
Pinch zoom:
pinchZoom : Set to false will discard pinch-zoom controller. Default is true.
pinchZoomEnable : Set to true to enable pinch-zoom behavior. Default value is true.
pinchZoomMin, pinchZoomMax  : Minumun/maximum camera zoom value. Default value is minZoom, maxZoom.
pinchZoomFocusEnable :
true : Scroll camera to focus on middle of pinch points. Default is true.
false : Only zoom camera.
inputTarget :
undefined : Receive pan/pinch input by scene's input event. Default behavior.
A game object : Receive pan/pinch input only on this game object.
cursor-at-bounds scroll :
boundsScroll : Set to false will discard cursor-at-bounds-scroller controller. Default is true.
boundsScrollEnable : Set to true to enable bounds-scroll behavior. Default value is true.
mouse-wheel zoom :
mouseWheelZoom : Set to false will discard mouse-wheel-zoom controller. Default is true.
mouseWheelZoomEnable : Set to true to enable mouse-wheel-zoom behavior. Default value is true.
mouseWheelZoomStep : Camera zoom incremental. Default value is 0.1.
mouseWheelZoomMin, mouseWheelZoomMax  : Minumun/maximum camera zoom value. Default value is minZoom, maxZoom.
enable :
false : Disable all camera-controller temporary.
true : Restore all camera-controller's enable state to previous value. Default behavior.
Set target camera¶
cameraController.setCamera(camera);
Enable controller behavior¶
Pan-scroll
cameraController.setPanScrollEnable(enable);
// cameraController.panScrollEnable = enable;
Pinch-zoom
cameraController.setPinchZoomEnable(enable);
// cameraController.pinchZoomEnable = enable;
Bounds-scroll
cameraController.setBoundsScrollEnable(enable);
// cameraController.boundsScrollEnable = enable;
Wheel-zoom
cameraController.setMouseWheelZoomEnable(enable);
// cameraController.mouseWheelZoomEnable = enable;
Disable all behaviors
cameraController.setEnable(false);
// cameraController.enable = false;
Restore enable state of all behaviors
cameraController.setEnable();
// cameraController.enable = true;
Toggle enable state
cameraController.toggleEnable();
// cameraController.enable = !cameraController.enable;
Status¶
Is pinching
var isPinching = cameraController.isPinching;
Is panning
var isPanning = cameraController.isPanning;