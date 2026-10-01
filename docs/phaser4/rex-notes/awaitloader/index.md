Await loader
Introduction¶
Await custom task in preload stage.
Author: Rex
Custom File of loader
Live demos¶
Wait 1000ms
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
var sceneConfig = {
// ....
pack: {
files: [{
type: 'plugin',
key: 'rexawaitloaderplugin',
url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/    rexawaitloaderplugin.min.js',
start: true
}]
}
};
class MyScene extends Phaser.Scene {
constructor() {
super(sceneConfig)
}
// ....
preload() {
// rexawaitloaderplugin will be installed before preload(), but not added to loader yet
// Call addToScene(scene) to add this await loader to loader of this scene
this.plugins.get('rexawaitloaderplugin').addToScene(this);
this.load.rexAwait(function(successCallback, failureCallback) {
// successCallback()
});
}
}
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import AwaitLoaderPlugin from 'phaser4-rex-plugins/plugins/awaitloader-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexAwaitLoader',
plugin: AwaitLoaderPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
In preload stage
scene.load.rexAwait(function(successCallback, failureCallback) {
// successCallback()
});
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import AwaitLoader from 'phaser4-rex-plugins/plugins/awaitloader.js';
Start loading task
AwaitLoader.call(scene.load, function(successCallback, failureCallback) {
// successCallback();
}, scope)
Start loading task¶
In preload stage:
scene.load.rexAwait(function(successCallback, failureCallback) {
// successCallback();
}, scope);
or
var callback = function(successCallback, failureCallback) {
// successCallback();
};
scene.load.rexAwait(key, {
callback: callback,
// scope: scope
});
This plugin runs callback  to start custom task.
Calls successCallback when custom task completed, or failureCallback if error.