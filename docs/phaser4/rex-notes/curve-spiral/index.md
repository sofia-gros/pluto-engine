Spiral curve
Introduction¶
Spiral curve.
Author: Rex
Curve object
Live demos¶
Spiral curve
Particles along spiral curve
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexspiralcurveplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexspiralcurveplugin.min.js', true);
Add spiral curve object
var spiral = scene.plugins.get('rexspiralcurveplugin').add(config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import SpiralCurvePlugin from 'phaser4-rex-plugins/plugins/spiralcurve-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexSpiralCurve',
plugin: SpiralCurvePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add spiral curve object
var spiral = scene.plugins.get('rexSpiralCurve').add(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import SpiralCurve from 'phaser4-rex-plugins/plugins/spiralcurve.js';
Add spiral curve object
var spiral = new SpiralCurve(config);
Create shape¶
All properties
var spiral = scene.plugins.get('rexSpiralCurve').add({
// Origin point
// Ease origin point
// startX:0, endX: 0, easeX: 'Linear',
// startY:0, endY: 0, easeY: 'Linear',
// Fixed point
// x, y,
// x-radius
// startXRadius: 0, endXRadius, easeXRadius: 'Linear',
// y-radius
// startYRadius: 0, endYRadius, easeYRadius: 'Linear',
// start-end radius
// startRadius, endRadiux
// angle
// startAngle: 0, endAngle: 360, easeAngle: 'Linear',
// rotation: 0
});
Origin point
startX, endX, easeX, startY, endY, easeY : Ease origin point.
easeX, easeY : Ease equation, default value is 'Linear'.
x, y : Fixed origin point, i.e. start point is equal to end point.
Radius
startXRadius, endXRadius, easeXRadius : Ease x-radius.
easeXRadius : Ease equation, default value is 'Linear'.
startYRadius, endYRadius, easeYRadius : Ease y-radius.
easeYRadius : Ease equation, default value is 'Linear'.
startRadius, endRadiux :
Set startXRadius, and startYRadius to startRadius.
Set endXRadius, and endYRadius to endRadius.
Angle
startAngle, endAngle, easeAngle : Ease angle, in degrees.
easeAngle : Ease equation, default value is 'Linear'.
rotation : Rotate curve.
Simple spiral curve
var spiral = scene.plugins.get('rexSpiralCurve').add(x, y, startRadius, endRadius, startAngle, endAngle, rotation);
x : Set startX, endX to x, and easeX to 'Linear'.
y : Set startY, endY to y, and easeY to 'Linear'.
startRadius : Set startXRadius, startYRadius to startRadius
endRadius : Set endXRadius, endYRadius to endRadius, and easeXRadius, easeYRadius to Linear.
Set easeAngle to 'Linear'
Properties¶
Origin point
Get
var startX = spiral.startX;
var startY = spiral.startY;
var endX = spiral.endX;
var endY = spiral.endY;
or
var startPoint = spiral.p0; // {x, y}
var endPoint = spiral.p1; // {x, y}
Set
spiral.setStartX(x);
spiral.setStartY(y);
spiral.setEndX(x);
spiral.setEndY(y);
or
spiral.startX = x;
spiral.startY = y;
spiral.endX = x;
spiral.endY = y;
Radius
Get
var startXRadius = spiral.startXRadius;
var startYRadius = spiral.startYRadius;
var endXRadius = spiral.endXRadius;
var endYRadius = spiral.endYRadius;
Set
spiral.setStartXRadius(startXRadius);
spiral.setStartYRadius(startYRadius);
spiral.setEndXRadius(endXRadius);
spiral.setEndYRadius(endYRadius);
or
spiral.startXRadius = startXRadius;
spiral.startYRadius = startYRadius;
spiral.endXRadius = endXRadius;
spiral.endYRadius = endYRadius;
Angle, in degrees.
Get
var startAnlge = spiral.startAngle;
var endAnlge = spiral.endAngle;
Set
spiral.setStartAngle(startAnlge);
spiral.setEndAngle(endAnlge);
spiral.startAngle = startAnlge;
spiral.endAngle = endAnlge;
Other methods¶
See path