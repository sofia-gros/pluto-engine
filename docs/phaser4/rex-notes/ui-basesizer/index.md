Base sizer
Introduction¶
Base class of all ui plugins.
Author: Rex
Usage¶
Background¶
sizer.addBackground(gameObject);
// sizer.addBackground(gameObject, key);
// sizer.addBackground(gameObject, paddingConfig, key);
gameObject : Background game object will be resized after sizer.layout() method.
Round rectangle game object
var gameObject = scene.rexUI.add.roundRectangle(x, y, width, height, radius, fillColor);
Nine-slice game object
var gameObject = scene.add.nineslice(x, y, texture, frame, width, height, leftWidth, rightWidth, topHeight, bottomHeight);
or
var gameObject = scene.make.nineslice({
key: key,
frame: frameName,
leftWidth: 0,
rightWidth: 0,
topHeight: 0,
bottomHeight: 0
});
Nine-patch game object
var gameObject = scene.rexUI.add.ninePatch(x, y, width, height, key, columns, rows, config);
Custom game object which has resize(width, height) method.
Display width, display height will be changed if this background game object does not have resize method.
paddingConfig : Add space between bounds. Default is 0.
A number for left/right/top/bottom bounds,
Or a plain object.
{
left: 0,
right: 0,
top: 0,
bottom: 0
}
key : A string key. Get background game object back via
var child = sizer.getElement(key);
A sizer can have more than one background.
i.e. user can invoke sizer.addBackground(gameObject) many times.
Remove background¶
Remove background child
sizer.removeBackground(gameObject);
Remove background child and destroy it
sizer.removeBackground(gameObject, true);
Remove all background children
sizer.removeAllBackgrounds();
Remove all background children and destroy them
sizer.removeAllBackgrounds(true);
Depth of background¶
Send this background child to bottom of sizer.
sizer.sendChildToBack(gameObject);
Minimum size¶
Get
var minWidth = sizer.minWidth;
var minHeight = sizer.minHeight;
Set
sizer.setMinSize(width, height);
or
sizer.setMinWidth(width);
sizer.setMinHeight(height);
Resize top-most sizer
sizer.setMinSize(width, height).layout()
Dirty¶
Don't layout this sizer if sizer.dirty is false. i.e. Size of this sizer won't be changed, but won't layout children neither.
Default value is true.
Get
var dirty = sizer.dirty;
Set
sizer.setDirty();
// sizer.setDirty(true);
or
sizer.dirty = true;
Clear
sizer.setDirty(false);
or
sizer.dirty = false;
Bounds of sizer¶
Get
var leftBound = sizer.left;
var rightBound = sizer.right;
var topBound = sizer.top;
var bottomBound = sizer.bottom;
var centerX = sizer.centerX;
var centerY = sizer.centerY;
Set
sizer.left = leftBound;
sizer.right = rightBound;
sizer.top = topBound;
sizer.bottom = bottomBound;
sizer.centerX = centerXBound;
sizer.centerY = centerYBound;
or
sizer.alignLeft(leftBound);
sizer.alignRight(rightBound);
sizer.alignTop(topBound);
sizer.alignBottom(bottomBound);
sizer.alignCenterX(centerXBound);
sizer.alignCenterY(centerYBound);
Size of sizer¶
Size
var width = sizer.width;
var height = sizer.height;
Display size
var displayWidth = sizer.displayWidth;
var displayHeight = sizer.displayHeight;
Inner size
var innerWidth = sizer.innerWidth;
var innerHeight = sizer.innerHeight;
Minimum size
var minWidth = sizer.minWidth;
var minHeight = sizer.minHeight;
Minimum inner size
var minInnerWidth = sizer.minInnerWidth;
var minInnerHeight = sizer.minInnerHeight;
Push into bounds¶
Align sizer to bound if overlapping it.
sizer.pushIntoBounds();
or
sizer.pushIntoBounds(bounds);
bounds : Bounds in rectangle object.
Scale¶
Scale up from 0 to current scale of game object.
Pop-up width and height
sizer
//.setScale(scaleX, scaleY)
.popUp(duration);
// sizer.popUp(duration, undefined, ease);
or
sizer
//.setScale(scaleX, scaleY)
.popUpPromise(duration)
.then(function() {
// ....
})
ease : Ease function, default is 'Cubic'.
Pop-up width only
sizer
//.setScaleX(scaleX)
.popUp(duration, 'x');
// sizer.popUp(duration, 'x', ease);
or
sizer
//.setScaleX(scaleX)
.popUpPromise(duration, 'x')
.then(function() {
// ....
})
Pop-up height only
sizer
//.setScaleY(scaleY)
.popUp(duration, 'y');
// sizer.popUp(duration, 'y', ease);
or
sizer
//.setScaleY(scaleY)
.popUpPromise(duration, 'y')
.then(function() {
// ....
})
Pop-up via config
sizer
//.setScale(scaleX, scaleY)
.popUp({
duration: undefined,
orientation: undefined,
ease: undefined,
})
or
sizer
//.setScale(scaleX, scaleY)
.popUpPromise(config)
.then(function() {
// ....
})
orientation : undefined, x, or y
Scale-down destroy
Scale-down width and height
sizer.scaleDownDestroy(duration);
// sizer.scaleDownDestroy(duration, undefined, ease);
or
sizer.scaleDownDestroyPromise(duration)
.then(function() {
// ....
})
ease : Ease function, default is 'Linear'.
Scale-down width only
sizer.scaleDownDestroy(duration, 'x');
// sizer.scaleDownDestroy(duration, 'x', ease);
or
sizer.scaleDownDestroyPromise(duration, 'x');
.then(function() {
// ....
})
Scale-down height only
sizer.scaleDownDestroy(duration, 'y');
// sizer.scaleDownDestroy(duration, 'y', ease);
or
sizer.scaleDownDestroyPromise(duration, 'y')
.then(function() {
// ....
})
Scale-down without destroy
Scale-down width and height
sizer.scaleDown(duration);
// sizer.scaleDown(duration, undefined, ease);
or
sizer.scaleDownPromise(duration, undefined, ease)
.then(function() {
// ....
})
Scale-down width only
sizer.scaleDowny(duration, 'x');
// sizer.scaleDowny(duration, 'x', ease);
or
sizer.scaleDownPromise(duration, 'x', ease)
.then(function() {
// ....
})
Scale-down height only
sizer.scaleDown(duration, 'y');
// sizer.scaleDown(duration, 'y', ease);
or
sizer.scaleDownPromise(duration, 'y', ease)
.then(function() {
// ....
})
Scale up/down, then scale back (yoyo)
Scale up/down, then scale back width and height
sizer
//.setScale(scaleX, scaleY)
.scaleYoyo(duration, peakValue);
// sizer.scaleYoyo(duration, peakValue, repeat, undefined, ease);
or
sizer
//.setScale(scaleX, scaleY)
.scaleYoyoPromise(duration, peakValue, repeat)
.then(function() {
// ....
})
peakValue : Scale to this peak value, then scale back
repeat : Yoyo repeat, default value is 0.
ease : Ease function, default is 'Cubic'.
Scale up/down, then scale back width only
sizer
//.setScaleX(scaleX)
.scaleYoyo(duration, peakValue, 0, 'x');
// sizer.popUp(duration, peakValue, repeat, 'x', ease);
or
sizer
//.setScaleX(scaleX)
.scaleYoyoPromise(duration, peakValue, repeat, 'x')
.then(function() {
// ....
})
Scale up/down, then scale back height only
sizer
//.setScaleY(scaleY)
.scaleYoyo(duration, peakValue, 0, 'y');
// sizer.popUp(duration, peakValue, repeat, 'y', ease);
or
sizer
//.setScaleY(scaleY)
.scaleYoyoPromise(duration, peakValue, repeat, 'y')
.then(function() {
// ....
})
Scale up/down via config
sizer
//.setScale(scaleX, scaleY)
.scaleYoyo({
duration: undefined,
peakValue: 1.2,
repeat: 0,
orientation: undefined,
ease: undefined,
})
or
sizer
//.setScale(scaleX, scaleY)
.scaleYoyoPromise(config)
.then(function() {
// ....
})
orientation : undefined, x, or y
Events
Pop-up complete
sizer.on('popup.complete', function(sizer) { });
Scale-down, scale-down destroy complete
sizer.on('scaledown.complete', function(sizer) { });
Scale up/down, then scale back (yoyo)
sizer.on('scaleyoyo.complete', function(sizer) { });
Fade¶
Fade-in
sizer.fadeIn(duration);
or
sizer.fadeIn(duration, endAlpha);
or
sizer.fadeIn(duration, {start:0, end:1});
or
sizer.fadeInPromise(duration, endAlpha)
.then(function(){
// ...
})
or
sizer.fadeInPromise(duration, {start:0, end:1})
.then(function(){
// ...
})
Fade-out destroy
sizer.fadeOutDestroy(duration);
or
sizer.fadeOutDestroyPromise(duration)
.then(function(){
// ...
})
Fade-out without destroy
sizer.fadeOut(duration);
or
sizer.fadeOutPromise(duration)
.then(function(){
// ...
})
Events
Fade-in complete
sizer.on('fadein.complete', function(sizer) { });
Fade-out, fade-out destroy complete
sizer.on('fadeout.complete', function(sizer) { });
Ease move¶
Move from
sizer.moveFrom(duration, x, y);
// sizer.moveFrom(duration, x, y, ease);
// sizer.moveFrom({x, y, duration, ease});
// sizer.moveFrom({x, y, speed, ease});
or
sizer
.moveFromPromise(duration, x, y, ease)
// .moveFromPromise({x, y, duration, ease})
// .moveFromPromise({x, y, speed, ease})
.then(function(){
// ...
})
x, y : Start position.
Number : Start position x/y.
String(+=300) : Related position of current position x/y.
undefined : Current position x/y.
speed : Get duration according to speed and distance between current sizer position to {x, y}
ease : 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back' ...
Move-from destroy
sizer.moveFromDestroy(duration, x, y);
// sizer.moveFrom(duration, x, y, ease);
// sizer.moveFrom({x, y, duration, ease});
// sizer.moveFrom({x, y, speed, ease});
or
sizer
.moveFromDestroyPromise(duration, x, y, ease)
// .moveFromDestroyPromise({x, y, duration, ease})
// .moveFromDestroyPromise({x, y, speed, ease})
.then(function(){
// ...
})
Move to
sizer.moveTo(duration, x, y);
// sizer.moveTo(duration, x, y, ease);
// sizer.moveTo({x, y, duration, ease});
// sizer.moveTo({x, y, speed, ease});
or
sizer
.moveToPromise(duration, x, y, ease)
// .moveToPromise({x, y, duration, ease})
// .moveToPromise({x, y, speed, ease})
.then(function(){
// ...
})
x, y : End position.
Number : End position x/y.
String(+=300) : Related position of current position x/y.
undefined : Current position x/y.
speed : Get duration according to speed and distance between current sizer position to {x, y}
ease : 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back' ...
Move-to destroy
sizer.moveToDestroy(duration, x, y);
// sizer.moveTo(duration, x, y, ease);
// sizer.moveTo({x, y, duration, ease});
// sizer.moveTo({x, y, speed, ease});
or
sizer
.moveToDestroyPromise(duration, x, y, ease)
// .moveToDestroyPromise({x, y, duration, ease})
// .moveToDestroyPromise({x, y, speed, ease})
.then(function(){
// ...
})
Move-stop
sizer.moveStop();
// sizer.moveStop(true);  // Set to end position
Events
Move-from complete
sizer.on('movefrom.complete', function(sizer) { });
Move-to complete
sizer.on('moveto.complete', function(sizer) { });
Shake¶
Start
sizer.shake(duration);
// sizer.shake(duration, magnitude);
or
sizer.shakePromise(duration, magnitude)
.then(function(){
// ...
})
Events
Shake complete
sizer.on('shake.complete', function(sizer) { });
Ease data¶
Start
sizer.easeDataTo(key, value, duration);
// sizer.easeDataTo(key, value, duration, ease);
// sizer.easeDataTo({ key, value, duration, ease });
// sizer.easeDataTo({ key, value, speed, ease });
or
sizer.easeDataToPromise(key, value, duration, ease)
.then(function(){
// ...
})
Stop
sizer.stopEaseData(key);           // Set to end value
// sizer.stopEaseData(key, false); // Stop at current value
or
sizer.stopAllEaseData();           // Set to end value
// sizer.stopAllEaseData(false);   // Stop at current value
Events
Easing complete
sizer.on('easedata.' + key + '.complete', function(sizer) { });
sizer.on('easedata.complete', function(key, sizer) { });
Delay call¶
sizer.delayCall(delay, callback, scope);
Timer will be removed when destroying game object.
Modal¶
Assign sizer.onCreateModalBehavior callback, or register events to close modal sizer directly.
onCreateModalBehavior :
sizer.onCreateModalBehavior = function(sizer, config) {
// ...
sizer.modalClose(data);
}
config : Passed from sizer.modal(config)
Close modal sizer
sizer.modalClose(data);
Pop this modal sizer
sizer.modal(onClose);  // Use default modal config
or
sizer.modal({
// cover: {
//     color: 0x0,
//     alpha: 0.8,
//     transitIn: function(gameObject, duration) { },
//     transitOut: function(gameObject, duration) { },
// },
// cover: false,
// When to close modal dialog?
// touchOutsideClose: false,
// anyTouchClose: false,
// timeOutClose: false,
// manualClose: false,
// duration: {
//     in: 200,
//     hold: 2000,
//     out: 200
// }
// transitIn: 0,
// transitOut: 0,
// destroy: true
}, onClose);
or
sizer
.modalPromise(config)
.then(function(data){
})
config : See Modal behavior
onClose : Callback when closing modal dialog
function(data) {
}
data : Object passed from sizer.modalClose(data).
Set properties of child¶
sizer.setChildPosition(child, x, y);
sizer.setChildRotation(child, rotation);
sizer.setChildScale(child, scaleX, scaleY);
sizer.setChildDisplaySize(child, width, height);
sizer.setChildVisible(child, visible);
sizer.setChildAlpha(child, alpha);
Depth¶
Get depth of sizer
var depth = sizer.depth;
Set depth of sizer
sizer.setDepth(value, true);
// sizer.depth = depth;
Set depth of sizer and all children
sizer.setDepth(value);
Bring this sizer and its children to top
sizer.bringToTop();
Swap depth with another sizer
sizerA.swapDepth(sizerB);
Increase of sizer and all children
sizer.incDepth(value);
Move game object below this sizer and all children
sizer.moveDepthBelow(gameObject);
Move game object above this sizer and all children
sizer.moveDepthAbove(gameObject);
Bring a child of this sizer to top
sizer.bringChildToTop(gameObject);
Send a child of this sizer to bottom
sizer.sendChildToBack(gameObject);
Scroll factor¶
Set scroll factor to children
sizer.setScrollFactor(x, y);
Change origin¶
sizer.changeOrigin(originX, originY);
This method also will reset all local state of children.
Destroy¶
sizer.destroy();
Drag sizer¶
Drag top-most sizer by child
Enable
sizer.setDraggable(child);
// sizer.setDraggable(child, true);
or
sizer.setDraggable(elementName);
// sizer.setDraggable(elementName, true);
Disable
sizer.setDraggable(child, false);
or
sizer.setDraggable(elementName, false);
Drag top-most sizer by this sizer
Enable
sizer.setDraggable();
// sizer.setDraggable(true);
Disalbe
sizer.setDraggable(false);
Drag target sizer by child
Enable
sizer.setDraggable(child, targetSizer);
// sizer.setDraggable(child, true, targetSizer);
or
sizer.setDraggable(elementName);
// sizer.setDraggable(elementName, true, targetSizer);
Disable
sizer.setDraggable(child, false);
or
sizer.setDraggable(elementName, false);
Drag target config
sizer.setDraggable({
sensor: child, // or elementName
target: undefined, // or a parentSizer
draggable: true
})
sensor : A game object or a string
target
undefined : Top-most sizer
A game object : A parent sizer
Events¶
Fire 'sizer.drag' on target sizer when dragging
targetSizer.on('sizer.drag', function(pointer, dragX, dragY) {
})
Fire 'sizer.dragstart' on target sizer when dragging
targetSizer.on('sizer.dragstart', function(pointer, dragX, dragY) {
})
Fire 'sizer.dragend' on target sizer when dragging
targetSizer.on('sizer.dragend', function(pointer, dragX, dragY, dropped) {
})
Fire 'sizer.drop' on target sizer when dropped
targetSizer.on('sizer.drop', function(pointer, dropZone) {
})
Click¶
Add click event
sizer.onClick(callback, scope);
// sizer.onClick(callback, scope, config);
config : See Button
callback :
function(button, gameObject, pointer, event) {
}
button : Button behavior.
Turn off click event
sizer.offClick(callback, scope);
Enable click event
sizer.enableClick();
Disable click event
sizer.disableClick();
Get click controller
sizer.getClickController();
Equal to
var click = scene.rexUI.add.click(sizer, config);
click.on('click', callback, scope);
Click child¶
Add click event
sizer.onClick(child, callback, scope);
// sizer.onClick(child, callback, scope, config);
Turn off click event
sizer.offClick(child, callback, scope);
Enable click event
sizer.enableClick(child);
Disable click event
sizer.disableClick(child);
Click outside¶
Add click-outside event
sizer.onClickOutside(callback, scope);
// sizer.onClickOutside(callback, scope, config);
config : See ClickOutside
callback :
function(clickOutside, gameObject, pointer) {
}
clickOutside : ClickOutside behavior.
Turn off click-outside event
sizer.offClickOutside(callback, scope);
Enable click-outside event
sizer.enableClickOutside();
Disable click-outside event
sizer.disableClickOutside();
Get click-outside controller
sizer.getClickOutsideController();
Equal to
var clickOutside = scene.rexUI.add.clickOutside(sizer, config);
clickOutside.on('clickoutside', callback, scope);
Click outside of child¶
Add click-outside event
sizer.onClickOutside(child, callback, scope);
// sizer.onClickOutside(child, callback, scope, config);
config : See ClickOutside
callback :
function(clickOutside, gameObject, pointer) {
}
clickOutside : ClickOutside behavior.
Turn off click-outside event
sizer.offClickOutside(child, callback, scope);
Enable click-outside event
sizer.enableClickOutside(child);
Disable click-outside event
sizer.disableClickOutside(child);
Is pointer in bounds¶
Is current sizer clicking
var isClicked = sizer.isPointerInBounds();
Is a child clicking
var isClicked = sizer.isPointerInBounds(child);
or
var isClicked = sizer.isPointerInBounds(elementName);
child : Game object of child
elementName : Element name for retrieveing child game object.
In touching¶
Invoke callbeack if pointer is inside hitarea every tick.
Add in-touching event
sizer.onTouching(callback, scope);
// sizer.onTouching(callback, scope, config);
Turn off in-touching event
sizer.offTouching(callback, scope);
Add touching-end event
sizer.onTouchingEnd(callback, scope);
// sizer.onTouchingEnd(callback, scope, config);
Turn off touching-end event
sizer.offTouchingEnd(callback, scope);
Enable in-touching event
sizer.enableTouching();
Disable in-touching event
sizer.disableTouching();
Equal to
var inTouching = scene.rexUI.add.inTouching(sizer, config);
inTouching.on('intouch', callback, scope);
In touching child¶
Add in-touching event
sizer.onTouching(child, callback, scope);
// sizer.onClick(child, callback, scope, config);
Turn off in-touching event
sizer.offTouching(child, callback, scope);
Enable in-touching event
sizer.enableTouching(child);
Disable in-touching event
sizer.disableTouching(child);
Set children interactive¶
Applies click, tap, press, swipe behaviors on this sizer, to detect input events of children.
sizer.setChildrenInteractive({
// dropZone: false,
// down: undefined,
// up: undefined,
// over: undefined,
// click: {mode: 'release', clickInterval: 100},
// press: {time: 251, threshold: 9},
// tap: {time: 250, tapInterval: 200, threshold: 9, tapOffset: 10,
//       taps: undefined, minTaps: undefined, maxTaps: undefined,},
// swipe: {threshold: 10, velocityThreshold: 1000, dir: '8dir'},
// inputEventPrefix: 'child.',
})
dropZone :
true : Enable drop Zone on this sizer.
false : Do nothing.
down :
false : Don't fire (pointer-) down events
up :
false : Don't fire (pointer-) up events
over :
false : Don't fire (pointer-) over/out events
click : Configuration of Button behavior.
false : Don't install Button behavior.
press : Configuration of Press behavior.
false : Don't install Press behavior.
tap : Configuration of Tap behavior.
false : Don't install Tap behavior.
swipe : Configuration of Swipe behavior.
false : Don't install Swipe behavior.
inputEventPrefix : Prefix string of each event, default is 'child.'.
Note
Input behaviors are installed to this Sizer game object, not each child. And it assumes that all children are not overlapped.
Use Button if user needs to enable/disable input behaviors of each child individually.
Events¶
Pointer-down
sizer.on('child.down', function(child, pointer, event) {
// ...
}, scope);
Pointer-up
sizer.on('child.up', function(child, pointer, event) {
// ...
}, scope);
Pointer-over
sizer.on('child.over', function(child, pointer, event) {
// ...
}, scope);
Pointer-out
sizer.on('child.out', function(child, pointer, event) {
// ...
}, scope);
Click
sizer.on('child.click', function(child, pointer, event) {
// ...
}, scope);
child : Triggered child game object.
pointer : Pointer object.
Press
sizer.on('child.pressstart', function(child, pointer) {
// ...
}, scope);
sizer.on('child.pressend', function(child, pointer) {
// ...
}, scope);
Tap
sizer.on(tapEventName, function(child, pointer, tap) {
// ...
}, scope);
tapEventName :  'child.tap', 'child.1tap', 'child.2tap', 'child.3tap', etc ...
tap : Tap object.
tap.tapsCount : Taps count.
Swipe
sizer.on(swipeEventName, function(child, pointer, swipe) {
// ...
}, scope);
swipeEventName :  'child.swipe', 'child.swipeleft', 'child.swiperight', 'child.swipeup', 'child.swipedown'.
swipe : Swipe object.
swipe.left, swipe.right, swipe.up, swipe.down : Swipe direction states.
Bind event¶
Bind event
sizer.bindEvent(eventEmitter, eventName, callback, scope);
Bind scene's 'preupdate' event
sizer.bindScenePreupdateEvent(callback, scope);
Bind scene's 'update' event
sizer.bindSceneUpdateEvent(callback, scope);
Bind scene's 'postupdate' event
sizer.bindScenePostupdateEvent(callback, scope);
Bind scene's 'render' event
sizer.bindSceneRenderEvent(callback, scope);
Bind scene's 'pause' event
sizer.bindScenePauseEvent(callback, scope);
Bind scene's 'resume' event
sizer.bindSceneResumeEvent(callback, scope);
Bind scene's 'sleep' event
sizer.bindSceneSleepEvent(callback, scope);
Bind scene's 'wake' event
sizer.bindSceneWakeEvent(callback, scope);
Bind scene's 'shutdown' event
sizer.bindSceneShutdownEvent(callback, scope);
Will remove this event from eventEmitter when destroying sizer.
Pin game object¶
sizer.pin(gameObject);
or
sizer.pinLocal(gameObject);
Note
Method sizer.add is override in each sizer class usually.
Un-pin game object¶
sizer.unpin(child);
// sizer.unpin(child, destroyChild);
destroyChild : Set true to destroy child. Default is false.
Note
Method sizer.remove is override in each sizer class usually.
Draw bounds¶
Draw bounds of shown game object on a graphics game object
sizer.drawBounds(graphics);
// sizer.drawBounds(graphics, color);
graphics : Graphics game object
color : Default value is 0xffffff
Draw bounds of shown game object, and display name of child
sizer.drawBounds(graphics, {
// color: 0xffffff,
// lineWidth: 2,
// name: false,
// name: true,
// name: {
//     createTextCallback: function(scene) {
//         return scene.add.text(0, 0, '');
//     },
//     createTextCallbackScope: undefined,
//     align: 'left-top'
// }
});
graphics : Graphics game object
color : Default value is 0xffffff.
lineWidth : Default value is 1.
name :
false : Don't display child name, default value
true : Display child name with default text game object, aligned at left-top of child bounds.
Plain object :
name.createTextCallback : Callback of creating customized text game object for child name
function(scene, child, childBoundsRect) {
// return scene.add.text(0, 0, '');
}
name.createTextCallbackScope : Callback scope of name.createTextCallback, default is undefined
name.align :
'left-top', or Phaser.Display.Align.TOP_LEFT : Align text game object at left-top. Default value
'center', or Phaser.Display.Align.CENTER : Align text game object at center
'left', or Phaser.Display.Align.LEFT_CENTER : Align text game object at left-center
'right', or Phaser.Display.Align.RIGHT_CENTER : Align text game object at right-center
'top', or Phaser.Display.Align.RIGHT_CENTER : Align game text object at top-center
'bottom', or Phaser.Display.Align.BOTTOM_CENTER : Align game text object at bottom-center
'left-bottom', or Phaser.Display.Align.BOTTOM_LEFT : Align text game object at left-bottom
'right-top', or Phaser.Display.Align.TOP_RIGHT : Align text game object at right-top
'right-bottom', or Phaser.Display.Align.BOTTOM_RIGHT : Align text game object at right-bottom
Text game objects of these children's name will be attached on graphics game object, graphics.clear(), or graphics.destroy() will also destroy these text game objects
Hide¶
Set invisible, won't layout it
sizer.hide();
or
sizer.hide(gameObject);
Set visible, will layout it
sizer.show();
or
sizer.show(gameObject);
Padding¶
Set inner padding, will indent children position.
Set inner padding via config
sizer.setInnerPadding({
left: leftPadding,
right: rightPadding,
top: topPadding,
bottom: bottomPadding
});
Set inner padding via single number
sizer.setInnerPadding(value);
Set specific inner padding
sizer.setInnerPadding(key, value);
key : 'left', 'right', 'top', 'bottom'
Get inner padding
Get inner padding values
var innerPadding = sizer.getInnerPadding();
Get specific inner padding
var value = sizer.getInnerPadding(key);
key : 'left', 'right', 'top', 'bottom'
Set outer padding, which is equal to padding parameter when adding this sizer to parent sizer.
Set outer padding via config
sizer.setOuterPadding({
left: leftPadding,
right: rightPadding,
top: topPadding,
bottom: bottomPadding
});
Set outer padding via single number
sizer.setOuterPadding(value);
Set specific outer padding
sizer.setOuterPadding(key, value);
key : 'left', 'right', 'top', 'bottom'
Get outer padding
Get outer padding values
var outerPadding = sizer.getOuterPadding();
Get specific outer padding
var value = sizer.getOuterPadding(key);
key : 'left', 'right', 'top', 'bottom'
Set outer padding of child, which is equal to padding parameter when adding this sizer to parent sizer.
Set outer padding via config
sizer.setChildOuterPadding(
child,
{
left: leftPadding,
right: rightPadding,
top: topPadding,
bottom: bottomPadding
}
);
child : A string key or game object.
Set outer padding via single number
sizer.setChildOuterPadding(child, value);
child : A string key or game object.
Set specific outer padding
sizer.setChildOuterPadding(child, key, value);
child : A string key or game object.
key : 'left', 'right', 'top', 'bottom'
Get outer padding of child
Get outer padding values
var outerPadding = sizer.getChildOuterPadding(child);
child : A string key or game object.
Get specific outer padding
var value = sizer.getChildOuterPadding(child, key);
child : A string key or game object.
key : 'left', 'right', 'top', 'bottom'
Anchor¶
sizer.setAnchor({
// left: '0%+0',
// right: '0%+0',
// centerX: '0%+0',
// x: '0%+0',
// top: '0%+0',
// bottom: '0%+0',
// centerY: '0%+0',
// y: '0%+0'
})
left, right, centerX, x, top, bottom, centerY, y : Position based on visible window, which composed of
Percentage of visible width/height : 'p%', p: 0~100
'left'(=0%), 'center'(=50%), 'right'(=100%)
'top'(=0%), 'center'(=50%), 'bottom'(=100%)
Offset : '+n', or '-n'
For example, anchor game object's left bound to viewport's left+10, and centerY to viewport's center :
{
left: 'left+10',
centerY: 'center'
}
Get child¶
Get child by specific key
Add child
sizer.addChildrenMap(key, child);
Remove children map :
sizer.removeChildrenMap(key);
or
sizer.removeChildrenMap(child);
Get child
var child = sizer.getElement(key);
Get child by name
var child = sizer.getByName(name);
// var child = sizer.getByName(name, recursive);
recursive : Set true to search all children recursively.
Get parent¶
Get parent sizer
var parentSizer = sizer.getParentSizer();
Get ancestor sizer matched given name
var parentSizer = sizer.getParentSizer(name);
Get topmost sizer
var topmostSizer = sizer.getTopmostSizer();
Has parent/child¶
Has parent
var hasParent = sizer.hasParentSizer(parentGameObject);
Has child
var hasChild = sizer.hasParentSizer(childGameObject);
Is in touching¶
Is this sizer in touching?
var isTouching = sizer.isInTouching();
Is child of this sizer in touching?
var isTouching = sizer.isInTouching(child);
or
var isTouching = sizer.isInTouching(childKey);
child : Child game object.
childKey : Get child game object back via sizer.getElement(childKey). See also sizer.addChildrenMap(key, child)
Change properties of child¶
Set property of child from sizer
Set property of child, then reset local state of child
Tween local state of child
Add to container¶
Add to built-in container
p3Container.add(sizer);
or
sizer.addToContainer(p3Container);
container : Container game object.
Add to Layer
sizer.addToLayer(layer);
layer : Layer game object.
Note
container.add(sizer), or layer.add(sizer) won't add children of sizer.
Renderer layer¶
A sizer/containerLite can have an internal renderer layer.
All children will be put into this internal layer, instead of displayList of scene,
and ContainerLite will be very bottom of all children.
Enable renderer layer before adding any child.
container.enableLayer();
Shader effects¶
Apply post-fx pipeline on layer of sizer.
Snapshot¶
Draw all visible children on a render-texture.
var renderTexture = container.snapshot({
renderTexture: undefined,
padding: 0
});
renderTexture : Draw on this render-texture
undefined : Create a new render-texture
padding :
0 : No extra padding space. Default value.
A number : Add extra padding space around this render-texture.
Draw all visible children on a texture
container.snapshot({
padding: 0,
saveTexture: textureKey
});
saveTexture : Save render result to texture manager.
Layout children¶
Note
Enable sizer events by set sizerEvents to true in config.
Fire 'sizer.postlayout' event to all children after layout.
child.on('sizer.postlayout', function(child, sizer){
var prevState = sizer.getChildPrevState(child);
})
prevState : Properties before layout.
prevState.x, prevState.y : Child position before layout.
prevState.width, prevState.height,
prevState.displayWidth, prevState.displayHeight,
prevState.scaleX, prevState.scaleY : Child size before layout.
Fire 'postlayout' event.
sizer.on('postlayout', function(children, sizer) {
for(var i=0, cnt=children.length; i<cnt; i++) {
var prevState = sizer.getChildPrevState(children[i]);
// ...
}
})
Remove child¶
Note
Enable sizer events by set sizerEvents to true in config.
Fire 'sizer.remove' event to removed without destroyed child.
child.on('sizer.remove', function(child, sizer){
})
Fire 'remove' event.
sizer.on('remove', function(child, sizer){
})
Add child¶
Note
Enable sizer events by set sizerEvents to true in config.
Fire 'sizer.add' event to added child.
child.on('sizer.add', function(child, sizer){
})
Fire 'add' event.
sizer.on('add', function(child, sizer){
})
Broadcast event¶
Fire event to sizer itself and all children
sizer.broadcastEvent(eventName, parameter0, parameter1, ...);
Receive event
child.on(eventName, function(parameter0, parameter1, ...) {
}, scope);
Other properties¶
This game object inherits from ContainerLite.