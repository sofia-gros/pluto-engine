Attractor
Introduction¶
Apply continual forces on bodies.
Reference
Usage¶
System configuration¶
Game config
var config = {
// ...
physics: {
matter: {
// ...
plugins: {
attractors: true,
// ...
}
// ...
}
}
// ...
}
var game = new Phaser.Game(config);
Runtime
scene.matter.system.enableAttractorPlugin();
Matter object configuration¶
var options = {
// ...
plugin: {
attractors: [
callback,
// ...
]
},
// ...
}
callback :
Retuen a force ({x,y}), which will be applied to bodyB
function(bodyA, bodyB) {
return {x, y}; // Force
}
bodyA : Attractor matter object.
bodyB : Other matter object.
Apply forece to bodies directly.
function(bodyA, bodyB) {
bodyA.gameObject.applyForce({x, y});
bodyB.gameObject.applyForce({x, y});
}
bodyA : Attractor matter object.
bodyA.gameObject : Game object.
bodyB : Other matter object.
bodyB.gameObject : Game object.