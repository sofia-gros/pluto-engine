LZ string
Introduction¶
Compress string using LZ-based compression algorithm. Reference
Author: Rex
Member of scene
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexlzstringplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexlzstringplugin.min.js', true);
Add lz-string object
var lzstring = scene.plugins.get('rexlzstringplugin').add(config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import LZStringPlugin from 'phaser4-rex-plugins/plugins/lzstring-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexLZString',
plugin: LZStringPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add lz-string object
var lzstring = scene.plugins.get('rexLZString').add(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import LZString from 'phaser4-rex-plugins/plugins/lzstring.js';
Add lz-string object
var lzstring = new LZString(config);
Create instance¶
var lzstring = scene.plugins.get('rexLZString').add({
// encoding: 'none'     // 'none'|0, 'base64'|1, 'utf16'|2, 'uri'|3
});
encoding :
'none', or 0 : no encoding.
'base64', or 1 : base64 encoding.
'utf16', or 2 : UTF16 encoding.
'uri', or 3 : URI encoding.
Compression¶
var compressionResult = lzstring.compress(src);
Decompression¶
var decompressionResult = lzstring.decompress(compressionResult);
Set encoding¶
lzstring.setEncoding(m);  // 0|'none'|1|'base64'|2|'utf16'|3|'uri'