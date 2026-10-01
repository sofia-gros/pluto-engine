Frame manager pool
Introduction¶
Draw frames on canvas texture, or dynamic texture. It maintains a list of frame manager, to support unlimited frames.
Author: Rex
Member of scene
Live demos¶
Pool
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexframemanagerplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexframemanagerplugin.min.js', true);
Add frame-manager object
var frameManagerPool = scene.plugins.get('rexframemanagerplugin').addPool(scene, config);
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
var frameManagerPool = scene.plugins.get('rexFrameManager').addPool(scene, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { FrameManagerPool } from 'phaser4-rex-plugins/plugins/framemanager.js';
Add frame-manager object
var frameManagerPool = new FrameManagerPool(scene, config);
Create instance¶
var frameManagerPool = scene.plugins.get('rexFrameManager').addPool(scene, {
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
key :
A callback to generate texture key (ref: texture manager)
function(index) {
return key + index.toString();
}
A string to generate texture key by ${key}_${index}
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
var frameManagerPool = scene.plugins.get('rexFrameManager').addPool(scene, key, width, height, cellWidth, cellHeight, fillColor, useDynamicTexture);
Steps of generating bitmapfont :
Add frames :
frameManagerPool.paste(frameName, gameObject);
Update texture
frameManagerPool.updateTexture();
Warning
Frame manager pool can't export date to bitmapfont
Add frame¶
From game object¶
After rendering content on text, bbcode text, canvas
frameManagerPool.paste(frameName, gameObject);
frameName : Frame name.
gameObject :
Canvas-texture mode :
Game objects which has canvas, for example, text, bbcode text, or canvas.
Dynamic-texture mode :
Any render-able game object except :
Graphics can't paste directly, because that Graphics game object does not have size.
Draw Graphics to RenderTexture, then paste this RenderTexture to frameMamager.
Draw multiple game objects : Draw game objects on RenderTexture, then paste this [RenderTexture]
Get textrure key of last pasting action
var key = frameManagerPool.lastKey;
Custom drawing¶
frameManagerPool.draw(frameName, callback, scope);
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
Get textrure key of last pasting action
var key = frameManagerPool.lastKey;
Empty frame¶
frameManagerPool.addEmptyFrame(frameName);
// frameManagerPool.addEmptyFrame(frameName, width, height);
frameName : Frame name.
width : Frame width, default value is cellWidth
height : Frame height, default value is cellHeight
Get textrure key of last pasting action
var key = frameManagerPool.lastKey;
Update texture¶
Update texture after adding frames, for Canvas-texture mode.
frameManagerPool.updateTexture();
Do nothing in Dynamic-texture mode.
Remove frame¶
Remove a frame
frameManagerPool.remove(frameName);
frameName : Frame name.
Remove all frames
frameManagerPool.clear();
Remove frame data but won't clear texture image.
Get texture key¶
Get all texture keys used by frame managers
var keys = frameManagerPool.keys;
or
var keys = frameManagerPool.getKeys();
Get texture key by frameName
var key = frameManagerPool.getKey(frameName);
Destroy instance¶
frameManagerPool.destroy();