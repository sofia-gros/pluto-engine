Raycaster
Introduction¶
Raycaster between obstacles.
Author: Rex
Member of scene
Live demos¶
Reflaction
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexraycasterplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexraycasterplugin.min.js', true);
Add raycaster object
var raycaster = scene.plugins.get('rexraycasterplugin').add(config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import RaycasterPlugin from 'phaser4-rex-plugins/plugins/raycaster-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexRaycaster',
plugin: RaycasterPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add raycaster object
var raycaster = scene.plugins.get('rexRaycaster').add(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import Raycaster from 'phaser4-rex-plugins/plugins/raycaster.js';
Add raycaster object
var raycaster = new Raycaster(config);
Create instance¶
var raycaster = scene.plugins.get('rexRaycaster').add({
// maxRayLength: 10000
});
maxRayLength : Max length of ray.
Obstacle¶
Add¶
raycaster.addObstacle(gameObject);
// raycaster.addObstacle(gameObject, polygon);
polygon : A polygon.
undefined : Created polygon from 4 vertics of game object.
or
raycaster.addObstacle(gameObjects);
gameObjects : Array of game object.
Remove¶
raycaster.removeObstacle(gameObject);
gameObject : A game object, or an array of game objects.
Clear¶
raycaster.clearObstacle();
Update shape¶
raycaster.updateObstacle(gameObject);
// raycaster.updateObstacle(gameObject, polygon);
polygon : A polygon.
undefined : Created polygon from 4 vertics of game object.
Raycaster¶
var result = raycaster.rayToward(x, y, angle);
x, y : Emit ray from world-position.
angle : Emit ray toward to angle, in radian.
result :
false : Ray dose not hit any game object.
An object : Hit to a game object.
{
gameObject,
polygon,
segment,
x, y,
reflectAngle
}
gameObject : Hitting game object.
polygon : Polygon of hitting game object.
segment : Segment(line) of hitting polygon.
x, y : World position of hitting
reflectAngle : Reflect angle, in radian.
Reflection
Use result.x, result.y, result.reflectAngle for next reflection ray.
raycaster.rayToward(result.x, result.y, result.reflectAngle)