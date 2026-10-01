Loading animation scene
Introduction¶
Start loading animation scene, stop this scene when loading complete.
Author: Rex
Methods
Live demos¶
Loading animation scene
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexloadinganimationsceneplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexloadinganimationsceneplugin.min.js', true);
In mainScene, start loading animation scene, or in animation scene, monitor loading status of mainScene.
scene.plugins.get('rexloadinganimationsceneplugin').startScene(scene, animationSceneKey);
This plugin will also install AwaitLoader.
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import LoadingAnimationScenePlugin from 'phaser4-rex-plugins/plugins/loadinganimationscene-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexLoadingAnimationScene',
plugin: LoadingAnimationScenePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
In mainScene, start loading animation scene, or in animation scene, monitor loading status of mainScene.
scene.plugins.get('rexLoadingAnimationScene').startScene(config);
This plugin will also install AwaitLoader.
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import StartLoadingAnimationScene from 'phaser4-rex-plugins/plugins/loadinganimationscene.js';
In mainScene, start loading animation scene, or in animation scene, monitor loading status of mainScene.
StartLoadingAnimationScene(config);
Start loading animation scene¶
In mainScene, start loading animation scene, or in animation scene, monitor loading status of mainScene.
scene.plugins.get('rexLoadingAnimationScene').startScene({
mainScene:
animationScene:
onLoadingComplete: undefined
onLoadingProgress: undefined
});
mainScene : Scene instaance of main scene.
animationScene : Scene instance or scene-key of animation scene.
This animation scene will be stopped wheen main scene's loading complete totally.
onLoadingComplete : Custom task invoked when loading complete.
function(finishLoading, animationScene) {
// finishLoading();
}
Invoke finishLoading() method (later) to finish loading progress totally.
onLoadingProgress : Callback when loading progress is changing.
function(progress, animationScene) {
}