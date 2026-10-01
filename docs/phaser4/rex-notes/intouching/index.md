In touching
Introduction¶
Fires 'intouch' event every tick when pressing on a game object.
Author: Rex
Behavior of game object
Live demos¶
Cooldown
Is in touching
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexintouchingplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexintouchingplugin.min.js', true);
Add intouching behavior
var intouching = scene.plugins.get('rexintouchingplugin').add(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import InTouchingPlugin from 'phaser4-rex-plugins/plugins/intouching-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexInTouchingn',
plugin: InTouchingPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add intouching behavior
var intouching = scene.plugins.get('rexInTouchingn').add(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import InTouching from 'phaser4-rex-plugins/plugins/intouching.js';
Add intouching behavior
var intouching = new InTouching(gameObject, config);
Create instance¶
var intouching = scene.plugins.get('rexInTouching').add(gameObject, {
// enable: true,
// cooldown: undefined
});
enable : Can touch.
cooldown : Fire 'intouch' event every tick, or periodically.
undefined : Fire 'intouch' event every tick.
Events¶
In-touching
intouching.on('intouch', function (intouching, gameObject, pointer) {
// ...
}, scope);
Touching-start
intouching.on('touchstart', function (intouching, gameObject) {
// ...
}, scope);
Touching-end
intouching.on('touchend', function (intouching, gameObject) {
// ...
}, scope);
In touching¶
var isInTouching = intouching.isInTouching;
Enable¶
Get
var enabled = intouching.enable;  // enabled: true, or false
Set
intouching.setEnable(enabled);  // enabled: true, or false
// intouching.enable = enabled;
Toggle
intouching.toggleEnable();
Cooldown¶
Get
var cooldownTime = intouching.cooldownTime;
Set
intouching.setCooldown(time);
or
intouching.cooldownTime = cooldownTime;