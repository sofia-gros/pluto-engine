Pop up
Introduction¶
Scale up from 0 to current scale of game object.
Author: Rex
Method only
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexscaleplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexscaleplugin.min.js', true);
Pop-up object
scene.plugins.get('rexscaleplugin').popup(gameObject, duration);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import ScalePlugin from 'phaser4-rex-plugins/plugins/scale-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexScale',
plugin: ScalePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Pop-up object
scene.plugins.get('rexScale').popup(gameObject, duration);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import PopUp from 'phaser4-rex-plugins/plugins/popup.js';
Pop-up object
PopUp(gameObject, duration);
Pop up¶
Pop up width and height
var scale = scene.plugins.get('rexScale').popup(gameObject, duration);
// var scale = popUp(gameObject, duration, undefined, ease);
ease : Ease function, default is 'Cubic'.
Pop up width only
var scale = scene.plugins.get('rexScale').popup(gameObject, duration, 'x');
// var scale = popUp(gameObject, duration, 'x', ease);
ease : Ease function, default is 'Cubic'.
Pop up height only
var scale = scene.plugins.get('rexScale').popup(gameObject, duration, 'y');
// var scale = popUp(gameObject, duration, 'y', ease);
ease : Ease function, default is 'Cubic'.
Events¶
See Events of tween task
Scale completes or is stopped.
scale.on('complete', function(gameObject, scale){
}, scope);