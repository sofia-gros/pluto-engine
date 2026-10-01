Canvas texture
Introduction¶
Canvas Texture stored in texture cache, built-in object of phaser.
Author: Phaser Team
Usage¶
Create canvas texture¶
var texture = scene.textures.createCanvas(key, width, height);
Get canvas element¶
var canvas = texture.getCanvas();
var context = texture.getContext();
Canvas api
Draw frame¶
texture.drawFrame(key, frame, x, y);
// texture.drawFrame(key, frame, x, y, update);
update : Update the internal ImageData buffer and arrays. Default value is true.
Draw image¶
texture.draw(x, y, source);
// texture.draw(x, y, source, update);
source : The HTML Image element, or HTML Canvas element to draw to this canvas.
update : Update the internal ImageData buffer and arrays. Default value is true.
Clear¶
texture.clear();
texture.clear(x, y, width, height);
// // texture.clear(x, y, width, height, update);
update : Update the internal ImageData buffer and arrays. Default value is true.
Refresh texture¶
texture.refresh();
Color¶
Set
texture.setPixel(x, y, red, green, blue);
// texture.setPixel(x, y, red, green, blue, alpha);
Get
var color = texture.getPixel(x, y);
// var color = texture.getPixel(x, y, color);
var colors = texture.getPixels(x, y, width, height);
colors : [{x, y, color, alpha}, ...]
Image data¶
Set
texture.putData(imageData, x, y);
Get
var imageData = texture.getData(x, y, width, height);
Add frame¶
texture.add(name, sourceIndex, x, y, width, height);
name : The name of this Frame. The name is unique within the Texture.
sourceIndex : The index of the TextureSource that this Frame is a part of.
x : The x coordinate of the top-left of this Frame.
y : The y coordinate of the top-left of this Frame.
width : The width of this Frame.
height : The height of this Frame.