Random place
Introduction¶
Place objects randomly inside an area without overlapping.
Author: Rex
Methods
Live demos¶
Random place
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexrandomplaceplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexrandomplaceplugin.min.js', true);
Random place objects
scene.plugins.get('rexrandomplaceplugin').randomPlace(gameObjects, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import RandomPlacePlugin from 'phaser4-rex-plugins/plugins/randomplace-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexRandomPlace',
plugin: RandomPlacePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Random place objects
scene.plugins.get('rexRandomPlace').randomPlace(gameObjects, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import RandomPlace from 'phaser4-rex-plugins/plugins/randomplace.js';
Random place objects
RandomPlace(gameObjects, config);
Random place¶
scene.plugins.get('rexRandomPlace').randomPlace(gameObjects, {
radius: radius,
getPositionCallback: undefined,
area: areaGeomObject,
});
gameObjects : An array of gameObjects. Each item can be
A game objects.
A plain object contains
{
gameObject: gameObject,
radius: radius,
}
radius : Collision radius of this game object.
radius : Default collision radius of each game object.
getPositionCallback : A callback to get a random position.
undefined : Use area.getRandomPoint(out) as callback.
A function object :
function(out) {
out.x = 0;
out.y = 0;
}
area : A geom object, which has getRandomPoint method.
A circle : new Phaser.Geom.Circle(x, y, radius)
A rectangle : new Phaser.Geom.Rectangle(x, y, width, height)
A triangle : new Phaser.Geom.Triangle(x1, y1, x2, y2, x3, y3)
An ellipse : new Phaser.Geom.Ellipse(x, y, width, height)
undefined : A rectangle (0, 0, gameWidth, gameHeight)