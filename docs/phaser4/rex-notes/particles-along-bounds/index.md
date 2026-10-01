Particles along bounds
Introduction¶
Emit particles along bounds of game object.
Author: Rex
Behavior of game object
Live demos¶
Particles-along-bounds
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexparticlesalongboundsplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexparticlesalongboundsplugin.min.js', true);
Start emit particles along bounds of game object
var particles = scene.plugins.get('rexparticlesalongboundsplugin').startEffect(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import DragPlugin from 'phaser4-rex-plugins/plugins/particlesalongbounds-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexParticlesAlongBounds',
plugin: ParticlesAlongBoundsPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Start emit particles along bounds of game object
var particles = scene.plugins.get('rexParticlesAlongBounds').startEffect(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import ParticlesAlongBounds from 'phaser4-rex-plugins/plugins/particlesalongbounds.js';
Start emit particles along bounds of game object
var particles = ParticlesAlongBounds(gameObject, config);
Create instance¶
var particles = scene.plugins.get('rexParticlesAlongBounds').startEffect(gameObject, {
textureKey: key,
// textureFrames: undefined,
// padding: 0,
// blendMode: 'ADD',
// lifespan: 1000,
// stepRate: 10,
// spread: 10,
// scale: undefined,
// alpha: undefined,
// tint: undefined,
// repeat: 0,
// gravityX: 0,
// gravityY: 0,
// duration: undefined
});
padding : Extra padded space around bounds of game object. Default is 0.
A number for left/right/top/bottom bounds,
Or a plain object.
{
left: 0,
right: 0,
top: 0,
bottom: 0
}
textureKey : Texture key of particles.
textureFrames : : One or more texture frames, or a configuration object.
String or number value.
Array of string or number value.
Configuration object :
{
frames: [],
cycle: false,
quantity: 1
}
blendMode : Blend mode of particles. Default value is ADD.
lifespan : Lifespan of particle.
stepRate : Step length between each particle's initial position along bounds of game object.
spread : Moving speed of particle.
scale : Scale changing of particle.
alpha : Alpha changing of particle.
tint : Tint changing of particle.
repeat : Fire particles around bounds repeatly.
0 : Fire particles around bounds one time, default value.
gravityX, gravityY : Gravity vector of world axis. This vector will rotate back if game object is rotated.
duration : Total duration from firing of 1st particle to destroy last particle.
undefined : Use default behavior of particles
Less or equal to lifespan : Fires all particles at begining.
Format of spread, scale, alpha, tint parameters :
{min, max} : Pick a random value between min and max
{start, end} : Pick values incremented continuously across a range. (ease='Linear')
{start, end, ease}
{start, end, steps} : Pick values incremented by steps across a range.
{start, end, random}
random: true or false
{min, max, steps} : Pick values between min to max, with steps.
{onEmit: function(particle, key, t, value) {return value}} : Get return value from a function invoking.
Is running¶
var isRunning = particles.isRunning;
Events¶
On fire completed, i.e. last particle is dead
particles.on('complete', function(gameObject, particles){
}, scope);