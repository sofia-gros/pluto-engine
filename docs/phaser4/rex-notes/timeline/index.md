Timeline
Introduction¶
Schedule commands to happen at specific times in the future, built-in object of phaser.
Author: Phaser Team
Usage¶
Create timeline¶
var timeline = scene.add.timeline([
{
// Time condition
at: 0,
in:
from:
// Enable condition
if(event) {
// this: target parameter
return true;  // false
},
set: {
key: value,
},
tween: {
targets: gameObject,
alpha: 1,
ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
duration: 1000,
repeat: 0,            // -1: infinity
yoyo: false
},
run(){
// this: target parameter
},
loop() {
},
sound: '',
event: '',
// target: this,
// once: false,
// stop: false,
},
// ...
])
Time :
at : Absolute delay time after starting in ms.
in : Absolute delay time after current time in ms.
from : Relative delay time after previous event in ms
Enable :
if : A function. Invoking every tick, run actions when it returns true.
Actions :
set : A key-value object of properties to set on the target.
tween : tween config
run : A function which will be called when the Event fires.
function() {
// this: target parameter
}
loop : A function which will be called when the Event sequence repeat again.
function() {
// this: target parameter
}
sound :
A string : A key from the Sound Manager to play
A config object for a sound to play when the Event fires.
{
key,
config
}
key : The key of the sound to play
config : config of playing sound
event : String-based event name to emit when the Event fires. The event is emitted from the Timeline instance.
timeline.on(eventName);
target : The scope (this object) with which to invoke the run.
Control
once : If set, the Event will be removed from the Timeline when it fires.
stop : If set, the Timeline will stop and enter a complete state when this Event fires, even if there are other events after it.
The Timeline always starts paused.
Steps of commands¶
For each tick, for each command :
Test time (at, in, from)
Test enable (if)
Run actions (set, tween, run, sound, event)
Control (once, stop)
Start¶
timeline.play();
Restart¶
timeline.play(true);
Start with repeat¶
Repeat infinite
timeline.repeat().play();
// timeline.repeat(true).play();
// timeline.repeat(-1).play();
Amount of times to repeat
timeline.repeat(amount).play();
amount : A positive number
No repeat
timeline.repeat(false);
Current loop counter
var loopCounter = timeline.iteration;
Stop¶
timeline.stop();
Pause / Resume¶
timeline.pause();
// timeline.paused = true;
timeline.resume();
// timeline.paused = false;
Will also pause/resume currently active Tweens.
Reset¶
Resets this Timeline back to the start, include loop counter.
If the Timeline had any events that were set to once that have already been removed,
they will not be present again after calling this method.
timeline.reset();
If the Timeline isn't currently running (i.e. it's paused or complete) then
calling this method resets those states, the same as calling Timeline.play(true) (restart).
Add command¶
timeline.add(config);
or
timeline.add([config0, config1, ...]);
Clear all commands¶
timeline.clear();
Will also destroy currently active Tweens.
Events¶
On all commands are completed
timeline.on('complete', function(){
});
Other properties¶
Timeline is currently playing, not paused or not complete.
var isPlaying = timeline.isPlaying()
Is paused
var isPaused = timeline.paused;
All commands are complete
var isCompleted = timeline.complete;
Destroy¶
Also remove updating.
timeline.destroy();
Will also destroy currently active Tweens.