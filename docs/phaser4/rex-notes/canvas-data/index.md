Canvas image data
Introduction¶
Get image data from texture, or text object.
Author: Rex
Method only
Live demos¶
Text to bit-map
Texture to color-map
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexcanvasdataplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcanvasdataplugin.min.js', true);
Add canvas-data object
var canvasData = scene.plugins.get('rexcanvasdataplugin').canvasObjectToBitmap(gameObject);
var canvasData = scene.plugins.get('rexcanvasdataplugin').textureTColorMap(textureKey, frameName);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import CanvasDataPlugin from 'phaser4-rex-plugins/plugins/canvasdata-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexCanvasData',
plugin: CanvasDataPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add canvas-data object
var canvasData = scene.plugins.get('rexCanvasData').canvasObjectToBitmap(gameObject);
var canvasData = scene.plugins.get('rexCanvasData').textureTColorMap(textureKey, frameName);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import CanvasData from 'phaser4-rex-plugins/plugins/canvasdata.js';
Add canvas-data object
var canvasdata = CanvasData.canvasObjectToBitmap(gameObject);
var canvasdata = CanvasData.textureTColorMap(textureKey, frameName);
Text/canvas object -> Bitmap¶
var canvasData = scene.plugins.get('rexCanvasData').canvasObjectToBitmap(gameObject);
// var out = scene.plugins.get('rexCanvasData').canvasObjectToBitmap(gameObject, out);
gameObject :
Any kind of text object : Text object, bbcode text object, or tag text object.
Canvas object
For each pixel data
canvasData.forEach(function(value, x, y, canvasData){
}, scope);
value : true, or false
Texture -> Color map¶
Texture -> Color map
var canvasData = scene.plugins.get('rexCanvasData').textureTColorMap(textureKey, frameName);
// var out = scene.plugins.get('rexCanvasData').canvasObjectToBitmap(textureKey, frameName, out);
Texture of game object -> Color map
var canvasData = scene.plugins.get('rexCanvasData').textureTColorMap(gameObject);
// var out = scene.plugins.get('rexCanvasData').canvasObjectToBitmap(gameObject, out);
For each pixel data
canvasData.forEach(function(value, x, y, canvasData){
}, scope);
value : Color32 integer = color integer + (alpha << 24)
Get color integer (0 ~ 0xffffff)
var color = value & 0xffffff;
or
var color = canvasData.color32ToColorInt(value);
Get alpha (0 ~ 0xff)
var alpha = value >>> 24;
var alpha = canvasData.color32ToAlpha(value);
Canvas data¶
For each pixel¶
For each pixel data
canvasData.forEach(callback, scope);
callback : Callback for each pixel
function(value, x, y, canvasData) {
}
For each non zero pixel data
canvasData.forEachNonZero(callback, scope);
Get pixel data¶
var data = canvasData.get(x, y);
data :
true, or false in result of canvasObjectToBitmap method
Color32 in result of textureTColorMap method
Size¶
var width = canvasData.width;
var height = canvasData.height;