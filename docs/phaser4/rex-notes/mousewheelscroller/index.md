Mouse wheel scroller
Introduction¶
Emit scroll event when mouse-wheeling.
Author: Rex
Member of scene
Live demos¶
Scroller
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexmousewheelscrollerplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexmousewheelscrollerplugin.min.js', true);
Add mouse-wheeling-to-cursor-key object
var scroller = scene.plugins.get('rexmousewheelscrollerplugin').add(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import MouseWheelScrollerPlugin from 'phaser4-rex-plugins/plugins/mousewheelscroller-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexMouseWheelScroller',
plugin: MouseWheelScrollerPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add mouse-wheeling-to-cursor-key object
var scroller = scene.plugins.get('rexMouseWheelScroller').add(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import MouseWheelScroller from 'phaser4-rex-plugins/plugins/mousewheelscroller.js';
Add mouse-wheeling-to-cursor-key object
var scroller = new MouseWheelScroller(gameObject, config);
Create instance¶
var scroller = scene.plugins.get('rexMouseWheelScroller').add(gameObject, {
// focus: true,
// speed: 0.1,
// enable: true,
});
focus : Fire 'scroll' event when mouse-wheeling --
false, or 0 : Without checking if cursor is over game object or not.
true, or 1 : Cursor is over game object. Default behavior.
2 : Cursor is inside the rectangle bounds of game object.
speed : Scrolling speed. Default value is 0.1.
enable : Set true to enable 'scroll' event.
Event¶
Scroll
scroller.on('scroll', function(inc, gameObject, scroller) {
}, scope)
inc : Scroll value,
Positive value : Mouse-wheeling down
Negative value : Mouse-wheeling up
Speed¶
Set
scroller.setSpeed(speed);
// scroller.speed = speed;
Get
var speed = scroller.speed;
Enable¶
Set
scroller.setEnable(enable);
// scroller.enable = enable;
Get
var enable = scroller.enable;