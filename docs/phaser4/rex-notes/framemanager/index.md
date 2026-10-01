Frame manager
Introduction¶
Draw frames on canvas texture, or dynamic texture.
Author: Rex
Member of scene
Live demos¶
Paste text
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexframemanagerplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexframemanagerplugin.min.js', true);
Add frame-manager object
var frameManager = scene.plugins.get('rexframemanagerplugin').add(scene, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import FrameManagerPlugin from 'phaser4-rex-plugins/plugins/framemanager-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexFrameManager',
plugin: FrameManagerPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add frame-manager object
var frameManager = scene.plugins.get('rexFrameManager').add(scene, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { FrameManager } from 'phaser4-rex-plugins/plugins/framemanager.js';
Add frame-manager object
var frameManager = new FrameManager(scene, config);
Create instance¶
var frameManager = scene.plugins.get('rexFrameManager').add(scene, {
key: '',
width: 4096,
height: 4096,
cellWidth: 64,
cellHeight: 64,
cellPadding: 0,
columns: undefined,
rows: undefined,
fillColor: undefined,
useDynamicTexture: false,
});
key : Texture key in texture manager
width, height : Size of canvas.
Calculate width/height by columns/rows and cellWidth/cellHeight, if columns, rows parameters are given.
columns, rows :
undefined : Calculate columns/rows by width/height and cellWidth/cellHeight.
cellWidth, cellHeight : Maximum frame size.
cellPadding : Extra space around frame. Default value is 0.
Total cell width will be cellWidth + (cellPadding * 2)
Total cell height will be cellHeight + (cellPadding * 2)
fillColor : Fill an initial color, in css color string (for canvas-texture), or number (for dynamic-texture)
undefined : Don't fill color.
useDynamicTexture
false : Use canvas-texture. Default behavior.
true : Use dynamic-texture.
or
var frameManager = scene.plugins.get('rexFrameManager').add(scene, key, width, height, cellWidth, cellHeight, fillColor, useDynamicTexture);
Steps of generating bitmapfont :
Add frames :
frameManager.paste(frameName, gameObject);
Update texture
frameManager.updateTexture();
Export frame data to bitmapfont
frameManager.addToBitmapFont();
Add frame¶
From game object¶
After rendering content on text, bbcode text, canvas
frameManager.paste(frameName, gameObject);
frameName : Frame name.
gameObject :
Canvas-texture mode :
Game objects which has canvas, for example, text, bbcode text, or canvas.
Game objects which has frame, for example, image.
Dynamic-texture mode :
Any render-able game object except :
Graphics can't paste directly, because that Graphics game object does not have size.
Draw Graphics to RenderTexture, then paste this RenderTexture to frameMamager.
Draw multiple game objects : Draw game objects on RenderTexture, then paste this [RenderTexture]
Custom drawing¶
frameManager.draw(frameName, callback, scope);
frameName : Frame name.
callback :
Canvas-texture mode :
function(canvas, context, frameSize) {
// The maximum frame size
var cellWidth = frameSize.width;
var cellHeight = frameSize.height;
// Draw content in area of (0, 0) - (cellWidth, cellHeight)
// Update frame size
// frameSize.width = ...
// frameSize.height = ...
}
Dynamic-texture mode :
function(texture, frameSize) {
// The maximum frame size
var cellWidth = frameSize.width;
var cellHeight = frameSize.height;
// Draw content in area of (0, 0) - (cellWidth, cellHeight)
// Update frame size
// frameSize.width = ...
// frameSize.height = ...
}
Empty frame¶
frameManager.addEmptyFrame(frameName);
// frameManager.addEmptyFrame(frameName, width, height);
frameName : Frame name.
width : Frame width, default value is cellWidth
height : Frame height, default value is cellHeight
Update texture¶
Update texture after adding frames.
frameManager.updateTexture();
Remove frame¶
Remove a frame
frameManager.remove(frameName);
frameName : Frame name.
Remove all frames
frameManager.clear();
Remove frame data but won't clear texture image.
Export to bitmapfont¶
frameManager.addToBitmapFont();
Destroy instance¶
frameManager.destroy();