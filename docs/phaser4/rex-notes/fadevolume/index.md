Volume fading
Introduction¶
Fade-in/fade-out volume of sound.
Author: Rex
Method only
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexsoundfadeplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexsoundfadeplugin.min.js', true);
Sound fade-in/fade-out
var sound = scene.plugins.get('rexsoundfadeplugin').fadeIn(sound, duration);
var sound = scene.plugins.get('rexsoundfadeplugin').fadeOut(sound, duration);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import SoundFadePlugin from 'phaser4-rex-plugins/plugins/soundfade-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexSoundFade',
plugin: SoundFadePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Sound fade-in/fade-out
var sound = scene.plugins.get('rexSoundFade').fadeIn(sound, duration);
var sound = scene.plugins.get('rexSoundFade').fadeOut(sound, duration);
Import method¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import method
import SoundFade from 'phaser4-rex-plugins/plugins/soundfade.js';
Sound fade-in/fade-out
var sound = SoundFade.fadeIn(sound, duration);
var sound = SoundFade.fadeOut(sound, duration);
Fade in¶
Play and fade in voluem.
var sound = scene.plugins.get('rexSoundFade').fadeIn(sound, duration);
// var sound = scene.plugins.get('rexSoundFade').fadeIn(sound, duration, endVolume, startVolume);
sound : Sound instance, or a key of audio cache.
Fade out¶
Fade out volume then destroy it
scene.plugins.get('rexSoundFade').fadeOut(sound, duration);
sound : Sound instance.
Fade out volume then stop it
scene.plugins.get('rexSoundFade').fadeOut(sound, duration, false);
sound : Sound instance.