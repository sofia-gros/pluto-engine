Fade out destroy
Introduction¶
Fade out game object then destroy it.
Author: Rex
Method only
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexfadeplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexfadeplugin.min.js', true);
Fade-out-destroy
var fade = scene.plugins.get('rexfadeplugin').fadeOutDestroy(gameObject, duration);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import FadePlugin from 'phaser4-rex-plugins/plugins/fade-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexFade',
plugin: FadePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Fade-out-destroy
var fade = scene.plugins.get('rexFade').fadeOutDestroy(gameObject, duration);
Import method¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import method
import FadeOutDestroy from 'phaser4-rex-plugins/plugins/fade-out-destroy.js';
Fade-out-destroy
var fade = FadeOutDestroy(gameObject, duration);
Fade-out-destroy¶
var fade = scene.plugins.get('rexFade').fadeOutDestroy(gameObject, duration);
Events¶
See Events of tween task
Scale completes or is stopped.
fade.on('complete', function(gameObject, fade){
}, scope);
Inject methods¶
Inject methods into game object
scene.plugins.get('rexFade').injectMethods(gameObject);
Inject methods into class of game object
scene.plugins.get('rexFade').injectMethods(GameObjectClass.prototype);
// scene.plugins.get('rexFade').injectMethods(Phaser.GameObjects.Sprite.prototype);
Inject methods into class of game object
scene.plugins.get('rexFade').injectMethods(GameObjectClass.prototype);
// scene.plugins.get('rexFade').injectMethods(Phaser.GameObjects.Sprite.prototype);
Inject methods into root class of game object
scene.plugins.get('rexFade').injectMethodsToRootClass(e);
// scene.plugins.get('rexFade').injectMethods(Phaser.GameObjects.GameObject.prototype);
Injected methods¶
Fade-in
gameObject.fadeIn(duration);
or
gameObject.fadeIn(duration, endAlpha);
or
gameObject.fadeIn(duration, {start:0, end:1});
or
gameObject.fadeInPromise(duration, endAlpha)
.then(function(){
// ...
})
or
gameObject.fadeInPromise(duration, {start:0, end:1})
.then(function(){
// ...
})
Fade-out destroy
gameObject.fadeOutDestroy(duration);
or
gameObject.fadeOutDestroyPromise(duration)
.then(function(){
// ...
})
Fade-out without destroy
gameObject.fadeOut(duration);
or
gameObject.fadeOutPromise(duration)
.then(function(){
// ...
})
Events
Fade-in complete
gameObject.on('fadein.complete', function(gameObject) { });
Fade-out, fade-out destroy complete
gameObject.on('fadeout.complete', function(gameObject) { });