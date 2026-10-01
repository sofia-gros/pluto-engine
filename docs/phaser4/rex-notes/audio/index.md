Audio
Introduction¶
Play sounds, built-in object of phaser.
Author: Phaser Team
Usage¶
Configuration¶
Web audio¶
Web audio is the default audio context.
Html5 audio¶
var config = {
// ....
audio: {
disableWebAudio: true
}
// ....
};
var game = new Phaser.Game(config);
No audio¶
var config = {
// ....
audio: {
noAudio: true
}
// ....
};
var game = new Phaser.Game(config);
Load audio file¶
scene.load.audio(key, urls);  // urls: an array of file url
// scene.load.audio(key, urls, {instances: 1}, xhrSettings);
See loader
Decode audio¶
scene.sound.decodeAudio(key, audioData);
audioData : Audio data
A base64 encoded string
An audio media-type data uri
An ArrayBuffer instance
Or
scene.sound.decodeAudio(audioFiles);
audioFiles : An array of {key, data}
data : Audio data
A base64 encoded string
An audio media-type data uri
An ArrayBuffer instance
Decoded events¶
Finished decoding an audio data
scene.sound.on('decoded', key);
Finished decoding all audio data
scene.sound.on('decodedall');
Unlock audio¶
Unlocks Web Audio API/HTML5 Audio loading on the initial input event.
scene.sound.unlock();
Play sound¶
Sound instance will be destroyed when playback ends.
scene.sound.play(key);
or
scene.sound.play(key, config);
/*
var sound = scene.sound.add(key);
sound.play(config);
*/
Position of the Spatial Audio listener¶
scene.sound.setListenerPosition(x, y)
x, y : The x/y position of the Spatial Audio listener. Default value is center of the game canvas.
Note
Web audio only
Sound instance¶
Create sound instance¶
var music = scene.sound.add(key);
var music = scene.sound.add(key, config);
Configuration¶
{
mute: false,
volume: 1,
rate: 1,
detune: 0,
seek: 0,
loop: false,
delay: 0,
// source of the spatial sound
source: {
x: 0,
y: 0,
z: 0,
panningModel: 'equalpower',
distanceModel: 'inverse',
orientationX: 0,
orientationY: 0,
orientationZ: -1,
refDistance: 1,
maxDistance: 10000,
rolloffFactor: 1,
coneInnerAngle: 360,
coneOuterAngle: 0,
coneOuterGain: 0,
follow: undefined
}
}
source : Source of the spatial sound
x, y : The horizontal/vertical position of the audio in a right-hand Cartesian coordinate system.
z : Represents the longitudinal (back and forth) position of the audio in a right-hand Cartesian coordinate system.
panningModel : An enumerated value determining which spatialization algorithm to use to position the audio in 3D space.
'equalpower'
'HRTF'
orientationX, orientationY : The horizontal/vertical position of the audio source's vector in a right-hand Cartesian coordinate system.
orientationZ : Represents the longitudinal (back and forth) position of the audio source's vector in a right-hand Cartesian coordinate system.
refDistance : A double value representing the reference distance for reducing volume as the audio source moves further from the listener. For distances greater than this the volume will be reduced based on rolloffFactor and distanceModel.
maxDistance : The maximum distance between the audio source and the listener, after which the volume is not reduced any further.
rolloffFactor : A double value describing how quickly the volume is reduced as the source moves away from the listener. This value is used by all distance models.
coneInnerAngle : The angle, in degrees, of a cone inside of which there will be no volume reduction.
coneOuterAngle : The angle, in degrees, of a cone outside of which the volume will be reduced by a constant value, defined by the coneOuterGain property.
coneOuterGain : The amount of volume reduction outside the cone defined by the coneOuterAngle attribute. Its default value is 0, meaning that no sound can be heard. A value between 0 and 1.
follow : Set this Sound object to automatically track the x/y position of this object. Can be a Phaser Game Object, Vec2 or anything that exposes public x/y properties.
Play sound instance¶
Start playing
music.play();
Start playing with configuration
music.play(config);
config
Stop
music.stop();
Pause
music.pause();
Resume
music.resume();
Methods¶
Mute¶
Set
music.setMute(mute); // mute: true/false
// music.mute = mute;
Get
var mute = music.mute;
Volume¶
Set
music.setVolume(volume); // volume: 0 to 1
// music.volume = volume;
Get
var volume = music.volume;
Detune¶
Set
music.setDetune(detune); // detune: -1200 to 1200
// music.detune = detune;
Get
var detune = music.detune;
Play-rate¶
Set
music.setRate(rate); // rate: 1.0(normal speed), 0.5(half speed), 2.0(double speed)
// music.rate = rate;
Get
var rate = music.rate;
Seek to¶
Seek to
music.setSeek(time); // seek: playback time
// music.seek = seek;
Get current playback time
var time = music.seek;  // return 0 when playback ends
Loop¶
Set
music.setLoop(loop); // loop: true/false
// music.loop = loop;
Get
var loop = music.loop;
Properties¶
Duration : duration of this sound
var duration = music.duration;
Is playing
var isPlaying = music.isPlaying;
Is paused
var isPaused = music.isPaused;
Asset key
var key = music.key;
Events¶
Start playing
music.once('play', function(music){});
Playback end
music.once('complete', function(music){});
Looping
music.once('looped', function(music){});
Pause
music.once('pause', function(music){});
Resume
music.once('resume', function(music){});
Stop
music.once('stop', function(music){});
Set mute
music.once('mute', function(music, mute){});
Set volume
music.once('volume', function(music, volume){});
Set detune
music.once('detune', function(music, detune){});
Set play-rate
music.once('rate', function(music, rate){});
Seek to
music.once('seek', function(music, time){});
set loop
music.once('loop', function(music, loop){});
Play marked sound¶
Sound instance will be destroyed when playback ends.
scene.sound.play(key, marker);
Marker¶
{
name: '',
start: 0,
duration: music.duration,
config: {
mute: false,
volume: 1,
rate: 1,
detune: 0,
seek: 0,
loop: false,
delay: 0
}
}
Markers in sound instance¶
Add marker¶
music.addMarker(marker);
Marker
Play marked sound¶
music.play(markerName);
music.play(markerName, config);
config
Audio sprite¶
Load audio sprite¶
scene.load.audioSprite(key, urls, markersConfig, config);
See loader
Format of markersConfig
{
resources: urls, // an array of audio files
spritemap: {
markerName0: {
start: 0,
end: 0
},
markerName1: {
start: 0,
end: 0
}
// ...
}
}
Play sound¶
Create a sound instance then play the marked section, this sound instance will be destroyed when playback ends.
scene.sound.playAudioSprite(key, markerName, config);
config
Sound instance¶
Create a sound instance with markers.
var music = scene.sound.addAudioSprite(key, config);
config
Play sound instance¶
music.play(markerName);
music.play(markerName, config);
config
Sound manager¶
Mute¶
Set
scene.sound.setMute(mute); // mute: true/false
// scene.sound.mute = mute;
Get
var mute = scene.sound.mute;
Volume¶
Set
scene.sound.setVolume(volume); // volume: 0 to 1
// scene.sound.volume = volume;
Get
var volume = scene.sound.volume;
Detune¶
Set
scene.sound.setDetune(detune); // detune: -1200 to 1200
// scene.sound.detune = detune;
Get
var detune = scene.sound.detune;
Play-rate¶
Set
scene.sound.setRate(rate); // rate: 1.0(normal speed), 0.5(half speed), 2.0(double speed)
// scene.sound.rate = rate;
Get
var rate = scene.sound.rate;
Get music instance¶
Get first by key
var music = scene.sound.get(key); // music instance, or null
Get all by key
var musicArray = scene.sound.getAll(key); // music instance, or null
Get all
var musicArray = scene.sound.getAll();
Get all playing
var musicArray = scene.sound.getAllPlaying();
Is playing¶
Is any sound playing
var isPlaying = scene.sound.isPlaying();
Is any sound playing by key
var isPlaying = scene.sound.isPlaying(key);
Remove music instance¶
Remove by key
var removed = scene.sound.removeByKey(key);
removed : The number of matching sound objects that were removed.
Remove all
scene.sound.removeAll();
Stop music instance¶
Stop by key
var stopped = scene.sound.stopByKey(key);
stopped : How many sounds were stopped.
Stop all
scene.sound.stopAll();
Analyser¶
Analyser node is only available in Web audio mode.
Create analyser node
var analyser = scene.sound.context.createAnalyser();
Configure analyser node
analyser.smoothingTimeConstant = 1;
analyser.fftSize = 8192;
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
smoothingTimeConstant : Averaging constant with the last analysis frame.
0(no time averaging) ~ 1. Default value is 0.8.
fftSize : Window size.
32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, and 32768. Defaults to 2048.
minDecibels : Minimum decibel value for scaling the FFT analysis data.
0 dB is the loudest possible sound, -10 dB is a 10th of that, etc. The default value is -100 dB
maxDecibels : Maximum decibel value for scaling the FFT analysis data.
The default value is -30 dB.
Set source of analyser node
Global volume nodee -> analyser node
scene.sound.masterVolumeNode.connect(analyser);
A sound instance -> analyser node
music.volumeNode.connect(analyser);
Ouput analyser node to audio context
analyser.connect(scene.sound.context.destination);
Create output data array
var dataArrayLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(dataArrayLength);
Get output data
analyser.getByteTimeDomainData(dataArray);
Retrieve output data
for(var i= 0; i < dataArrayLength; i++) {
var data = dataArray[i];
}