Rhombus
Introduction¶
Rhombus shape and methods, extends from Polygon geometry object.
Author: Rex
Geometry object
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexrhombusplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexrhombusplugin.min.js', true);
Add rhombus geometry object
var rhombus = scene.plugins.get('rexrhombusplugin').add(x, y, width, height);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import RhombusPlugin from 'phaser4-rex-plugins/plugins/rhombus-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexRhombus',
plugin: RhombusPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add rhombus geometry object
var rhombus = scene.plugins.get('rexRhombus').add(x, y, width, height);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import Rhombus from 'phaser4-rex-plugins/plugins/rhombus.js';
Add rhombus geometry object
var rhombus = new Rhombus(x, y, width, height);
Create shape¶
var rhombus = scene.plugins.get('rexRhombus').add(x, y, width, height);
or
var rhombus = scene.plugins.get('rexRhombus').add({
x: 0,
y: 0,
width: 40,
height: 20
});
or
var rhombus = new rexRhombus(x, y, width, height);
// var rhombus = new Phaser.Geom.rexRhombus(x, y, width, height);
x : Top X.
y : Left Y.
Draw on graphics¶
See Polygon shape.
Set properties¶
All properties
rhombus.setTo(x, y, width, height);
Position
rhombus.setPosition(x, y);
or
rhombus.x = 0;
rhombus.y = 0;
or
rhombus.left = 0;       // rhombus.x
rhombus.top = 0;        // rhombus.y
rhombus.right = 0;      // rhombus.x
rhombus.bottom = 0;     // rhombus.y
Size
rhombus.setSize(width, height);
or
rhombus.width = width;
rhombus.height = height;
Get properties¶
See Polygon shape.
Position
Center
var centerX = rhombus.centerX;
var centerY = rhombus.centerY;
Bound
var top = rhombus.top;
var left = rhombus.left;
var right = rhombus.right;
var bottom = rhombus.bottom;
Width
var width = rhombus.width;
Height
var width = rhombus.height;
Lines around rhombus
var edge01 = rhombus.getLineA();
var edge12 = rhombus.getLineB();
var edge23 = rhombus.getLineC();
var edge34 = rhombus.getLineD();
or
var edge = rhombus.getEdge(edgeIdx);
// var out = rhombus.getEdge(edgeIdx, out);
Point(s) & shape¶
See Polygon shape.