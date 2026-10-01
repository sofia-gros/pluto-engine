PNG Appender
Introduction¶
Append user data below tail of PNG data, or extract this user data from PNG data.
Author: Rex
Methods
Live demos¶
Append-extract
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexpngappenderplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexpngappenderplugin.min.js', true);
Append, or extract data
var resultBuffer = scene.plugins.get('rexpngappenderplugin').append(pngBuffer, data);
var data = scene.plugins.get('rexpngappenderplugin').extract(pngBuffer);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import PNGAppenderPlugin from 'phaser4-rex-plugins/plugins/pngappender-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexPNGAppender',
plugin: PNGAppenderPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Append, or extract data
var resultBuffer = scene.plugins.get('rexPNGAppender').append(pngBuffer, data);
var data = scene.plugins.get('rexPNGAppender').extract(pngBuffer);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import PNGAppender from 'phaser4-rex-plugins/plugins/pngappender.js';
Append, or extract data
var resultBuffer = PNGAppender.append(pngBuffer, data);
var data = PNGAppender.extract(pngBuffer);
Append data¶
var resultBuffer = scene.plugins.get('rexPNGAppender').append(pngBuffer, data);
pngBuffer : PNG data loaded from binary loader.
data : JSON. dictionary, array, string, number, or Uint8Array.
resultBuffer : PNG data with custom data (data).
Can add to texture cache via scene.load.image(...)
Create blob from resultBuffer : var blob = new Blob([buffer], { type: 'image/png' })
Create object url from blob : var url = window.URL.createObjectURL(blob)
Load texture from object url : scene.load.image(textureKey, url)
Start loader if in create stage of scene : scene.load.start()
Can download and display on image viewer as normal PNG file.
Extract data¶
var data = scene.plugins.get('rexPNGAppender').extract(pngBuffer);
pngBuffer : PNG data loaded from binary loader.
data : User data.
null : This pngBuffer does not have user data.