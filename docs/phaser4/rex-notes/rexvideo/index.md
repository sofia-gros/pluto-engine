Rexvideo
Warning
This plugin is abandoned, please using built-in video.
Introduction¶
Play video on DOM, or on canvas.
Author: Rex
DOM Game object, or Canvas Game object
Live demos¶
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexvideoplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvideoplugin.min.js', true);
Add video object
var video = scene.add.rexVideoCanvas(x, y, width, height, config);
// var video = scene.add.rexVideo(x, y, width, height, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import VideoPlugin from 'phaser4-rex-plugins/plugins/video-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexVideo',
plugin: VideoPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add video object
var video = scene.add.rexVideoCanvas(x, y, width, height, config);
// var video = scene.add.rexVideo(x, y, width, height, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import VideoCanvas from 'phaser4-rex-plugins/plugins/videocanvas/VideoCanvas.js';
// import VideoDOM from 'phaser4-rex-plugins/plugins/videodom/VideoDOM.js';
Add text object
var video = new VideoCanvas(scene, x, y, width, height, config);
scene.add.existing(video);
// var video = new VideoDOM(scene, x, y, width, height, config);
// scene.add.existing(video);
Add video object¶
Video on DOM
var video = scene.add.rexVideo(x, y, width, height, config);
// var video = scene.add.rexVideo(x, y, config);
// var video = scene.add.rexVideo(config);
Video on canvas
var video = scene.add.rexVideoCanvas(x, y, width, height, config);
// var video = scene.add.rexVideoCanvas(x, y, config);
// var video = scene.add.rexVideoCanvas(config);
Default configuration
{
x: 0,
y: 0,
width: undefined,
height: undefined,
// Element properties
src: url,
// src: {
//     webm: webmFileURL,
//     ogg: oggFileURL,
//     mp4: mp4FileURL,
//     h264: h264FileURL,
// }
id: undefined,
autoPlay: true,
controls: false,
loop: false,
muted: false,
playsInline: true,
crossOrigin: 'anonymous',
playbackTimeChangeEventEnable: true,
}
x, y : Position
width, height : Size of element
Element properties
src : Specifies the URL of the video file.
A string : url of the video file.
A plain object : { videoType: fileURL }
Get webmFileURL if browser supports webm video format.
Get oggFileURL if browser supports ogg video format.
Get mp4FileURL if browser supports mp4 video format.
Get h264FileURL if browser supports h264 video format.
id : id element property.
autoPlay : autoplay element property.
controls : controls element property.
loop : loop element property.
muted : muted element property.
playsInline : playsInline element property.
crossOrigin : crossOrigin element property.
playbackTimeChangeEventEnable : Set false to disable playbacktimechange event.
Different between rexVideo and rexVideoCanvas¶
rexVideo plays video on DOM.
DOM object always above game canvas.
Won't be affected by webgl shader.
Right clicks to pop up a menu.
rexVideoCanvas plays video on canvas.
Can be placed between game objects via depth setting.
Can be affected by webgl shader.
Custom class¶
Define class
class MyVideo extends Video {  // or VideoCanvas
constructor(scene, x, y, width, height, config) {
super(scene, x, y, width, height, config) {
// ...
scene.add.existing(this);
}
// ...
// preUpdate(time, delta) {
//     if (super.preUpdate) {
//         super.preUpdate(time, delta)
//     }
// }
}
scene.add.existing(gameObject) : Adds an existing Game Object to this Scene.
If the Game Object renders, it will be added to the Display List.
If it has a preUpdate method, it will be added to the Update List.
Create instance
var video = new MyVideo(scene, x, y, width, height, config);
Load¶
video.load(src);
src : Specifies the URL of the video file.
A string : url of the video file.
A plain object : { videoType: fileURL }
Get webmFileURL if browser supports webm video format.
Get oggFileURL if browser supports ogg video format.
Get mp4FileURL if browser supports mp4 video format.
Get h264FileURL if browser supports h264 video format.
Play¶
video.play();
Pause¶
video.pause();
Playback time¶
Get
var playbackTime = video.playbackTime; // time in seconds
var t = video.t; // t: 0~1
Set
video.setPlaybackTime(time); // time in seconds
// video.playbackTime = time;
video.setT(t); // t: 0~1
// video.t = t;
Duration¶
var duration = video.duration;  // time in seconds
Volume¶
Get
var volume = video.volume;  // volume: 0~1
Set
video.setVolume(volume);  // volume: 0~1
// video.volume = volume;
Mute¶
Get
var muted = video.muted;  // muted: true/false
Set
video.setMute(muted);  // muted: true/false
// video.muted = muted;
Loop¶
Get
var loop = video.loop;  // loop: true/false
Set
video.setLoop(loop);  // loop: true/false
// video.loop = loop;
Resize¶
video.resize(width, height);
Status¶
Is playing
var isPlaying = video.isPlaying;
Is paused
var isPaused = video.isPaused;
Has end
var hasEnded = video.hasEnded;
Ready state
var readyState = video.readyState;
0 = HAVE_NOTHING - no information whether or not the audio/video is ready
1 = HAVE_METADATA - metadata for the audio/video is ready
2 = HAVE_CURRENT_DATA - data for the current playback position is available, but not enough data to play next frame/millisecond
3 = HAVE_FUTURE_DATA - data for the current and at least the next frame is available
4 = HAVE_ENOUGH_DATA - enough data available to start playing
Events¶
Load start
video.on('loadstart', function(video){ }, scope);
Can play
video.on('canplay', function(video){ }, scope);
Can play through
video.on('canplaythrough', function(video){ }, scope);
Playing
video.on('playing', function(video){ }, scope);
Pause
video.on('pause', function(video){ }, scope);
Stalled
video.on('stalled', function(video){ }, scope);
Ended
video.on('ended', function(video){ }, scope);
Error
video.on('error', function(video){ }, scope);
Playback time changed
video.on('playbacktimechange', function(video){ }, scope);
Set playbackTimeChangeEventEnable to true to enable this event.