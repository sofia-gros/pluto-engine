Build arcade object
Introduction¶
Create arcade body, and inject arcade object methods.
Author: Rex
Arcade behavior of game object
Usage¶
Sample code
Install plugin¶
Load minify file¶
Enable arcade physics engine in configuration of game
var config = {
// ...
physics: {
default: 'arcade',
arcade: {
// debug: true
}
}
}
var game = new Phaser.Game(config);
Load plugin (minify file) in preload stage
scene.load.plugin('rexbuildarcadeobjectplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbuildarcadeobjectplugin.min.js', true);
Inject arcade object methods
var gameObject = scene.plugins.get('rexbuildarcadeobjectplugin').build(gameObject);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Enable arcade physics engine and install plugin in configuration of game
import BuildArcadeObjectPlugin from 'phaser4-rex-plugins/plugins/buildarcadeobject-plugin.js';
var config = {
physics: {
default: 'arcade',
arcade: {
// debug: true
}
},
// ...
plugins: {
global: [{
key: 'rexBuildArcadeObject',
plugin: BuildArcadeObjectPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Inject arcade object methods
var gameObject = scene.plugins.get('rexBuildArcadeObject').build(gameObject);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Enable arcade physics engine in configuration of game
var config = {
// ...
physics: {
default: 'arcade',
arcade: {
// debug: true
}
}
}
var game = new Phaser.Game(config);
Import class
import BuildArcadeObject from 'phaser4-rex-plugins/plugins/buildarcadeobject.js';
Inject arcade object methods
var gameObject = BuildArcadeObject(gameObject);
Inject arcade object methods¶
Inject arcade method to game object
scene.plugins.get('rexBuildArcadeObject').injectMethods(gameObject);
// scene.physics.add.existing(gameObject);        // Dynamic arcade body
// scene.physics.add.existing(gameObject, true);  // Static arcade body
Inject arcade method to game object class
scene.plugins.get('rexBuildArcadeObject').injectMethods(GameObjectClass.prototype);
Inject arcade method to root of all game object class
scene.plugins.get('rexBuildArcadeObject').injectMethodsToRootClass();
Create dynamic arcade body
var gameObject = scene.plugins.get('rexBuildArcadeObject').build(gameObject);
// var gameObjects = scene.plugins.get('rexBuildArcadeObject').build(gameObjects);
Create static arcade body
var gameObject = scene.plugins.get('rexBuildArcadeObject').build(gameObject, true);
// var gameObjects = scene.plugins.get('rexBuildArcadeObject').build(gameObjects, true);