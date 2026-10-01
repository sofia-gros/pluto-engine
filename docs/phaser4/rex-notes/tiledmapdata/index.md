Tiled map data
Introduction¶
Parses a Tiled JSON object into a new MapData object.
Author: Phaser Team
Usage¶
var mapData = Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled(name, json, insertNull);
name : The name of the tilemap, used to set the name on the MapData.
json : The Tiled JSON object.
insertNull : Controls how empty tiles, tiles with an index of -1.
true : Empty locations will get a value of null.
false : Empty location will get a Tile object with an index of -1.
Map data¶
Map type¶
var mapType = mapData.orientation;
mapType : orthogonal, isometric, hexagonal
Map size¶
Grid size
var mapWidth = mapData.width;
var mapHeight = mapData.height;
Pixel size
var mapWidth = mapData.widthInPixels;
var mapHeight = mapData.heightInPixels;
Tile size¶
var tileWidth = mapData.tileWidth;
var tileHeight = mapData.tileHeight;
Layer¶
var layers = mapData.layers;
mapData.layers.forEach(function(layer){
var name = layer.name;
var alpha = layer.alpha;
var visible = layer.visible;
var x = layer.x;
var y = layer.y;
var width = layer.width;
var height = layer.height;
var data = layer.data;
layer.data.forEach(function(gid, index){
var tileX = index % width;
var tileY = Math.floor(index / width);
if (gid === -1) { // Empty
} else {
}
})
})