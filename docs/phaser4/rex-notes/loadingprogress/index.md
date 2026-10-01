Loading progress
Introduction¶
Pop-up dialog for loading-progress, then scale-down this dialog.
Author: Rex
Behavior of game object
Live demos¶
Loading progress
Custom transit
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexloadingprogressplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexloadingprogressplugin.min.js', true);
Add loading-progress behavior
var loadingProgress = scene.plugins.get('rexloadingprogressplugin').add(gameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Add loading-progress behavior
var loadingProgress = scene.plugins.get('rexLoadingProgress').add(gameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import LoadingProgress from 'phaser4-rex-plugins/plugins/loadingprogress.js';
Add loadingprogress behavior
var loadingProgress = new LoadingProgressBehavoir(gameObject, config);
Create instance¶
var loadingProgress = scene.plugins.get('rexLoadingProgress').add(gameObject, {
// duration: {
//     in: 200,
//     out: 200
// }
// progress: function(gameObject, progress) {},
// transitIn: function(gameObject, duration) {},
// transitOut: function(gameObject, duration) {},
});
gameObject : Game object for presenting loading-progress.
duration : Duration of transition-in, trantion-out.
duration.in : Duration of transition-in (open dialog).
0 : No transition, open dialog immediately.-
duration.out : Duration of transition-out (close dialog). Game object will be destroyed after transiting out.
0 : No transition, close dialog immediately.
progress : Callback of loading-progress
function(gameObject, progress) {
}
progress : Number between 0 to 1.
transitIn : Tween behavior of opening dialog.
Custom callback
function(gameObject, duration) {
}
transitOut : Tween behavior of closing dialog.
Custom callback
function(gameObject, duration) {
}
Events¶
On progress
loadingProgress.on('progress', function(progress) {
})
On opened dialog
loadingProgress.on('open', function(gameObject, loadingProgress) {
})
On closed dialog
loadingProgress.on('close', function() {
})