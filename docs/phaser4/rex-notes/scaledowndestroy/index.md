Scale down destroy
Introduction¶
Scale down (i.e. ease scaleX, scaleY to 0) game object then destroy it.
Author: Rex
Method only
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexscaleplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexscaleplugin.min.js', true);
Scale down, then destroy object
scene.plugins.get('rexscaleplugin').scaleDownDestroy(gameObject, duration);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import ScalePlugin from 'phaser4-rex-plugins/plugins/scale-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexScale',
plugin: ScalePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Scale down, then destroy object
scene.plugins.get('rexScale').scaleDownDestroy(gameObject, duration);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import ScaleDownDestroy from 'phaser4-rex-plugins/plugins/scale-down-destroy.js';
Scale down, then destroy object
ScaleDownDestroy(gameObject, duration);
Scale down¶
Scale down width and height
var scale = scene.plugins.get('rexScale').scaleDownDestroy(gameObject, duration);
// var scale = scene.plugins.get('rexScale').scaleDownDestroy(gameObject, duration, undefined, ease);
ease : Ease function, default is 'Linear'.
Scale down width only
var scale = scene.plugins.get('rexScale').scaleDownDestroy(gameObject, duration, 'x');
// var scale = scene.plugins.get('rexScale').scaleDownDestroy(gameObject, duration, 'x', ease);
Scale down height only
var scale = scene.plugins.get('rexScale').scaleDownDestroy(gameObject, duration, 'y');
// var scale = scene.plugins.get('rexScale').scaleDownDestroy(gameObject, duration, 'y', ease);
Events¶
See Events of tween task
Scale completes or is stopped.
scale.on('complete', function(gameObject, scale){
}, scope);
Inject methods¶
Inject methods into game object
scene.plugins.get('rexScale').injectMethods(gameObject);
Inject methods into class of game object
scene.plugins.get('rexScale').injectMethods(GameObjectClass.prototype);
// scene.plugins.get('rexScale').injectMethods(Phaser.GameObjects.Sprite.prototype);
Inject methods into class of game object
scene.plugins.get('rexScale').injectMethods(GameObjectClass.prototype);
// scene.plugins.get('rexScale').injectMethods(Phaser.GameObjects.Sprite.prototype);
Inject methods into root class of game object
scene.plugins.get('rexScale').injectMethodsToRootClass(e);
// scene.plugins.get('rexScale').injectMethods(Phaser.GameObjects.GameObject.prototype);
Injected methods¶
Scale up from 0 to current scale of game object.
Pop-up width and height
gameObject
//.setScale(scaleX, scaleY)
.popUp(duration);
// gameObject.popUp(duration, undefined, ease);
or
gameObject
//.setScale(scaleX, scaleY)
.popUpPromise(duration)
.then(function() {
// ....
})
ease : Ease function, default is 'Cubic'.
Pop-up width only
gameObject
//.setScaleX(scaleX)
.popUp(duration, 'x');
// gameObject.popUp(duration, 'x', ease);
or
gameObject
//.setScaleX(scaleX)
.popUpPromise(duration, 'x')
.then(function() {
// ....
})
Pop-up height only
gameObject
//.setScaleY(scaleY)
.popUp(duration, 'y');
// gameObject.popUp(duration, 'y', ease);
or
gameObject
//.setScaleY(scaleY)
.popUpPromise(duration, 'y')
.then(function() {
// ....
})
Pop-up via config
gameObject
//.setScale(scaleX, scaleY)
.popUp({
duration: undefined,
orientation: undefined,
ease: undefined,
})
or
gameObject
//.setScale(scaleX, scaleY)
.popUpPromise(config)
.then(function() {
// ....
})
orientation : undefined, x, or y
Scale-down destroy
Scale-down width and height
gameObject.scaleDownDestroy(duration);
// gameObject.scaleDownDestroy(duration, undefined, ease);
or
gameObject.scaleDownDestroyPromise(duration)
.then(function() {
// ....
})
ease : Ease function, default is 'Linear'.
Scale-down width only
gameObject.scaleDownDestroy(duration, 'x');
// gameObject.scaleDownDestroy(duration, 'x', ease);
or
gameObject.scaleDownDestroyPromise(duration, 'x');
.then(function() {
// ....
})
Scale-down height only
gameObject.scaleDownDestroy(duration, 'y');
// gameObject.scaleDownDestroy(duration, 'y', ease);
or
gameObject.scaleDownDestroyPromise(duration, 'y')
.then(function() {
// ....
})
Scale-down without destroy
Scale-down width and height
gameObject.scaleDown(duration);
// gameObject.scaleDown(duration, undefined, ease);
or
gameObject.scaleDownPromise(duration, undefined, ease)
.then(function() {
// ....
})
Scale-down width only
gameObject.scaleDowny(duration, 'x');
// gameObject.scaleDowny(duration, 'x', ease);
or
gameObject.scaleDownPromise(duration, 'x', ease)
.then(function() {
// ....
})
Scale-down height only
gameObject.scaleDown(duration, 'y');
// gameObject.scaleDown(duration, 'y', ease);
or
gameObject.scaleDownPromise(duration, 'y', ease)
.then(function() {
// ....
})
Scale up/down, then scale back (yoyo)
Scale up/down, then scale back width and height
gameObject
//.setScale(scaleX, scaleY)
.scaleYoyo(duration, peakValue);
// gameObject.scaleYoyo(duration, peakValue, repeat, undefined, ease);
or
gameObject
//.setScale(scaleX, scaleY)
.scaleYoyoPromise(duration, peakValue, repeat)
.then(function() {
// ....
})
peakValue : Scale to this peak value, then scale back
repeat : Yoyo repeat, default value is 0.
ease : Ease function, default is 'Cubic'.
Scale up/down, then scale back width only
gameObject
//.setScaleX(scaleX)
.scaleYoyo(duration, peakValue, 0, 'x');
// gameObject.popUp(duration, peakValue, repeat, 'x', ease);
or
gameObject
//.setScaleX(scaleX)
.scaleYoyoPromise(duration, peakValue, repeat, 'x')
.then(function() {
// ....
})
Scale up/down, then scale back height only
gameObject
//.setScaleY(scaleY)
.scaleYoyo(duration, peakValue, 0, 'y');
// gameObject.popUp(duration, peakValue, repeat, 'y', ease);
or
gameObject
//.setScaleY(scaleY)
.scaleYoyoPromise(duration, peakValue, repeat, 'y')
.then(function() {
// ....
})
Scale up/down via config
gameObject
//.setScale(scaleX, scaleY)
.scaleYoyo({
duration: undefined,
peakValue: 1.2,
repeat: 0,
orientation: undefined,
ease: undefined,
})
or
gameObject
//.setScale(scaleX, scaleY)
.scaleYoyoPromise(config)
.then(function() {
// ....
})
orientation : undefined, x, or y
Events
Pop-up complete
gameObject.on('popup.complete', function(gameObject) { });
Scale-down, scale-down destroy complete
gameObject.on('scaledown.complete', function(gameObject) { });
Scale up/down, then scale back (yoyo)
gameObject.on('scaleyoyo.complete', function(gameObject) { });