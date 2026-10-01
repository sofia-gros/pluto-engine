Perlin
Introduction¶
Perlin2/Perlin3 noise and simplex2/simplex3 noise. (Reference)
Author: Rex
Method only
Live demos¶
Perlin2
Terrain generator
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexperlinplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexperlinplugin.min.js', true);
Add perlin noise object
var noise = scene.plugins.get('rexperlinplugin').add(seed);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import PerlinPlugin from 'phaser4-rex-plugins/plugins/perlin-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexPerlin',
plugin: PerlinPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add perlin noise object
var noise = scene.plugins.get('rexPerlin').add(seed);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import Perlin from 'phaser4-rex-plugins/plugins/perlin.js';
Add perlin noise object
var noise = new Perlin(seed);
Create noise instance¶
var noise = scene.plugins.get('rexPerlin').add(seed);
seed : A seed for this noise, like Math.random()
Perlin¶
Perlin2
var value = noise.perlin2(x, y);
value : -1 ~ 1
Perlin3
var value = noise.perlin3(x, y, z);
value : -1 ~ 1
Simplex¶
Simplex2
var value = noise.simplex2(x, y);
value : -1 ~ 1
Simplex3
var value = noise.simplex3(x, y, z);
value : -1 ~ 1
Set seed¶
noise.setSeed(seed);