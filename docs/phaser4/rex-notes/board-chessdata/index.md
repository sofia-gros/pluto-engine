Chess data
Introduction¶
Properties of chess, chess behavior of Board system.
Author: Rex
Behavior of chess
Usage¶
Add chess data object¶
Chess data will be added to game object via gameObject.rexChess once adding this game object to board, or attach any chess behavior.
Get chess data¶
var chessData = gameObject.rexChess;
Set tile Z¶
gameObject.rexChess.setTileZ(tileZ);
(tileX, tileY) won't be changed.
Get tile position¶
var tileXYZ = gameObject.rexChess.tileXYZ;
tileXYZ : Tile position {x,y,z}, return null if this chess is not added to any board.
Get board¶
var board = gameObject.rexChess.board;
board : Board object, or null if this chess is not added to any board.
See also
Blocker¶
Set
gameObject.rexChess.setBlocker();
Disable
gameObject.rexChess.setBlocker(false);
Get
var blocker = gameObject.rexChess.blocker;