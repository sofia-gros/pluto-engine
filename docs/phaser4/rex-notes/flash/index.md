Flash
Introduction¶
Flashing (set invisible then visible) game object.
Author: Rex
Behavior of game object
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexflashplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexflashplugin.min.js', true);
Add flash behavior
var flash = scene.plugins.get('rexflashplugin').add(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import FlashPlugin from 'phaser4-rex-plugins/plugins/flash-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexFlash',
plugin: FlashPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add flash behavior
var flash = scene.plugins.get('rexFlash').add(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import Flash from 'phaser4-rex-plugins/plugins/flash.js';
Add flash behavior
var flash = new Flash(gameObject, config);
Create instance¶
var flash = scene.plugins.get('rexFlash').add(gameObject, {
// duration: 500,
// repeat: 2
});
duration : Duration of invisible(50%) and visible(50%), in millisecond.
repeat : The number of times the flashing will repeat itself (a value of 1 means the flash will play twice, as it repeated once)
Start flashing¶
flash.flash();
// flash.flash(duration, repeat);
or
flash.flash({
duration: 500,
repeat: 2
});
Stop flashing¶
flash.stop();
Enable¶
Enable/resume (default)
flash.setEnable();
or
flash.enable = true;
Disable/pause
flash.setEnable(false);
or
flash.enable = false;
Set duration¶
flash.setDuration(duration);
// flash.duration = duration;
Set repeat¶
flash.setRepeat(repeat);
// flash.repeat = repeat;
Events¶
On reached target
flash.on('complete', function(flash, gameObject){});
Status¶
Is flashing
var isRunning = flash.isRunning;