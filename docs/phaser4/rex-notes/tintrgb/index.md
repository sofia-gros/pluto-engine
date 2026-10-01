TintRGB
Introduction¶
Attach tintR, tintG, tintB, and tintGray properties to a game object.
Note
This behavior will override default tint property
Author: Rex
Method only
Live demos¶
Fade
Yellow to green
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rextintrgbplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextintrgbplugin.min.js', true);
Attach tintR, tintG, tintB, and tintGray properties.
scene.plugins.get('rextintrgbplugin').add(gameObject, tintRGB);
gameObject.tintGray = 128;
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import TintRGBPlugin from 'phaser4-rex-plugins/plugins/tintrgb-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexTintRGB',
plugin: TintRGBPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Attach tintR, tintG, tintB, and tintGray properties.
scene.plugins.get('rexTintRGB').add(gameObject, tintRGB);
gameObject.tintGray = 128;
Import method¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import method
import AddTintRGBProperties from 'phaser4-rex-plugins/plugins/tintrgb.js';
Attach tintR, tintG, tintB, and tintGray properties.
AddTintRGBProperties(gameObject, tintRGB);
gameObject.tintGray = 128;
Attach properties¶
scene.plugins.get('rexTintRGB').add(gameObject, tintRGB);
gameObject.tintGray = 128;
// gameObject.tintR = 128;
// gameObject.tintG = 128;
// gameObject.tintB = 128;
tintRGB : Initial tintRGB value in 0xRRGGBB.
tintR : color R of tint, 0~255. Default is 255.
tintG : color G of tint, 0~255. Default is 255.
tintB : color B of tint, 0~255. Default is 255.
tintGray :　Gray tint, 0~255. Default is 255.
Set gameObject.tintGray is equal to set tintR, tintG, tintB with the same value.
Fade¶
scene.tweens.add({
targets: gameObject,
tintR: 0,
tintG: 0,
tintB: 0,
// tintGray: 0,
duration: 3000
})