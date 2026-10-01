Hexagon
Introduction¶
Hexagon shape and methods, extends from Polygon geometry object.
Author: Rex
Geometry object
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexhexagonplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexhexagonplugin.min.js', true);
Add hexagon geometry object
var hexagon = scene.plugins.get('rexhexagonplugin').add(x, y, size, orientationType);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import HexagonPlugin from 'phaser4-rex-plugins/plugins/hexagon-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexHexagon',
plugin: HexagonPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add hexagon geometry object
var hexagon = scene.plugins.get('rexHexagon').add(x, y, size, orientationType);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import Hexagon from 'phaser4-rex-plugins/plugins/hexagon.js';
Add hexagon geometry object
var hexagon = new Hexagon(x, y, size, orientationType);
Create shape¶
var hexagon = scene.plugins.get('rexHexagon').add(x, y, size, orientationType);
or
var hexagon = scene.plugins.get('rexHexagon').add({
x: 0,
y: 0,
size: 20,
orientationType: 0     // 0|'flat'|'vertical'|1|'pointy'|'horizontal'
});
or
var hexagon = new Phaser.Geom.rexHexagon(x, y, size, orientationType);
x : Center X.
y : Center Y.
size : Distance between center to each corner.
orientationType : See here
0, 'flat', or 'y'
1, 'pointy' or ,'x'
Draw on graphics¶
See Polygon shape.
Set properties¶
All properties
hexagon.setTo(x, y, size, orientationType);
Position
hexagon.setPosition(x, y);
or
hexagon.x = 0;
hexagon.y = 0;
or
hexagon.centerX = 0;  // equal to hexagon.x
hexagon.centerY = 0;  // equal to hexagon.y
or
hexagon.left = 0;       // hexagon.x
hexagon.top = 0;        // hexagon.y
hexagon.right = 0;      // hexagon.x
hexagon.bottom = 0;     // hexagon.y
Size
hexagon.setSize(size);
or
hexagon.size = size;
Orientation type
hexagon.setType(orientationType);
or
hexagon.orientationType = orientationType;
orientationType : See here
0, 'flat', or 'y'
1, 'pointy' or ,'x'
Get properties¶
See Polygon shape.
Position
Center
var centerX = hexagon.centerX;
var centerY = hexagon.centerY;
or
var centerX = hexagon.x;
var centerY = hexagon.y;
Bound
var top = hexagon.top;
var left = hexagon.left;
var right = hexagon.right;
var bottom = hexagon.bottom;
Width
var width = hexagon.width;
Height
var width = hexagon.height;
Lines around hexagon
var edge01 = hexagon.getLineA();
var edge12 = hexagon.getLineB();
var edge23 = hexagon.getLineC();
var edge34 = hexagon.getLineD();
var edge45 = hexagon.getLineE();
var edge50 = hexagon.getLineF();
// var out = hexagon.getLineF(out);
or
var edge = hexagon.getEdge(edgeIdx);
// var out = hexagon.getEdge(edgeIdx, out);
Point(s) & shape¶
See Polygon shape.