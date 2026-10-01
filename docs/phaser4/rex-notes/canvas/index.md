Canvas
Introduction¶
Drawing on canvas.
Author: Rex
Game object
Live demos¶
Kaleidoscope
chartjs
Resolution
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexcanvasplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcanvasplugin.min.js', true);
Add canvas object
var canvas = scene.add.rexCanvas(x, y, width, height);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import CanvasPlugin from 'phaser4-rex-plugins/plugins/canvas-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexCanvasPlugin',
plugin: CanvasPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add canvas object
var canvas = scene.add.rexCanvas(x, y, width, height);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import Canvas from 'phaser4-rex-plugins/plugins/canvas.js';
Add canvas object
var canvas = new Canvas(scene, x, y, width, height);
scene.add.existing(canvas);
Create instance¶
var canvas = scene.add.rexCanvas(x, y, width, height);
// var canvas = scene.add.rexCanvas(x, y, width, height, resolution);
Add canvas from JSON
var canvas = scene.make.rexCanvas({
x: 0,
y: 0,
width: 256,
height: 256,
// resolution: 1,
// origin: {x: 0.5, y: 0.5},
// fill: null,
add: true
});
resolution : The resolution the content is rendered to its internal canvas at. Default value is 1.
Custom class¶
Define class
class MyCanvas extends Canvas {
constructor(scene, x, y, width, height, resolution) {
super(scene, x, y, width, height, resolution);
// ...
scene.add.existing(this);
}
// ...
// preUpdate(time, delta) {}
}
scene.add.existing(gameObject) : Adds an existing Game Object to this Scene.
If the Game Object renders, it will be added to the Display List.
If it has a preUpdate method, it will be added to the Update List.
Create instance
var canvas = new MyCanvas(scene, x, y, width, height, resolution);
Clear or fill canvas¶
Clear
canvas.clear();
Fill color
canvas.fill(color);
Update canvas¶
Get canvas elemet
var canvasElem = canvas.getCanvas();
var context = canvas.getContext();
or
var canvaesElem = canvas.canvas;
var context = canvas.context;
Draw on context
Update display texture¶
Update texture when rendering
canvas.needRedraw();
or
canvas.dirty = true;
Update texture now
canvas.updateTexture();
or update canvas and texture
canvas.updateTexture(function(canvasElem, context) { });
// canvas.updateTexture(callback, scope);
Load or save texture¶
Save canvas to texuture
canvas.generateTexture(key);
// canvas.generateTexture(key, x, y, width, height);
Copy canvas from texture
canvas.loadTexture(key, frame);
Paste frame¶
canvas.drawFrame(key, frame);
// canvas.drawFrame(key, frame, dx, dy, dWidth, dHeight);
// canvas.drawFrame(key, frame, dx, dy, dWidth, dHeight, sxOffset, syOffset, sWidth, sHeight);
dx, dy : Top-left position in this canvas. Default value is 0, 0.
dWidth, dHeight : The size to draw the image in this canvas. Default value is origin size of frame.
sxOffset, syOffset : Offset position of source frame.  Default value is 0, 0
sWidth, sHeight : The size of the sub-rectangle of the source frame to draw into this canvas. Default value is origin size of frame.
Data URL¶
Load image from URL
canvas.loadFromURL(url);
// canvas.loadFromURL(url, callback);
or
canvas.loadFromURLPromise(url)
.then(function() {
})
url : Image url/uri(base64 string)
callback : Load complete callback.
Get data URL of image
var dataURL = canvas.getDataURL();
// var dataURL = canvas.getDataURL(type, encoderOptions);
dataURL : A base64 string.
type : A DOMString indicating the image format. The default format type is image/png.
encoderOptions : A Number between 0 and 1 indicating the image quality to use for image formats that use lossy compression such as image/jpeg and image/webp.
File¶
Load image from File object
canvas.loadFromFile(file);
// canvas.loadFromFile(file, callback);
or
canvas.loadFromFilePromise(file)
.then(function() {
})
file : File object
callback : Load complete callback.
Pixel color¶
Get color
var color = canvas.getPixel(x, y);
color : Color object
color.red, color.green, color.blue, color.alpha
Set color
canvas.setPixel(x, y, r, g, b);
// canvas.setPixel(x, y, r, g, b, a);
or
canvas.setPixel(x, y, color);
r, g, b, a : Integer number between 0 ~ 255.
color : Color object
Size¶
canvas.setCanvasSize(width, height);
or
canvas.setSize(width, height);
or
canvas.resize(width, height);
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters
Compare with Graphics object¶
Drawing method
This canvas object draws stuff on canvas in WEBGL or CANVAS render mode.
Graphics object draws stuff on webgl render pipeline in WEBGL render mode.
Size
This canvas object has size (width, height) and origin.
Graphics object does not have size and origin.