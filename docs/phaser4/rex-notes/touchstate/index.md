Touch state
Introduction¶
Store current touch input properties.
Author: Rex
Behavior of game object
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rextouchstateplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextouchstateplugin.min.js', true);
Add touch-state behavior
var touchState = scene.plugins.get('rextouchstateplugin').add(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import TouchStatePlugin from 'phaser4-rex-plugins/plugins/touchstate-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexTouchState',
plugin: TouchStatePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add touch-state behavior
var touchState = scene.plugins.get('rexTouchState').add(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import TouchState from 'phaser4-rex-plugins/plugins/touchstate.js';
Add touch-state behavior
var touchState = new TouchState(gameObject, config);
Create instance¶
var touchState = scene.plugins.get('rexTouchState').add(gameObject, {
// enable: true,
});
enable : Can touch.
Properties¶
Is pointer down, is pointer up
var isDown = touchState.isDown;
var isUp = touchState.isUp;
Is in touching
var isInTouching = touchState.isInTouching;
Pointer in local position
var localX = touchState.localX;
var localY = touchState.localY;
Drag speed
var speed = touchState.speed;
var speedX =  touchState.speedX;
var speedY =  touchState.speedY;
var dx = touchState.dx;
var dy = touchState.dy;
var dt = touchState.dt;
Events¶
Touch start (pointer down)
touchState.on('touchstart', function (touchState, gameObject, pointer, localX, localY, event) {
// ...
}, scope);
Touch end (pointer up)
touchState.on('touchend', function (touchState, gameObject, pointer) {
// ...
}, scope);
Touch move (pointer move)
touchState.on('touchmove', function (touchState, gameObject, pointer, localX, localY, event) {
// ...
}, scope);
Enable¶
Get
var enabled = touchState.enable;  // enabled: true, or false
Set
touchState.setEnable(enabled);  // enabled: true, or false
// touchState.enable = enabled;
Toggle
touchState.toggleEnable();