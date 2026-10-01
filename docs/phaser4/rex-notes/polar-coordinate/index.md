Polar-coordinate
Introduction¶
Attach polarOX, polarOY, polarRotation, polarAngle, and polarRadius properties to a game object.
Author: Rex
Method only
Live demos¶
Circle
Spiral
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexpolarcoordinateplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexpolarcoordinateplugin.min.js', true);
Attach polarOX, polarOY, polarRotation, polarAngle, and polarRadius properties.
scene.plugins.get('rexpolarcoordinateplugin').add(gameObject, ox, oy, rotation, radius);
gameObject.polarRadius = 200;
gameObject.polarAngle = -45;
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import PolarCoordinatePlugin from 'phaser4-rex-plugins/plugins/polarcoordinate-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexPolarCoordinate',
plugin: PolarCoordinatePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Attach polarOX, polarOY, polarRotation, polarAngle, and polarRadius properties.
scene.plugins.get('rexPolarCoordinate').add(gameObject, ox, oy, rotation, radius);
gameObject.polarRadius = 200;
gameObject.polarAngle = -45;
Import method¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import method
import AddPolarCoordinateProperties from 'phaser4-rex-plugins/plugins/polarcoordinate.js';
Attach polarOX, polarOY, polarRotation, polarAngle, and polarRadius properties.
AddPolarCoordinateProperties(gameObject, ox, oy, rotation, radius);
gameObject.polarOX = 400;
gameObject.polarOY = 300;
gameObject.polarRadius = 200;
gameObject.polarAngle = -45;
Attach properties¶
scene.plugins.get('rexPolarCoordinate').add(gameObject, ox, oy, rotation, radius);
gameObject.polarOX = 400;
gameObject.polarOY = 300;
gameObject.polarRadius = 200;
gameObject.polarAngle = -45;
ox, oy : Position of origin point.
rotation : Polar angle, in radian.
radius : Polar radius.
x = ( polarRadius * cos(polarRotation) ) + polarOX
y = ( polarRadius * sin(polarRotation) ) + polarOY
Circle¶
scene.tweens.add({
targets: gameObject,
polarAngle: 360,
duration: 3000
})