Touch events
Introduction¶
Built-in touch/mouse events of phaser.
Author: Phaser Team
Note
No touch input event fired in preload stage.
Usage¶
Quick start¶
Is touching
var pointer = scene.input.activePointer;
if (pointer.isDown) {
var touchX = pointer.x;
var touchY = pointer.y;
// ...
}
On any touching start
scene.input.on('pointerdown', function(pointer){
var touchX = pointer.x;
var touchY = pointer.y;
// ...
}, scope);
On any touching end
scene.input.on('pointerup', function(pointer){
var touchX = pointer.x;
var touchY = pointer.y;
// ...
}, scope);
On touch game object start
gameObject.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
// ...
}, scope);
On touch game object end
gameObject.setInteractive().on('pointerup', function(pointer, localX, localY, event){
// ...
}, scope);
Drag game object
gameObject
.setInteractive({ draggable: true })
.on('dragstart', function(pointer, dragX, dragY){
// ...
}, scope);
.on('drag', function(pointer, dragX, dragY){
gameObject.setPosition(dragX, dragY);
}, scope);
.on('dragend', function(pointer, dragX, dragY, dropped){
// ...
}, scope);
Reference : Properties of point
Register interactive¶
Call gameObject.setInteractive(...) to register touch input of Game Object before listening touching events.
Set hit area from width & height (rectangle) of the texture
gameObject.setInteractive();
Set hit area from game object
gameObject.setInteractive(shape, callback);
Circle
shape : new Phaser.Geom.Circle(x, y, radius)
callback : Phaser.Geom.Circle.Contains
Ellipse
shape : new Phaser.Geom.Ellipse(x, y, width, height)
callback : Phaser.Geom.Ellipse.Contains
Rectangle
shape : new Phaser.Geom.Rectangle(x, y, width, height)
callback : Phaser.Geom.Rectangle.Contains
Triangle
shape : new Phaser.Geom.Triangle(x1, y1, x2, y2, x3, y3)
callback : Phaser.Geom.Triangle.Contains
Polygon
shape : new Phaser.Geom.Polygon(points)
callback : Phaser.Geom.Polygon.Contains
Hexagon
shape : new Phaser.Geom.rexHexagon(x, y, size, type)
callback : Phaser.Geom.Polygon.Contains
Rhombus
shape : new Phaser.Geom.rexRhombus(x, y, width, height)
callback : Phaser.Geom.Polygon.Contains
Note: x, y relate to the top-left of the gameObject.
Set hit area from input plugin
scene.input.setHitArea(gameObjects, shape, callback);
Circle
scene.input.setHitAreaCircle(gameObjects, x, y, radius);
// scene.input.setHitAreaCircle(gameObjects, x, y, radius, callback); // callback = Circle.Contains
Ellipse
scene.input.setHitAreaEllipse(gameObjects, x, y, width, height);
// scene.input.setHitAreaEllipse(gameObjects, x, y, width, height, callback); // callback = Ellipse.Contains
Rectangle
scene.input.setHitAreaRectangle(gameObjects, x, y, width, height);
// scene.input.setHitAreaRectangle(gameObjects, x, y, width, height, callback); // callback = Rectangle.Contains
Triangle
scene.input.setHitAreaTriangle(gameObjects, x1, y1, x2, y2, x3, y3);
// scene.input.setHitAreaTriangle(gameObjects, x1, y1, x2, y2, x3, y3, callback); // callback = Triangle.Contains
Note: x, y relate to the top-left of the gameObject.
Set interactive configuration
gameObject.setInteractive({
hitArea: shape,
hitAreaCallback: callback,
hitAreaDebug: shape,
draggable: false,
dropZone: false,
useHandCursor: false,
cursor: CSSString,
pixelPerfect: false,
alphaTolerance: 1
});
Hit area
shape
Pixel alpha
pixelPerfect : true
alphaTolerance : 1 (0-255)
Custom hit-testing function
hitAreaCallback
function(shape, x, y, gameObject) {
return hit;  // true/false
}
shape : Hit area object
x, y : Local position of texture.
gameObject : Game object.
hitAreaDebug : Debug shape.
Dragging
draggable : true
Drop zone
dropZone : true
Cursor
cursor : CSS string
useHandCursor : true
Pixel perfect hit-testing
This is an expensive process, should only be enabled on Game Objects that really need it.
Disable interactive¶
Disable temporary
gameObject.disableInteractive();
// gameObject.disableInteractive(resetCursor);
resetCursor : Should the currently active Input cursor, if any, be reset to the default cursor?
Remove interaction
gameObject.removeInteractive();
// gameObject.removeInteractive(resetCursor);
resetCursor : Should the currently active Input cursor, if any, be reset to the default cursor?
Top only¶
When set to true this Input Plugin will emulate DOM behavior by only emitting events from the top-most Game Objects in the Display List.
If set to false it will emit events from all Game Objects below a Pointer, not just the top one.
Get
var topOnly = scene.input.topOnly;
Set
scene.input.topOnly = topOnly;
scene.input.setTopOnly(topOnly);
Each scene can has its own scene.input.topOnly setting.
Touch events¶
Trigger these events from top scene to bottom scene.
Events on touched Game object
gameObject.on('pointerdown', function(pointer, localX, localY, event){ /* ... */ }, scope);
gameObject.on('pointerup', function(pointer, localX, localY, event){ /* ... */ }, scope);
gameObject.on('pointermove', function(pointer, localX, localY, event){ /* ... */ }, scope);
gameObject.on('pointerover', function(pointer, localX, localY, event){ /* ... */ }, scope);
gameObject.on('pointerout', function(pointer, event){ /* ... */ }, scope);
Cancel remaining touched events
function(pointer, localX, localY, event) {
event.stopPropagation();
}
Event on input plugin for each touched Game object
scene.input.on('gameobjectdown', function(pointer, gameObject, event){ /* ... */ }, scope);
scene.input.on('gameobjectup', function(pointer, gameObject, event){ /* ... */ }, scope);
scene.input.on('gameobjectmove', function(pointer, gameObject, event){ /* ... */ }, scope);
scene.input.on('gameobjectover', function(pointer, gameObject, event){ /* ... */ }, scope);
scene.input.on('gameobjectout', function(pointer, gameObject, event){ /* ... */ }, scope);
Cancel remaining touched events
function(pointer, gameObject, event) {
event.stopPropagation();
}
Events to get all touched Game Objects
scene.input.on('pointerdown', function(pointer, currentlyOver){ /* ... */ }, scope);
scene.input.on('pointerdownoutside', function(pointer){ /* ... */ }, scope);
scene.input.on('pointerup', function(pointer, currentlyOver){ /* ... */ }, scope);
scene.input.on('pointerupoutside', function(pointer){ /* ... */ }, scope);
scene.input.on('pointermove', function(pointer, currentlyOver){ /* ... */ }, scope);
scene.input.on('pointerover', function(pointer, justOver){ /* ... */ }, scope);
scene.input.on('pointerout', function(pointer, justOut){ /* ... */ }, scope);
scene.input.on('gameout', function(timeStamp, domEvent){ /* ... */ }, scope);
scene.input.on('gameover', function(timeStamp, domEvent){ /* ... */ }, scope);
Check pointer.camera in multiple-cameras scene.
Game canvas¶
scene.input.on('gameout', function(timeStamp, event){ /* ... */ }, scope);
scene.input.on('gameover', function(timeStamp, event){ /* ... */ }, scope);
Dragging¶
Enable dragging¶
Enable dragging when registering interactive
gameObject.setInteractive({ draggable: true });
Enable dragging and add it to dragging detecting list after registered interactive
scene.input.setDraggable(gameObject);
Enable dragging
gameObject.input.draggable = true;
Disable dragging¶
Remove Game Object from dragging detecting list
scene.input.setDraggable(gameObject, false);
Disable dragging but keep it in dragging detecting list
gameObject.input.draggable = false;
Dragging events¶
gameObject.on('dragstart', function(pointer, dragX, dragY){ /* ... */ }, scope);
gameObject.on('drag', function(pointer, dragX, dragY){ /* ... */ }, scope);
gameObject.on('dragend', function(pointer, dragX, dragY, dropped){ /* ... */ }, scope);
scene.input.on('dragstart', function(pointer, gameObject){ /* ... */ }, scope);
scene.input.on('drag', function(pointer, gameObject, dragX, dragY){ /* ... */ }, scope);
scene.input.on('dragend', function(pointer, gameObject, dropped){ /* ... */ }, scope);
dropped : 'dragend' and also 'drop'.
Dragging properties¶
scene.input.dragDistanceThreshold = 16;
scene.input.dragTimeThreshold = 500;
Drop zone¶
Enable drop zone¶
Enable dropping when registering interactive
gameObject.setInteractive({ dropZone: true });
Enable dropping after registered interactive
gameObject.input.dropZone = true;
Disable drop zone¶
gameObject.input.dropZone = false;
Dropping events¶
gameObject.on('drop', function(pointer, target){ /* ... */ }, scope);
gameObject.on('dragenter', function(pointer, target){ /* ... */ }, scope);
gameObject.on('dragover', function(pointer, target){ /* ... */ }, scope);
gameObject.on('dragleave', function(pointer, target){ /* ... */ }, scope);
scene.input.on('drop', function(pointer, gameObject, target){ /* ... */ }, scope);
scene.input.on('dragenter', function(pointer, gameObject, target){ /* ... */ }, scope);
scene.input.on('dragover', function(pointer, gameObject, target){ /* ... */ }, scope);
scene.input.on('dragleave', function(pointer, gameObject, target){ /* ... */ }, scope);
Force state of pointer¶
Down state
scene.input.forceDownState(pointer, gameObject);
Emit 'pointerdown' event from game object.
Emit 'gameobjectdown' event from scene.input.
Up state
scene.input.forceUpState(pointer, gameObject);
Emit 'pointerup' event from game object.
Emit 'gameobjectup' event from scene.input.
Over state
scene.input.forceOverState(pointer, gameObject);
Emit 'pointerover' event from game object.
Emit 'gameobjectover' event from scene.input.
Out state
scene.input.forceOutState(pointer, gameObject);
Emit 'pointerout' event from game object.
Emit 'gameobjectout' event from scene.input.
First event of all¶
scene.input.on('preupdate', function() { /* ... */ }, scope);
Single touch¶
Pointer¶
var pointer = scene.input.activePointer;
Multi-touch¶
Amount of active pointers¶
Set amount of active pointers in game configuration
var config = {
// ...
input: {
activePointers: 1,
// ...
}
};
var game = new Phaser.Game(config);
Or add pointers in run-time.
scene.input.addPointer(num);  // total points = num + 1
Pointers¶
pointer 1 ~ 10
var pointer = scene.input.pointer1;
// ...
var pointer = scene.input.pointer10;
pointer n
var pointer = scene.input.manager.pointers[n];
Amount of total pointers
var amount = scene.input.manager.pointersTotal;
1 in desktop
2 in touch device. (0 for mouse, 1 for 1 touch pointer)
Pointer¶
Position
Current touching
Position in screen : pointer.x , pointer.y
Position in camera :
Single camera :
var worldX = pointer.worldX;
var worldY = pointer.worldY;
Multiple cameras :
var worldXY = pointer.positionToCamera(camera);  // worldXY: {x, y}
// var worldXY = pointer.positionToCamera(camera, worldXY);
var worldX = worldXY.x;
var worldY = worldXY.y;
Camera
var camera = pointer.camera;
Position of previous moving : pointer.prevPosition.x , pointer.prevPosition.y
Updating when pointer-down, potiner-move, or pointer-up.
Interpolated position :
var points = pointer.getInterpolatedPosition(step);
// var out = pointer.getInterpolatedPosition(step, out);
Drag
Touching start : pointer.downX, pointer.downY
Touching end : pointer.upX, pointer.upY
Drag distance between pointer-down to latest pointer : pointer.getDistance()
Horizontal drag distance : pointer.getDistanceX()
Vertical drag distance : pointer.getDistanceY()
Drag angle : pointer.getAngle()
Time
Touching start : pointer.downTime
Touching end : pointer.upTime
Drag : pointer.getDuration()
Touch state
Is touching/any button down :  pointer.isDown
Is primary button down : pointer.primaryDown
Button state : pointer.button
On Touch devices the value is always 0.
Button down
No button down : pointer.noButtonDown()
Is primary (left) button down : pointer.leftButtonDown()
Is secondary (right) button down : pointer.rightButtonDown()
Is middle (mouse wheel) button down : pointer.middleButtonDown()
Is back button down : pointer.backButtonDown()
Is forward button down : pointer.forwardButtonDown()
Button released
Is primary (left) button released : pointer.leftButtonReleased()
Is secondary (right) button released : pointer.rightButtonReleased()
Is middle (mouse wheel) button released : pointer.middleButtonReleased()
Is back button released : pointer.backButtonReleased()
Is forward button released : pointer.forwardButtonReleased()
Index in scene.input.manager.pointers : pointer.id
Motion
Angle: pointer.angle
Distance: pointer.distance
Velocity: pointer.velocity
pointer.velocity.x, `pointer.velocity.y
Input object¶
gameObject.input : Game object's input object.
gameObject.input.localX, gameObject.input.localY : Pointer to local position of texture.
gameObject.input.dragStartX, gameObject.input.dragStartY : The x/y coordinate of the Game Object
that owns this Interactive Object when the drag started.
gameObject.input.dragStartXGlobal, gameObject.input.dragStartYGlobal : The x/y coordinate that
the Pointer started dragging this Interactive Object from.
gameObject.input.dragX, gameObject.input.dragY : The x/y coordinate that this Interactive Object
is currently being dragged to.
Smooth¶
Get touch position from interpolation of previous touch position and current touch position.
Touch-position = (current-touch-position * smooth-factor) + (previous-touch-position * (1 - smooth-factor))
Set smooth factor. In game configuration
var config = {
// ....
input: {
smoothFactor: 0
}
}
Get touch position
var x = pointer.x;
var y = pointer.y;
var worldX = pointer.worldX;
var worldY = pointer.worldY;
Debug¶
Enable, draw shape of (shape) hit area.
scene.input.enableDebug(gameObject);
// scene.input.enableDebug(gameObject, color);
Disable
scene.input.removeDebug(gameObject);
Get debug shape game object
var shape = gameObject.input.hitAreaDebug;
Poll rate¶
Poll when touches moved, or updated. Default behavior.
scene.input.setPollOnMove();
Poll every tick.
scene.input.setPollAlways();
Set poll rate.
scene.input.setPollRate(rate);
Priority of touch detection¶
Container: A container and its children can both handle touch input, with the children taking priority over the container itself.
Layer: A layer cannot handle touch input itself, but its children can.