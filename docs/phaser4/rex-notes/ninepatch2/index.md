Nine patch2
Introduction¶
Stretchable image. Has better performance than nine-patch.
Author: Rex
Game object
Live demos¶
3x3
Any size
Performance test
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexninepatch2plugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexninepatch2plugin.min.js', true);
Add nine-patch object
var ninePatch = scene.add.rexNinePatch2(x, y, width, height, key, baseFrame, columns, rows, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import NinePatch2Plugin from 'phaser4-rex-plugins/plugins/ninepatch2-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexNinePatch2Plugin',
plugin: NinePatch2Plugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add nine-patch object
var ninePatch = scene.add.rexNinePatch2(x, y, width, height, key, baseFrame, columns, rows, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import NinePatch2 from 'phaser4-rex-plugins/plugins/ninepatch2.js';
Add nine-patch object
var ninePatch = new NinePatch2(scene, x, y, width, height, key, baseFrame, columns, rows, config);
scene.add.existing(ninePatch);
Create instance¶
var ninePatch = scene.add.rexNinePatch2(x, y, width, height, key, baseFrame, columns, rows, {
// preserveRatio: true,
// maxFixedPartScale: 1,
// stretchMode: 0,
getFrameNameCallback: undefined
});
or
var ninePatch = scene.add.rexNinePatch2(x, y, width, height, key, columns, rows, {
// preserveRatio: true,
// maxFixedPartScale: 1,
// stretchMode: 0,
baseFrame: undefined,
getFrameNameCallback: undefined
});
or
var ninePatch = scene.add.rexNinePatch2(x, y, width, height, key, {
columns: undefined,
rows: undefined,
// preserveRatio: true,
// maxFixedPartScale: 1,
// stretchMode: 0,
baseFrame: undefined,
getFrameNameCallback: undefined
});
or
var ninePatch = scene.add.rexNinePatch2(x, y, width, height, {
key: undefined,
columns: undefined,
rows: undefined,
// preserveRatio: true,
// maxFixedPartScale: 1,
// stretchMode: 0,
baseFrame: undefined,
getFrameNameCallback: undefined
});
or
var ninePatch = scene.add.rexNinePatch2(x, y, {
width: 1, height: 1,
key: undefined,
columns: undefined,
rows: undefined,
// preserveRatio: true,
// maxFixedPartScale: 1,
// stretchMode: 0,
baseFrame: undefined,
getFrameNameCallback: undefined
});
or
var ninePatch = scene.add.rexNinePatch2({
x: 0, y: 0,
width: 1, height: 1,
key: undefined,
columns: undefined,
rows: undefined,
// preserveRatio: true,
// maxFixedPartScale: 1,
// stretchMode: 0,
baseFrame: undefined,
getFrameNameCallback: undefined
});
x, y : Position of this object.
width, height : Size of this object.
key : Texture key of source image.
baseFrame : Frame name of base texture.
undefined : Use default base frame '__BASE'.
columns : Configuration of columns.
A number array, like [20, 20, 20], or [20, undefined, 20] : Width of each column. undefined value will be replaced by remainder value from texture width.
Width of odd columns (column 0, column 2, ...) will be origin width.
Width of even columns (column 1, column 3, ...) will be stretched.
rows : Configuration of rows.
A number array, like [20, 20, 20], or [20, undefined, 20] : Height of each row. undefined value will be replaced by remainder value from texture width.
Height of odd rows (row 0, row 2, ...) will be origin height.
Height of odd rows (row 1, row 3, ...) will be stretched.
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
Else : return ${baseFrame}:${colIndex},${rowIndex}
Function object : Return a string, or undefined.
function(colIndex, rowIndex, baseFrame) {
return `${colIndex},${rowIndex}`;
}
Custom class¶
Define class
class MyNinePatch extends NinePatch2 {
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
Tint¶
Set tint
ninePatch.setTint(tint);
Set tint mode
ninePatch.setTintMode(tintMode);
Clear tint
ninePatch.clearTint();
Get tint
var tint = ninePatch.tint;
var tintMode = ninePatch.tintMode;
tintMode :
Phaser.TintModes.MULTIPLY
Phaser.TintModes.FILL
Phaser.TintModes.ADD
Phaser.TintModes.SCREEN
Phaser.TintModes.OVERLAY
Phaser.TintModes.HARD_LIGHT
Set texture of source image¶
ninePatch.setBaseTexture(key, baseFrame, columns, rows);
// ninePatch.setBaseTexture(key, columns, rows);
key : Texture key of source image.
baseFrame : Frame name of base texture.
undefined : Use default base frame '__BASE'. Default value.
columns : Configuration of columns.
A number array, like [20, 20, 20] : Width of each column.
Width of odd columns (column 0, column 2, ...) will be origin width.
Width of even columns (column 1, column 3, ...) will be stretched.
rows : Configuration of rows.
A number array, like [20, 20, 20] : Height of each row.
Height of odd rows (row 0, row 2, ...) will be origin height.
Height of odd rows (row 1, row 3, ...) will be stretched.
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
Compare with nine-patch¶
Nine-patch2 has better performance.
Nine-patch extends from render-texture, which will create a new texture, then draw frames on it.
Nine-patch2 draws frames directly.
Nine-patch2 does not have flip, crop methods.
Nine-patch2 can't apply custom spriteFx pipeline.