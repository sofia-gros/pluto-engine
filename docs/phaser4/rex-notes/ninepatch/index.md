Nine patch
Introduction¶
Stretchable image, extended from RenderTexture game object.
Author: Rex
Game object
Live demos¶
3x3, 3x3
5x5
Custom frame name
Custom base frame name
Preserve ratio
Max-fixed-part-scale
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexninepatchplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexninepatchplugin.min.js', true);
Add nine-patch object
var ninePatch = scene.add.rexNinePatch(x, y, width, height, key, baseFrame, columns, rows, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import NinePatchPlugin from 'phaser4-rex-plugins/plugins/ninepatch-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexNinePatchPlugin',
plugin: NinePatchPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add nine-patch object
var ninePatch = scene.add.rexNinePatch(x, y, width, height, key, baseFrame, columns, rows, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import NinePatch from 'phaser4-rex-plugins/plugins/ninepatch.js';
Add nine-patch object
var ninePatch = new NinePatch(scene, x, y, width, height, key, baseFrame, columns, rows, config);
scene.add.existing(ninePatch);
Create instance¶
var ninePatch = scene.add.rexNinePatch(x, y, width, height, key, baseFrame, columns, rows, {
// preserveRatio: true,
// maxFixedPartScale: 1,
// stretchMode: 0,
getFrameNameCallback: undefined
});
or
var ninePatch = scene.add.rexNinePatch(x, y, width, height, key, columns, rows, {
// preserveRatio: true,
// maxFixedPartScale: 1,
// stretchMode: 0,
baseFrame: undefined,
getFrameNameCallback: undefined
});
or
var ninePatch = scene.add.rexNinePatch(x, y, width, height, key, {
columns: undefined, // leftWidth: undefined, right: undefined,
rows: undefined,    // topHeight: undefined, bottomHeight: undefined,
// preserveRatio: true,
// maxFixedPartScale: 1,
// stretchMode: 0,
baseFrame: undefined,
getFrameNameCallback: undefined
});
or
var ninePatch = scene.add.rexNinePatch(x, y, width, height, {
key: undefined,
columns: undefined, // leftWidth: undefined, right: undefined,
rows: undefined,    // topHeight: undefined, bottomHeight: undefined,
// preserveRatio: true,
// maxFixedPartScale: 1,
// stretchMode: 0,
baseFrame: undefined,
getFrameNameCallback: undefined
});
or
var ninePatch = scene.add.rexNinePatch(x, y, {
width: 1, height: 1,
key: undefined,
columns: undefined, // leftWidth: undefined, right: undefined,
rows: undefined,    // topHeight: undefined, bottomHeight: undefined,
// preserveRatio: true,
// maxFixedPartScale: 1,
// stretchMode: 0,
baseFrame: undefined,
getFrameNameCallback: undefined
});
or
var ninePatch = scene.add.rexNinePatch({
x: 0, y: 0,
width: 1, height: 1,
key: undefined,
columns: undefined, // leftWidth: undefined, rightWidth: undefined,
rows: undefined,    // topHeight: undefined, bottomHeight: undefined,
// preserveRatio: true,
// maxFixedPartScale: 1,
// stretchMode: 0,
baseFrame: undefined,  // frame: undefined,
getFrameNameCallback: undefined
});
x, y : Position of this object.
width, height : Size of this object.
key : Texture key of source image.
baseFrame, or frame : Frame name of base texture.
undefined : Use default base frame '__BASE'.
columns : Configuration of columns.
A number array, like [20, 20, 20], or [20, undefined, 20] : Width of each column. undefined value will be replaced by remainder value from texture width.
Width of odd columns (column 0, column 2, ...) will be origin width.
Width of even columns (column 1, column 3, ...) will be stretched.
leftWidth, rightWidth : Set columns to [leftWidth, undefined, rightWidth], if columns is undefined.
rows : Configuration of rows.
A number array, like [20, 20, 20], or [20, undefined, 20] : Height of each row. undefined value will be replaced by remainder value from texture width.
Height of odd rows (row 0, row 2, ...) will be origin height.
Height of odd rows (row 1, row 3, ...) will be stretched.
topHeight, bottomHeight : Set rows to [topHeight, undefined, bottomHeight], if rows is undefined.
preserveRatio : Preserve ratio of fixed parts (i.e. displaying in origin size). Default is true.
maxFixedPartScale : Max scale value of fixed-part.
stretchMode : Stretch mode of edges and internal cells.
A number (0, or 1), or a string ('scale', or 'repeat'):
0, or 'scale' : Stretch each edge and internal cell by scaled image. Default value.
1, or 'repeat' : Stretch each edge and internal cell by repeated image (tile-sprite).
An object :
{
edge: 0, // 'scale', or 1, 'repeat'
internal: 0, // 'scale', or 1, 'repeat'
}
getFrameNameCallback : Callback to get frame name of each cell.
undefined : Use default callback.
If baseFrame is '__BASE' : return ${colIndex},${rowIndex}
Else : return ${baseFrame}_${colIndex},${rowIndex}
Function object : Return a string, or undefined.
function(colIndex, rowIndex, baseFrame) {
return `${colIndex},${rowIndex}`;
}
Custom class¶
Define class
class MyNinePatch extends NinePatch {
constructor(scene, x, y, width, height, key, baseFrame, columns, rows, config) {
super(scene, x, y, width, height, key, baseFrame, columns, rows, config);
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
var ninePatch = new MyNinePatch(scene, x, y, width, height, key, baseFrame, columns, rows, config);
Resize¶
ninePatch.resize(width, height);
Will update texture
Set base texture of source image¶
ninePatch.setBaseTexture(key, baseFrame, columns, rows);
or
ninePatch.setBaseTexture(key, baseFrame, leftWidth, rightWidth, topHeight, bottomHeight);
or
ninePatch.setBaseTexture(key, baseFrame);
key : Texture key of source image.
baseFrame : Frame name of base texture.
undefined, or null : Use default base frame '__BASE'. Default value.
columns : Configuration of columns.
A number array, like [20, 20, 20] : Width of each column.
Width of odd columns (column 0, column 2, ...) will be origin width.
Width of even columns (column 1, column 3, ...) will be stretched.
undefined : If columns and rows are undefined, it will use current configuration of columns and rows.
rows : Configuration of rows.
A number array, like [20, 20, 20] : Height of each row.
Height of odd rows (row 0, row 2, ...) will be origin height.
Height of odd rows (row 1, row 3, ...) will be stretched.
undefined : If columns and rows are undefined, it will use current configuration of columns and rows.
leftWidth, rightWidth : Set columns to [leftWidth, undefined, rightWidth].
topHeight, bottomHeight : Set rows to [topHeight, undefined, bottomHeight].
Will update texture
Set stretch mode¶
ninePatch.setStretchMode(mode);
mode :
A number (0, or 1), or a string ('scale', or 'repeat'):
0, or 'scale' : Stretch each edge and internal cell by scaled image. Default value.
1, or 'repeat' : Stretch each edge and internal cell by repeated image (tile-sprite).
An object :
{
edge: 0, // 'scale', or 1, 'repeat'
internal: 0, // 'scale', or 1, 'repeat'
}
Set get-frame-name callback¶
ninePatch.setGetFrameNameCallback(callback);
callback : Return a string, or undefined.
function(colIndex, rowIndex, baseFrame) {
return `${colIndex},${rowIndex}`
}
Fixed-part scale¶
Fixed-part scale
Get
var scaleX = ninePatch.fixedPartScaleX;
var scaleY = ninePatch.fixedPartScaleY;
Max fixed-part scale
Get
var scaleX = ninePatch.maxFixedPartScaleX;
var scaleY = ninePatch.maxFixedPartScaleY;
Set
ninePatch.setMaxFixedPartScale(scale);
// ninePatch.setMaxFixedPartScale(scaleX, scaleY);
or
ninePatch.maxFixedPartScaleX = scaleX;
ninePatch.maxFixedPartScaleY = scaleY;
Update texture¶
ninePatch.updateTexture();
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters
Compare with nine-slice¶
Nine-slice is a built-in game object.
Nine-slice has better render performance.
Nine-patch extends from render-texture, which will create a new texture, then draw frames on it.
Nine-slice is webgl mode only.
Nine-slice does not have flip, crop methods.