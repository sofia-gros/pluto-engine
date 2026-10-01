Particles
Introduction¶
Particles uses its own lightweight physics system, and can interact only with its Emitter's bounds and zones. Built-in game object of phaser.
Author: Phaser Team
Note
API is not compatible with 3.55.x
Usage¶
Load texture¶
scene.load.image(key, url);
Reference: load image
Add particle¶
var particles = scene.add.particles(x, y, texture, {
// EmitterOp
accelerationX: 0,
accelerationY: 0,
alpha: 1,
angle: { min: 0, max: 360 },
bounce: 0,
color: undefined,
delay: 0,
hold: 0,
lifespan: 1000,
maxVelocityX: 10000,
maxVelocityY: 10000,
moveToX: 0,
moveToY: 0,
quantity: 1,
rotate: 0,
scaleX: 1,
scaleY: 1,
// scale:
speedX: 0,
speedY: 0,
speed:
tint: 0xffffff,
x: 0,
y: 0,
// Emitter properties
active:
advance:
blendMode:
colorEase:
deathCallback:
deathCallbackScope:
duration:
emitCallback:
emitCallbackScope:
// callbackScope
frequency:
gravityX:
gravityY:
maxAliveParticles:
maxParticles:
name:
emitting:
particleBringToTop:
particleClass:
radial:
sortCallback:
sortOrderAsc:
sortProperty:
stopAfter:
tintMode:
timeScale:
trackVisible:
visible:
// Position
// emitZone : random-zone, edge-zone
// random-zone
emitZone: {
type: 'random',
source: geom,
},
// edge-zone
emitZone:{
type: 'edge',
source: geom,
quantity: 1,
stepRate: 0,
total: -1,
yoyo: false,
seamless: true
},
deathZone: {
type: 'onEnter', // 'onEnter', or 'onLeave'
source: geom,
},
bounds:               // {x, y, w, h}, or {x, y, width, height}, or Phaser.Geom.Rectangle
collideLeft: true,
collideRight: true,
collideTop: true,
collideBottom: true,
follow:
followOffset:{
x: 0,
y: 0
},
// Texture
texture:
frame:
anim: [],  // string, or array of string
reserve: 0,
advance: 0
});
Parameters of EmitterOp : Number, Random Array, Custom Callback, Stepped start/end, Eased start/end, min/max, Random object, Custom onEmit onUpdate, Interpolation
A number
{min, max} : Pick a random value between min and max
{min, max, int}
{start, end} : Pick values incremented continuously across a range. (ease='Linear')
{start, end, ease}
{start, end, ease, easeParams}
{start, end, steps} : Pick values incremented by steps across a range.
{start, end, steps, yoyo: true}
{start, end, random}
random: true or false
{random: [start, end]} : Pick a random number between start and and.
[a, b, c, d] : Pick a random number from an array.
{min, max, steps} : Pick values between min to max, with steps.
{ values: [ a, b, c, d ], interpolation: 'catmull', ease: 'linear' } : Interpolation (linear, bezier, catmull) in values array.
function(particle, key, t, value) { return value; }
{onEmit, onUpdate} : Get return value from a function invoking.
function(particle, key, t, value) {
return value;
}
active : Whether this emitter updates itself and its particles.
false : Equal to pause.
advance : If you wish to fast forward the emitter in time, set this value to a number representing the amount of ms the emitter should advance.
blendMode : See blend mode
colorEase : The string-based name of the Easing function to use if you have enabled Particle color interpolation via the color property, otherwise has no effect.
deathCallback, deathCallbackScope
function(particle) {
}
emitCallback, emitCallbackScope
function(particle, emitter) {
}
duration : Limit the emitter to emit particles for a maximum of duration ms.
0 : Forever, default behavior.
follow : A Game Object whose position is used as the particle origin.
followOffset : The offset of the particle origin from thefollow target.
frequency
0 : One particle flow cycle for each logic update (the maximum flow frequency).
> 0 : The time interval between particle flow cycles in ms.
-1 : Exploding emitter.
hold : Frozen or 'held in place' after it has finished its lifespan for a set number of ms
gravityX, gravityY
maxAliveParticles
maxParticles
0 : Unlimited.
> 0 : Hard limit the amount of particle objects.
frames : One or more texture frames, or a configuration object.
String or number value
Array of string or number value
Configuration object :
{
frames: [],
cycle: false,
quantity: 1
}
anim :
String
Array of string
Configuration object :
{
anim: [],  // Array of string
cycle: false,
quantity: 1
}
particleBringToTop :
true : Newly emitted particles are added to the top of the particle list, i.e. rendered above those already alive. Default behavior.
sortCallback : The callback used to sort the particles.
sortProperty : Optionally sort the particles before they render based on this property. The property must exist on the Particle class, such as y, lifeT, scaleX, etc.
sortOrderAsc : When sortProperty is defined this controls the sorting order, either ascending or descending.
stopAfter : The Particle Emitter will stop emitting particles once this total has been reached. It will then enter a 'stopped' state, firing the STOP event.
radial : A radial emitter will emit particles in all directions between angle min and max,
emitting : Controls if the emitter is currently emitting a particle flow (when frequency >= 0).
Already alive particles will continue to update until they expire.
false : Equal to stop
tintMode :
timeScale : The time rate applied to active particles, affecting lifespan, movement, and tweens. Values larger than 1 are faster than normal.
trackVisible : Whether the emitter's visible state will track the follow target's visibility state.
emitZone :
Emit zone
{
type: 'random',
source: geom,
}
Emit edge
{
type: 'edge',
source: curve,
quantity: 1,
stepRate: 0,
yoyo: false,
seamless: true
}
deathZone
{
type: 'onEnter', // 'onEnter', or 'onLeave'
source: geom
}
bounds : {x, y, w, h}, or {x, y, width, height}, or Rectangle.
collideLeft, collideRight, collideTop, collideBottom : Whether particles interact with the left/right/top/bottom edge of the bounds.
name
particleClass
Control¶
Start
emitter.start();
// emitter.start(advance, duration);
advance : Advance this number of ms in time through the emitter.
duration : Limit this emitter to only emit particles for the given number of ms. Setting this parameter will override any duration already set in the Emitter configuration object.
Stop
emitter.stop();
// emitter.stop(kill);
kill :
true : Kill all particles immediately
false : Leave them to die after their lifespan expires. Default behavior.
Pause
emitter.pause();  // set `active` to false
Resume
emitter.resume();  // set `active` to true
Starts (or restarts) a particle flow.
emitter.flow(frequency, count, stopAfter);
frequency :
>= 0 : The time interval of each flow cycle, in ms
-1 : Explosion mode.
count : The number of particles to emit at each flow cycle.
stopAfter : Stop this emitter from firing any more particles once this value is reached.
Setting this parameter will override any stopAfter value already set in the Emitter configuration object.
0 : Unlimited
Explode : Puts the emitter in explode mode (frequency = -1), stopping any current particle flow, and emits several particles all at once.
emitter.explode();
// emitter.explode(count, x, y);
count : The number of Particles to emit.
x, y : The x, y coordinate to emit the Particles from.
Emit : Emits particles at the given position. If no position is given, it will emit from this Emitters current location.
emitter.emitParticleAt();
// emitter.emitParticleAt(x, y, count);
or
emitter.emitParticle(count, x, y);
count : The number of Particles to emit.
x, y : The x, y coordinate to emit the Particles from.
Fast forward
emitter.fastForward(time, delta);
time : The number of ms to advance the Particle Emitter by.
delta : The amount of delta to use for each step. Defaults to 1000 / 60.
Kill all alive particles
emitter.killAll()
Follow target¶
Start
emitter.startFollow(target);
// emitter.startFollow(target, offsetX, offsetY, trackVisible);
target : The Game Object to follow.
offsetX, offsetY : Horizontal/vertical offset of the particle origin from the Game Object.
trackVisible : Whether the emitter's visible state will track the target's visible state.
Stop
emitter.stopFollow();
Frame¶
emitter.setEmitterFrame(frames);
// emitter.setEmitterFrame(frames, pickRandom, quantity);
- frames : One or more texture frames, or a configuration object.
- String or number value
- Array of string or number value
- Configuration object :
{
frames: [],
cycle: false,
quantity: 1
}
- pickRandom :
- true : Whether frames should be assigned at random from frames. Default behavior.
- quantity : The number of consecutive particles that will receive each frame. Default value is 1.
Animation¶
emitter.setAnim(anims);
// emitter.setAnim(anims, pickRandom, quantity);
- anims : One or more animations, or a configuration object.
- String
- Array of string
- Configuration object :
{
anims: [],
cycle: false,
quantity: 1
}
- anims : One or more animations names, or Play Animation Config objects.
- String
- Array of string
- Animation config
- Array of Animation config
- pickRandom :
- true : Whether frames should be assigned at random from frames. Default behavior.
- quantity : The number of consecutive particles that will receive each frame. Default value is 1.
Particle¶
Speed
emitter.setParticleSpeed(x, y);
or
emitter.speedX = x;
emitter.speedY = y;
Changes the emitter from radial to a point emitter
Bounce
emitter.bounce = value;
0 : No bounce
1 : Full rebound
Max velocity
emitter.maxVelocityX = x;
emitter.maxVelocityY = y;
Gravity
emitter.setParticleGravity(x, y);
or
emitter.gravityX = x;
emitter.gravityY = y;
Acceleration
emitter.accelerationX = x;
emitter.accelerationY = y;
Lifespan : Sets the lifespan of newly emitted particles in milliseconds.
emitter.setParticleLifespan(time);
or
emitter.lifespan = time
The number of milliseconds to wait after emission before the particles start updating.
emitter.delay = time;
The number of milliseconds to wait after a particle has finished its life before it will be removed.
emitter.hold = time;
Tint
emitter.setParticleTint(tint);
or
emitter.particleTint = tint;
Webgl only
Color
emitter.particleColor = color;   // WebGL only.
emitter.colorEase = easeName;
Webgl only
Alpha
emitter.setParticleAlpha(alpha);
or
emitter.setAlpha(alpha);
or
emitter.particleAlpha = alpha;
Scale : Sets the vertical and horizontal scale of the emitted particles.
emitter.setParticleScale(x, y);
or
emitter.setScale(x, y);
or
emitter.particleScaleX = x;
emitter.particleScaleY = y;
Position
emitter.particleX = x;
emitter.particleY = y;
Position to move toward
emitter.moveToX = x;
emitter.moveToY = y;
The angle at which the particles are emitted.
emitter.particleAngle = angle;  // degrees
The rotation (or angle) of each particle when it is emitted.
emitter.particleRotate = rotation; // degrees
The number of particles that are emitted each time an emission occurs
emitter.quantity = quantity;
Hard limit the amount of particle objects
var count = emitter.maxParticles;
Whether this emitter is at its limit
var atLimit = emitter.atLimit();
Alive (active) particles
Amount of alive particles
var count = emitter.getAliveParticleCount();
or
var count = emitter.alive.length;
Add callback for newly emitted particle
var callback = function(particle, emitter) { /* ... */ }
emitter.onParticleEmit(callback, context);
Clear callback
emitter.onParticleEmit();
For each alive particle
var callback = function(particle, emitter) { /* ... */ }
emitter.forEachAlive(callback, context);
Dead (inactive) particles
Amount of dead particles
var count = emitter.getDeadParticleCount();
or
var count = emitter.dead.length;
Add callback for each particle death
var callback = function(particle, emitter) { /* ... */ }
emitter.onParticleDeath(callback, context);
Clear callback
emitter.onParticleDeath();
For each dead particle
var callback = function(particle, emitter) { /* ... */ }
emitter.forEachDead(callback, context);
Add dead particles into pool
emitter.reserve(count);
Total (alive + dead) number of particles.
var count = emitter.getParticleCount();
Active particles overlaps with a Rectangle Geometry object or an Arcade Physics Body.
var particles = emitter.overlap(target);
target :
A Rectangle.
Arcade Physics Body.
particles : An array of Particles that overlap with the given target
Gets a bounds Rectangle calculated from the bounds of all currently active Particles
emitter.getBounds(padding, advance, delta, output);
padding : The amount of padding, in pixels, to add to the bounds Rectangle.
advance, delta : Fast forward in time to try and allow the bounds to be more accurate.
output : The Rectangle to store the results in.
Gets the bounds of this particle as a Geometry Rectangle
particle.getBounds();
Render order¶
Sort by property
emitter.setSortProperty(property, ascending);
property : The property on the Particle class to sort by.
ascending : Should the particles be sorted in ascending or descending order?
Sort by callback
var callback = function(particleA, particleB) {
return 1; // 0,1,-1
}
emitter.setSortCallback(callback);
Emitter¶
Frequency
emitter.setFrequency(frequency);
// emitter.setFrequency(frequency, quantity);
frequency :
>= 0 : The time interval of each flow cycle, in ms
-1 : Explosion mode.
quantity : The number of particles to release at each flow cycle or explosion.
Quantity
emitter.setQuantity(quantity);
quantity : The number of particles to release at each flow cycle or explosion.
Zone¶
Emit zone¶
Add emit zone¶
var zone = emitter.addEmitZone({
type: 'random',
source: geom,
});
source : Geom like Circle, Ellipse, Rectangle,Triangle, Polygon, BitmapZone, or Path or Curve, which has getRandomPoint(point) method
Custom zone
{
getRandomPoint: function(point) {
// point.x = ...
// point.y = ...
return point;
}
}
Add emit edge¶
var zone = emitter.addEmitZone({
type: 'edge',
source: curve,
quantity: 1,
stepRate: 0,
yoyo: false,
seamless: true,
total: -1
});
source : Geom like Circle, Ellipse, Rectangle,Triangle, Polygon, or Path or Curve, which has getPoints(quantity, stepRate) method
Custom edge
{
getPoints: function(quantity, stepRate) {
// output = [point0, point1, ...];  // point: Phaser.Math.Vector2, or {x, y}
return output;
}
}
quantity : The number of particles to place on the source edge. Set to 0 to use stepRate instead.
stepRate : The distance between each particle. When set, quantity is implied and should be set to 0.
yoyo : Whether particles are placed from start to end and then end to start. Default is false.
seamless : Whether one endpoint will be removed if it's identical to the other. Default is true.
total : The total number of particles this zone will emit before passing over to the next emission zone in the Emitter.
quantity or stepRate
Any geometry like circle, ellipse, kine, polygon, rectangle, triangle source has quantity, or stepRate
Curve source has quantity, or stepRate
Path source only has quantity
Set emit zone¶
emitter.setEmitZone(zone);
zone : The Emit Zone to set as the active zone.
A zone object
A number as index
Zone source¶
Get
// var zone = emitter.emitZones[i];
var source = zone.source;
(Edge type only) Update points of curve source
zone.updateSource();
(Edge type only) Set source to another curve, also update points
zone.changeSource(curve);
Remove emit zone¶
emitter.removeEmitZone(zone)
Clear emit zone¶
emitter.clearEmitZones();
or
emitter.emitZones.length = 0;
emitter.zoneIndex = 0;
Death zone¶
var zone = emitter.addDeathZone({
type: 'onEnter',
source: geom
});
type : 'onEnter' or 'onLeave'
source : Geom like Circle, Ellipse, Rectangle,Triangle, Polygon
Custom source :
{
contains: function (x, y) {
// ...
return bool;
}
}
Remove death zone¶
emitter.removeDeathZone(zone)
Clear death zone¶
emitter.clearDeathZones();
or
emitter.deathZones.length = 0;
Update Configuration¶
emitter.updateConfig(config)
config : See config parameter in constructor.
Events¶
Starts emission of particles.
emitter.on('start', function(emitter) {
})
Explodes a set of particles.
emitter.on('explode', function(emitter, particle) {
})
Death Zone kills a Particle instance.
emitter.on('deathzone', function(emitter, particle, zone) {
})
Stops emission
emitter.on('stop', function(emitter) {
})
Directly call the ParticleEmitter.stop method.
Stop after a set time via the duration property.
Stop after a set number of particles via the stopAfter property.
Complete Event, no particles are still rendering at this point in time.
emitter.on('complete', function(emitter) {
})
Bounds¶
Add bounds
var bounds = emitter.addParticleBounds(x, y, width, height);
// var bounds = emitter.addParticleBounds(x, y, width, height, collideLeft, collideRight, collideTop, collideBottom);
or
var bounds = emitter.addParticleBounds(rect);
x, y, width, height, {x, y, width, height}, or {x, y, w, h}, or Rectangle : Bounds
collideLeft, collideRight, collideTop, collideBottom : Whether particles interact with the left/right/top/bottom edge of the bounds.
Collide edges
bounds.collideLeft = enabled;
bounds.collideRight = enabled;
bounds.collideTop = enabled;
bounds.collideBottom = enabled;
Bound rectangle
var rect = bounds.bounds;
rect : Rectangle
Gravity well¶
Create a gravity well
var well = particles.createGravityWell({
// x: 0,
// y: 0,
// power: 0,
// epsilon: 100,
// gravity: 50
});
Enable
Active
well.active = true;
Inactive
well.active = false;
Position
well.x = x;
well.y = y;
Gravity
well.gravity = value;
Power
well.power = value;
Custom Particle Processor¶
Declare Particle Processor class
class MyParticleProcessor extends Phaser.GameObjects.Particles.ParticleProcessor {
constructor() {
super(x, y, active);
// ...
}
update(particle, delta, step, t) {
// particle : The Particle to update.
// delta : The delta time in ms.
// step : The delta value divided by 1000.
// t : The current normalized lifetime of the particle, between 0 (birth) and 1 (death).
}
destroy() {
super.destroy();
}
}
Override update method
Add to emitter
var myParticleProcessor = emitter.addParticleProcessor(new MyParticleProcessor);
Custom particle class¶
class MyParticle extends Phaser.GameObjects.Particles.Particle {
constructor (emitter) {
super(emitter);
/* ... */
}
update (delta, step, processors) {
super.update(delta, step, processors);
/* ... */
}
}
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters