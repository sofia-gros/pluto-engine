Timer
Introduction¶
Execute callback when time-out, built-in object of phaser.
Author: Phaser Team
Usage¶
Start timer¶
Looped timer
var timer = scene.time.addEvent({
delay: 500,                // ms
callback: callback,
//args: [],
callbackScope: thisArg,
loop: true
});
Repeat timer
var timer = scene.time.addEvent({
delay: 500,                // ms
callback: callback,
//args: [],
callbackScope: thisArg,
repeat: 4
});
Oneshot timer
var timer = scene.time.delayedCall(delay, callback, args, scope);  // delay in ms
All properties of timer
var timer = scene.time.addEvent({
delay: 500,                // ms
callback: callback,
args: [],
callbackScope: thisArg,
loop: false,
repeat: 0,
startAt: 0,
timeScale: 1,
paused: false
});
Reuse timer
timer.reset({
delay: 500,                // ms
callback: callback,
args: [],
callbackScope: thisArg,
loop: false,
repeat: 0,
startAt: 0,
timeScale: 1,
paused: false
})
scene.time.addEvent(timer);
Note
Throw error message if delay : 0 with (repeat > 0 or loop: true)
Pause/resume¶
Pause timer
timer.paused = true;
Resume timer
timer.paused = false;
Is paused
var isPaused = timer.paused;
Stop¶
Stop a running timer
timer.remove();
Remove from timeline's all internal lists, for timer re-using
scene.time.removeEvent(timer);
Time scale¶
Set
timer.timeScale = 2;
Get
var timeScale = timer.timeScale;
Other properties¶
Get elapsed time
var elapsed = timer.getElapsed();   // ms
var elapsed = timer.getElapsedSeconds(); // sec
// var elapsed = timer.elapsed;  // ms
Get remaining time
var remaining = timer.getRemaining();   // ms
var remaining = timer.getRemainingSeconds(); // sec
// var remaining = timer.getOverallRemaining();   // ms
// var remaining = timer.getOverallRemainingSeconds(); // sec
Get repeat count
var repeat = timer.getRepeatCount();
Gets the progress of the current iteration
var progress = timer.getProgress();  // elapsed / delay
Gets the progress of the timer overall, factoring in repeats.
var progress = timer.getOverallProgress();  // totalElapsed / totalDuration
Get delay time
var delay = timer.delay;   // ms