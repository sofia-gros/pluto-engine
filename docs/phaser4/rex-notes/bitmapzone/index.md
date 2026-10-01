Bitmap zone
Introduction¶
Particles' emitter zone from canvas bitmap of text/canvas game object.
Author: Rex
Geometry object
Live demo¶
Particles from text
Particles from texture
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexbitmapzoneplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbitmapzoneplugin.min.js', true);
Add bitmap-zone object
var bitmapZone = scene.plugins.get('rexbitmapzoneplugin').add(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import BitmapZonePlugin from 'phaser4-rex-plugins/plugins/bitmapzone-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexBitmapZone',
plugin: BitmapZonePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add bitmap-zone object
var bitmapZone = scene.plugins.get('rexBitmapZone').add(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import BitmapZone from 'phaser4-rex-plugins/plugins/bitmapzone.js';
Add bitmap-zone object
var bitmapZone = new BitmapZone(gameObject, config);
Create shape¶
var bitmapZone = scene.plugins.get('rexBitmapZone').add(gameObject);
gameObject :
Any kind of text object : Text object, bbcode text object, or tag text object.
Canvas object
Emit zone¶
var particles = scene.add.particles(key,
[
// emitter config
{
// blendMode:
// scale:
// speed:
// garvityY:
emitZone: {
type: 'random',
source: bitmapZone
}
}
]);
bitmapZone provides getRandomPoint method.
Update content¶
bitmapZone.setSource(gameObject);