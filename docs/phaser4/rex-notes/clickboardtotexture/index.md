Clickboard to texture
Introduction¶
Store the image pasted from the clipboard into the texture manager.
Author: Rex
Member of scene
Live demos¶
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexclickboardtotextureplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexclickboardtotextureplugin.min.js', true);
Add clickboard-to-texture object
var clickboardToTexture = scene.plugins.get('rexclickboardtotextureplugin').add(scene);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import ClickboardToTexturePlugin from 'phaser4-rex-plugins/plugins/clickboardtotexture-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexClickboardToTexture',
plugin: ClickboardToTexturePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add clickboard-to-texture object
var clickboardToTexture = scene.plugins.get('rexClickboardToTexture').add(scene);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import ClickboardToTexture from 'phaser4-rex-plugins/plugins/clickboardtotexture.js';
Add clickboard-to-texture object
var clickboardToTexture = new ClickboardToTexture(scene);
Create instance¶
var clickboardToTexture = scene.plugins.get('rexClickboardToTexture').add(scene);
Destroy¶
clickboardToTexture.destroy();
Event¶
On paste
clickboardToTexture.on('paste', async function(clickboardToTexture) {
// await clickboardToTexture.saveTexturePromise(key);
// ...
})
Save texture¶
clickboardToTexture.saveTexture(key, onComplete);
onComplete : Callback invoked upon completion of texture saving.
or
await clickboardToTexture.saveTexturePromise(key);
Release clickboard data¶
clickboardToTexture.releaseFile();