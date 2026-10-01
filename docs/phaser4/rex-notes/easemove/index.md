Ease-move
Introduction¶
Ease-move game object.
Author: Rex
Method only
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexeasemoveplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexeasemoveplugin.min.js', true);
Ease-move to/from
var easemove = scene.plugins.get('rexeasemoveplugin').moveTo(gameObject, duration, x, y, ease);
var easemove = scene.plugins.get('rexeasemoveplugin').moveFrom(gameObject, duration, x, y, ease);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import EaseMovePlugin from 'phaser4-rex-plugins/plugins/easemove-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexEaseMove',
plugin: EaseMovePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Ease-move to/from
var easemove = scene.plugins.get('rexEaseMove').moveTo(gameObject, duration, x, y, ease);
var easemove = scene.plugins.get('rexEaseMove').moveFrom(gameObject, duration, x, y, ease);
Import method¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import method
import { EaseMoveTo, EaseMoveFrom } from 'phaser4-rex-plugins/plugins/easemove.js';
EaseMove-out-destroy
var easemove = EaseMoveTo(gameObject, duration, x, y, ease);
var easemove = EaseMoveFrom(gameObject, duration, x, y, ease);
Move to¶
var easemove = scene.plugins.get('rexEaseMove').moveTo(gameObject, duration, x, y);
// var easemove = scene.plugins.get('rexEaseMove').moveTo(gameObject, duration, x, y, ease);
// easemove = scene.plugins.get('rexEaseMove').moveTo(gameObject, duration, x, y, ease, easemove);
x, y : End position.
Number : End position x/y.
String(+=300) : Related position of current position x/y.
undefined : Don't move along x/y axis.
ease : 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back' ...
easemove : Ease-move behavior.
Move from¶
var easemove = scene.plugins.get('rexEaseMove').moveFrom(gameObject, duration, x, y);
// var easemove = scene.plugins.get('rexEaseMove').moveFrom(gameObject, duration, x, y, ease);
// easemove = scene.plugins.get('rexEaseMove').moveFrom(gameObject, duration, x, y, ease, easemove);
x, y : Start position.
Number : Start position x/y.
String(-=300) : Related position of current position x/y.
undefined : Don't move along x/y axis.
ease : 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back' ...
easemove : Ease-move behavior.
Events¶
See Events of tween task
Move completes or is stopped.
easemove.on('complete', function(gameObject, easemove){
}, scope);
Inject methods¶
Inject methods into game object
scene.plugins.get('rexEaseMove').injectMethods(gameObject);
Inject methods into class of game object
scene.plugins.get('rexEaseMove').injectMethods(GameObjectClass.prototype);
// scene.plugins.get('rexEaseMove').injectMethods(Phaser.GameObjects.Sprite.prototype);
Inject methods into class of game object
scene.plugins.get('rexEaseMove').injectMethods(GameObjectClass.prototype);
// scene.plugins.get('rexEaseMove').injectMethods(Phaser.GameObjects.Sprite.prototype);
Inject methods into root class of game object
scene.plugins.get('rexEaseMove').injectMethodsToRootClass(e);
// scene.plugins.get('rexEaseMove').injectMethods(Phaser.GameObjects.GameObject.prototype);
Injected methods¶
Move from
gameObject.moveFrom(duration, x, y);
// gameObject.moveFrom(duration, x, y, ease);
// gameObject.moveFrom({x, y, duration, ease});
// gameObject.moveFrom({x, y, speed, ease});
or
gameObject
.moveFromPromise(duration, x, y, ease)
// .moveFromPromise({x, y, duration, ease})
// .moveFromPromise({x, y, speed, ease})
.then(function(){
// ...
})
x, y : Start position.
Number : Start position x/y.
String(+=300) : Related position of current position x/y.
undefined : Current position x/y.
speed : Get duration according to speed and distance between current gameObject position to {x, y}
ease : 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back' ...
Move-from destroy
gameObject.moveFromDestroy(duration, x, y);
// gameObject.moveFrom(duration, x, y, ease);
// gameObject.moveFrom({x, y, duration, ease});
// gameObject.moveFrom({x, y, speed, ease});
or
gameObject
.moveFromDestroyPromise(duration, x, y, ease)
// .moveFromDestroyPromise({x, y, duration, ease})
// .moveFromDestroyPromise({x, y, speed, ease})
.then(function(){
// ...
})
Move to
gameObject.moveTo(duration, x, y);
// gameObject.moveTo(duration, x, y, ease);
// gameObject.moveTo({x, y, duration, ease});
// gameObject.moveTo({x, y, speed, ease});
or
gameObject
.moveToPromise(duration, x, y, ease)
// .moveToPromise({x, y, duration, ease})
// .moveToPromise({x, y, speed, ease})
.then(function(){
// ...
})
x, y : End position.
Number : End position x/y.
String(+=300) : Related position of current position x/y.
undefined : Current position x/y.
speed : Get duration according to speed and distance between current gameObject position to {x, y}
ease : 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back' ...
Move-to destroy
gameObject.moveToDestroy(duration, x, y);
// gameObject.moveTo(duration, x, y, ease);
// gameObject.moveTo({x, y, duration, ease});
// gameObject.moveTo({x, y, speed, ease});
or
gameObject
.moveToDestroyPromise(duration, x, y, ease)
// .moveToDestroyPromise({x, y, duration, ease})
// .moveToDestroyPromise({x, y, speed, ease})
.then(function(){
// ...
})
Move-stop
gameObject.moveStop();
// gameObject.moveStop(true);  // Set to end position
Events
Move-from complete
gameObject.on('movefrom.complete', function(gameObject) { });
Move-to complete
gameObject.on('moveto.complete', function(gameObject) { });