Scene manager
Scene manager plugin:
In each scene instance: scene.scene
Add new scene¶
var newScene = scene.scene.add(key, sceneConfig, autoStart, data);
// var newScene = game.scene.add(key, sceneConfig, autoStart, data);
key : A unique key used to reference the Scene.
sceneConfig :
A scene class
A plain object
{
init(data) {},
preload() {},
create(data) {},
update(time, delta) {},
extend: {
data: {},
// ...
},
}
autoStart : Set true to start scene immediately after added.
data : Optional data object. This will be set as scene.settings.data and passed to scene.init.
Load scene from external files¶
load script
scene.load.script(key, url);
add new scene
scene.scene.add(key, sceneConfig, autoStart);
// game.scene.add(key, sceneConfig, autoStart);
Destroy scene¶
scene.scene.remove(key);
Fires scene.events destroy
Start scene¶
Launch the given Scene and run it in parallel with this one
scene.scene.launch(key, data);
Shutdown this Scene and run the given one
scene.scene.start(key, data);
Restarts this Scene
scene.scene.restart(data);
Pause/Resume scene¶
Pause : stops the update step but still renders
scene.scene.pause(key);
// scene.scene.pause();  // pause myself
Fires scene.events pause
Resume : starts the update loop again
scene.scene.resume(key);
// scene.scene.resume();  // resume myself
Fires scene.events resume
Sleep : no update, no render but doesn't shutdown
scene.scene.sleep(key);
// scene.scene.sleep();  // sleep myself
Fires scene.events sleep
Wake-up: starts update and render
scene.scene.wake(key);
// scene.scene.wake();  // wake-up myself
Fires scene.events wake
Makes this Scene sleep then starts the Scene given
scene.scene.switch(key, data);
Run scene¶
Runs the given Scene, but does not change the state of this Scene.
If the given Scene is paused, it will resume it. If sleeping, it will wake it.
If not running at all, it will be started.
scene.scene.run(key, data);
Stop scene¶
Shutdown the Scene, clearing display list, timers, etc.
scene.scene.stop(key);
// scene.scene.stop();  // stop myself
Set visible¶
scene.scene.setVisible(value, key);  // value: true/false
// scene.scene.setVisible(value);    // set visible to myself
Read status¶
var isSleep = scene.scene.isSleeping(key);
// var isSleep = scene.scene.isSleeping();
var isPaused = scene.scene.isPaused(key);
// var isPaused = scene.scene.isPaused();
var isActive = scene.scene.isActive(key);
// var isActive = scene.scene.isActive();
var isVisible = scene.scene.isVisible(key);
// var isVisible = scene.scene.isVisible();
Update/isActive
Render/isVisible
Run
Pause
Sleep
Pause/Sleep/Stop
Pause: Pause update stage.
Sleep: Pause update stage, and set scene invisible.
Stop: Shoutdown, clearing display list, timers, etc.
var status = scene.scene.getStatus(key);
// var status = scene.scene.getStatus();
status :
Phaser.Scenes.PENDING, or 0
Phaser.Scenes.INIT, or 1
Phaser.Scenes.START, or 2
Phaser.Scenes.LOADING, or 3
Phaser.Scenes.CREATING, or 4
Phaser.Scenes.RUNNING, or 5
Phaser.Scenes.PAUSED, or 6
Phaser.Scenes.SLEEPING, or 7
Phaser.Scenes.SHUTDOWN, or 8
Phaser.Scenes.DESTROYED, or 9
Get scene¶
var scene = scene.scene.get(key);
Order of scenes¶
Swaps the position of two scenes in the Scenes list.
scene.scene.swapPosition(keyA, keyB);
// scene.scene.stop(keyA);
scene.scene.moveAbove(keyA, keyB);
// scene.scene.moveAbove(keyA);
Scene B is directly above Scene A.
scene.scene.moveBelow(keyA, keyB);
// scene.scene.moveBelow(keyA);
Scene B is directly below Scene A.
scene.scene.moveUp(keyA);
// scene.scene.moveBelow();
scene.scene.moveDown(keyA);
// scene.scene.moveDown();
scene.scene.bringToTop(keyA);
// scene.scene.bringToTop();
scene.scene.sendToBack(keyA);
// scene.scene.sendToBack();
Transition¶
scene.scene.transition({
target: key,
// data: null,
// moveAbove: false,
// moveBelow: false,
duration: 1000,
// remove: false,
// sleep: false,
// allowInput: false,
// onStart: null,
// onStartScope: scene,
// onUpdate: null,
// onUpdateScope: scene,
})
target : The Scene key to transition to.
data : An object containing any data you wish to be passed to the target scenes init / create methods.
moveAbove. moveBelow : Move the target Scene to be above/below this current scene before the transition starts.
duration : Transition duration, in ms.
remove : Set true to remove this scene.
sleep : Set true to sleep this scene, set false to stop this scene.
allowInput : Set true to enable input system of current scene and target scene.
onStart, onStartScope : Invoked when transition start
function(fromScene, toScene, duration) {
}
fromScene : Current scene instance
toScene : Target scene instance
duration : Transition duration, in ms.
onUpdate ,onUpdateScope : Transition callback in each tick.
function(progress) {
}
progress : 0 ~ 1
Execution flow¶
Invoke scene.scene.transition method.
Current scene :
Fire 'transitionout' event.
fromScene.events.on('transitionout', function(targetScene, duration){ });
Run transition's onUpdate callback every tick.
Current scene's update method is still running every tick.
Target scene :
Start target scene immediately.
Fire target scene's 'transitionstart' event. (Register this event in create stage)
targetScene.events.on('transitionstart', function(fromScene, duration){ });
When transition completed.
Current scene :
Remove or sleep current scene after transition completed.
Target scene :
Fire target scene's transitioncomplete event.
targetScene.events.on('transitioncomplete', function(fromScene){ });
Events¶
boot
scene.events.on('transitioninit', function(fromScene, duration)){ });
start
scene.events.on('transitionstart', function(fromScene, duration){ });
transition-out
scene.events.on('transitionout', function(targetScene){ });
complete
scene.events.on('transitioncomplete', function(fromScene){ });
wake : wake-up target scene if it was previously asleep
scene.events.on('transitionwake', function(fromScene, duration){ });
System scene¶
A default empty Scene that lives outside of the Scene list,
but can be used by plugins and managers that need access to a live Scene,
without being tied to one.
var scene = scene.scene.get('__SYSTEM');
or
var scene = scene.scene.systemScene;