Cut Jigsaw Image
Introduction¶
Cut image into pieces for jigsaw application.
Author: Rex
Method only
Live demos¶
Create pieces
Custom piece shape
Drag drop with pixelPerfect
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexcutjigsawimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcutjigsawimageplugin.min.js', true);
Cut image into pieces
var pieces = scene.plugins.get('rexcutjigsawimageplugin').gridCut(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import CutJigsawImagePlugin from 'phaser4-rex-plugins/plugins/cutjigsawimage-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexCutJigsawImage',
plugin: CutJigsawImagePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Cut image into pieces
var pieces = scene.plugins.get('rexCutJigsawImage').gridCut(gameObjects, config);
Import method¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import method
import CutJigsawImage from 'phaser4-rex-plugins/plugins/cutjigsawimage.js';
Cut image into pieces
var images = CutJigsawImage(gameObjects, config);
Create pieces¶
var pieces = scene.plugins.get('rexCutJigsawImage').gridCut(gameObject, {
piecesKey: ,
columns: ,
rows: ,
edgeWidth: ,
edgeHeight: ,
useDynamicTexture: false,
// drawShapeCallback: undefined,
// edges: undefined,
// createImageCallback: undefined,
// ImageClass: Phaser.GameObjects.Image,
// originX: 0.5,
// originY: 0.5,
// add: true,
// align: true,
// objectPool: undefined
});
gameObjects : Target game object which has a texture, ex Image, RenderTexture.
piecesKey : Store frame of each piece in this dynamic texture.
undefined : Use 'gameObjects.texture.key' + '_pieces' as texture key.
columns, rows : Cut texture in columns x rows grids
edgeWidth, edgeHeight : Padding around piece.
useDynamicTexture : Generate frame of pieces on dynamic texture or canvas texture.
false : Generate frame of pieces on canvas texture. Default value.-
Set useDynamicTexture to false when using pixelPerfect interactive mode.
piece
.setInteractive({
draggable: true,
pixelPerfect: true
})
.on('drag', function (pointer, dragX, dragY) {
piece.setPosition(dragX, dragY);
piece.scene.children.bringToTop(piece);
})
true : Generate frame of pieces on dynamic texture.
drawShapeCallback : Callback of creating piece shape
undefined : Use default piece shape.
A function object
function(graphics, width, height, edgeWidth, edgeHeight, edgeMode) {
}
graphics : Graphics game object, or canvas.
Draw piece shape on a Graphics game object, if useDynamicTexture is set to true
Draw piece shape on canvas, if useDynamicTexture is set to false
width, height : Frame size of this piece
edgeWidth, edgeHeigh : Padding around piece.
edgeMode :
{
left: 0,   // 0|1|2
right: 0,  // 0|1|2
top: 0,    // 0|1|2
bottom: 0  // 0|1|2
}
left, right, top, bottom
0 : Flat edge
1 : Convex edge
2 : Concave edge
edges : edgeMode in a 2d array for each piece
undefined : Create random edges for each piece.
createImageCallback : Custom callback to return an image game object, optional.
function(scene, texture, frame) {
return gameObject;
}
texture : A texture object.
frame : Frame name.
ImageClass : Create image game object from this class. Default value is built-in Image class. Used when createImageCallback is undefined.
originX, originY : Origin of created image game objects
add :
true : Add these created image game objects to scene. Default value.
false : Don't add created image game objects to scene.
align :
true : Align position of created image game objects to target game object (gameObjects). Default value when add is set to true.
false : Don't set position of created image game objects. Default value when add is set to false.
objectPool : An array of image game objects, will reuse image game objects from this pool. Optional.
pieces : Return piece game objects.
Size of any piece game object (frame size) :
width : (gameObjects.width / columns) + (2 * edgeWidth)
height : (gameObjects.height / rows) + (2 * edgeHeigh)
Frame name of a piece game object : columnIndex + ',' + rowIndex