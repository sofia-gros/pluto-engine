XOR
Introduction¶
Encrypt or decrypt string by XOR algorithm.
Author: Rex
Methods
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexxorplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexxorplugin.min.js', true);
Encrypt, or decrypt
var encResult = scene.plugins.get('rexxorplugin').Encrypt(src, pwd);
var decResult = scene.plugins.get('rexxorplugin').Decrypt(encResult, pwd);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import XORPlugin from 'phaser4-rex-plugins/plugins/xor-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexXOR',
plugin: XORPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Encrypt, or decrypt
var encResult = scene.plugins.get('rexXOR').Encrypt(src, pwd);
var decResult = scene.plugins.get('rexXOR').Decrypt(encResult, pwd);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import XOR from 'phaser4-rex-plugins/plugins/xor.js';
Encrypt, or decrypt
var encResult = XOR.Encrypt(src, pwd);
var decResult = XOR.Decrypt(encResult, pwd);
Encrypt¶
var encResult = scene.plugins.get('rexXOR').Encrypt(src, pwd);
Decrypt¶
var decResult = scene.plugins.get('rexXOR').Decrypt(encResult, pwd);