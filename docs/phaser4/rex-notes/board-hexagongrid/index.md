Hexagon
Introduction¶
Hexagon grid object of Board system.
Author: Rex
Grid object of board
Usage¶
Sample code
Create instance¶
var grid = scene.rexBoard.add.hexagonGrid({
x: 0,
y: 0,
cellWidth: 0,
cellHeight: 0,
// size: undefined,
staggeraxis: 1,
staggerindex: 1
});
or
// import { HexagonGrid } from 'phaser4-rex-plugins/plugins/board-components.js';
var grid = new HexagonGrid(config);
x, y : World position of origin tile (i.e. tileX = 0, tileY = 0)
cellWidth : The width of the cell, in pixels.
cellHeight : The height of the cell, in pixels.
size : Distance between center to each corner. Get cellWidth and cellHeight from size if this parameter is not undefined.
staggeraxis
0, or y
1, or x
staggerindex
0, or even
1, or odd
World position of tile (0, 0)¶
Get
var worldX = grid.x;
var worldY = grid.y;
Set
grid.setOriginPosition(worldX, worldY);
or
grid.x = worldX;
grid.y = worldY;
Cell size¶
Get
var width = grid.width;
var height = grid.height;
Set
grid.setCellSize(width, height);
or
grid.width = width;
grid.height = height;
or
grid.setCellRadius(size);
size : Distance between center to each corner.
Grid type¶
Get
var staggeraxis = grid.staggeraxis;
var staggerindex = grid.staggerindex;
Set
grid.setType(staggeraxis, staggerindex);
staggeraxis
0, or y
1, or x
staggerindex
0, or even
1, or odd
Get world position¶
var worldXY = grid.getWorldXY(tileX, tileY);  // worldXY: {x, y}
// var out = grid.getWorldXY(tileX, tileY, out);
Get tile position¶
var tileXY = grid.getTileXY(worldX, worldY);  // tileXY: {x, y}
// var out = grid.getTileXY(worldX, worldY, out);
Directions¶
staggeraxis = 0/y
0 : Down-right
1 : Down
2 : Down-left
3 : Up-left
4 : Up
5 : Up-right
staggeraxis = 1/x
0 : Right
1 : Down-right
2 : Down-left
3 : Left
4 : Up-left
5 : Up-right