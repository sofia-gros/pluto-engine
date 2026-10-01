Youtube player
Introduction¶
Play youtube video on iframe.
Author: Rex
DOM Game object
Live demos¶
Youtube player
Usage¶
Sample code
Install plugin¶
Load minify file¶
Enable dom element in configuration of game
var config = {
parent: divId,
// fullscreenTarget: divId, // For fullscreen
dom: {
createContainer: true
},
input: {
mouse: {
target: divId
},
touch: {
target: divId
},
},
// ...
};
var game = new Phaser.Game(config);
Set parent to divId
Set dom.createContainer to true.
Load plugin (minify file) in preload stage
scene.load.plugin('rexyoutubeplayerplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexyoutubeplayerplugin.min.js', true);
Add youtube player object
var youtubePlayer = scene.add.rexYoutubePlayer(x, y, width, height, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import YoutubePlayerPlugin from 'phaser4-rex-plugins/plugins/youtubeplayer-plugin.js';
var config = {
parent: divId,
// fullscreenTarget: divId, // For fullscreen
dom: {
createContainer: true
},
input: {
mouse: {
target: divId
},
touch: {
target: divId
},
},
// ...
plugins: {
global: [{
key: 'rexYoutubePlayer',
plugin: YoutubePlayerPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Set parent to divId
Set dom.createContainer to true.
Add youtube player object
var youtubePlayer = scene.add.rexYoutubePlayer(x, y, width, height, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Enable dom element in configuration of game
var config = {
parent: divId,
// fullscreenTarget: divId, // For fullscreen
dom: {
createContainer: true
},
input: {
mouse: {
target: divId
},
touch: {
target: divId
},
},
// ...
};
var game = new Phaser.Game(config);
Set parent to divId
Set dom.createContainer to true.
Import class
import YoutubePlayer from 'phaser4-rex-plugins/plugins/youtubeplayer.js';
Add youtube player object
var youtubePlayer = new YoutubePlayer(scene, x, y, width, height, config);
scene.add.existing(youtubePlayer);
Add youtube player object¶
Youtube player on DOM
var player = scene.add.rexYoutubePlayer(x, y, width, height, config);
// var player = scene.add.rexYoutubePlayer(x, y, config);
// var player = scene.add.rexYoutubePlayer(config);
Default configuration
{
x: 0,
y: 0,
width: undefined,
height: undefined,
videoId: '',
autoPlay: true,
controls: false,
keyboardControl: true,
modestBranding: false,
loop: false,
}
x, y : Position
width, height : Size of element
videoId : The YouTube video ID that identifies the video that the player will load.
autoPlay : Automatically start to play when the player loads.
controls : Whether the video player controls are displayed.
keyboardControl : Set false to disable keyboard controls.
modestBranding : Set false to prevent the YouTube logo from displaying in the control bar.
loop : Play video when ended.
Custom class¶
Define class
class MyYoutubePlayer extends YoutubePlayer {  // or YoutubePlayerCanvas
constructor(scene, x, y, width, height, config) {
super(scene, x, y, width, height, config) {
// ...
scene.add.existing(this);
}
// ...
// preUpdate(time, delta) {
//     super.preUpdate(time, delta)
// }
}
scene.add.existing(gameObject) : Adds an existing Game Object to this Scene.
If the Game Object renders, it will be added to the Display List.
If it has a preUpdate method, it will be added to the Update List.
Create instance
var player = new MyYoutubePlayer(scene, x, y, width, height, config);
Load¶
player.load(videoId);
// player.load(videoId, autoPlay);
Play¶
player.play();
Pause¶
player.pause();
Playback time¶
Get
var playbackTime = player.playbackTime; // time in seconds
var t = player.t; // t: 0~1
Set
player.setPlaybackTime(time); // time in seconds
// player.playbackTime = time;
player.setT(t); // t: 0~1
// player.t = t;
Duration¶
var duration = player.duration;  // time in seconds
Volume¶
Get
var volume = player.volume;  // volume: 0~1
Set
player.setVolume(volume);  // volume: 0~1
// player.volume = volume;
Mute¶
Get
var muted = player.muted;  // muted: true/false
Set
player.setMute(muted);  // muted: true/false
// player.muted = muted;
Loop¶
Get
var loop = player.loop;  // loop: true/false
Set
player.setLoop(loop);  // loop: true/false
// player.loop = loop;
Resize¶
player.resize(width, height);
Status¶
Is playing
var isPlaying = player.isPlaying;
Is paused
var isPaused = player.isPaused;
Has end
var hasEnded = player.hasEnded;
Video state
var videoState = player.videoState;
or
var videoStateString = player.videoStateString;
-1 : unstarted
0 : ended
1 : playing
2 : paused
3 : buffering
5 : cued
Events¶
Youtube player api ready
player.on('ready', function(player){ }, scope);
State change
player.on('statechange', function(player){ }, scope);
State : player.videoState
Unstarted
player.on('unstarted', function(player){ }, scope);
Playing
player.on('playing', function(player){ }, scope);
Pause
player.on('pause', function(player){ }, scope);
Ended
player.on('ended', function(player){ }, scope);
Buffering
player.on('buffering', function(player){ }, scope);
Video cued
player.on('cued', function(player){ }, scope);
Error
player.on('error', function(player, errorMessage){ }, scope);
No Playback time changed event
Get playback time every tick might cause playing video lagging.
Other properties¶
See dom game object, game object
Interactive with other game objects¶
See dom-element's Interactive with other game objects