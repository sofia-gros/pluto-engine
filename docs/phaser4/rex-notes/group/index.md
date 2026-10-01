Group
Introduction¶
Objects pool, built-in game object of phaser.
Author: Phaser Team
Usage¶
Add group object¶
var group = scene.add.group(config);
// var group = scene.add.group(gameObjects, config);  // Add game objects into group
config
{
classType: Phaser.GameObjects.Sprite,
defaultKey: null,
defaultFrame: null,
active: true,
maxSize: -1,
runChildUpdate: false,
createCallback: null,
removeCallback: null,
createMultipleCallback: null
}
classType :
Sprite : Phaser.GameObjects.Sprite
Image : Phaser.GameObjects.Image
runChildUpdate : Set true to run gameObject.update() every tick.
createCallback : A function to be called when adding or creating group members.
var callback = function(gameObject) {
}
removeCallback : A function to be called when removing group members.
var callback = function(gameObject) {
}
createMultipleCallback : A function to be called when creating several group members at once.
var callback = function(gameObjects) {
}
Add game object¶
group.add(gameObject);
// group.add(gameObject, true);  // add this game object to display and update list of scene
group.addMultiple(gameObjects);   // array of game objects
// group.addMultiple(gameObjects, true);
Game object will only be added once.
Game object will be removed automatically when destroyed.
Remove game object¶
group.remove(gameObject);
// group.remove(gameObject, true);  // also remove this game object from display and update list of scene
Remove all game objects
group.clear();
// group.clear(removeFromScene, destroyChild);
Get game objects¶
Get all game objects.
var gameObjects = group.getChildren();  // array of game objects
Get all matching game objects
var gameObjects = group.getMatching(property, value);
// var gameObjects = group.getMatching(property, value, startIndex, endIndex);
Amount of game objects.
var len = group.getLength();
Group is full. Maximun size is set in maxSize.
var isFull = group.isFull();
Game object is in group.
var isInGroup = group.contains(child);
Group actions¶
Property¶
Set property
group.propertyValueSet(key, value);
// group.propertyValueSet(key, value, step, index, direction);
direction :
1 : From beginning to end
-1 : From end to beginning
Increase property
group.propertyValueInc(key, value);
// group.propertyValueInc(key, value, step, index, direction);
direction :
1 : From beginning to end
-1 : From end to beginning
Position¶
Set Position
group.setX(value);
// group.setX(value, step);
group.setX(value);
// group.setY(value, step);
group.setXY(x, y);
// group.setXY(x, y, stepX, stepY);
Increase Position
group.incX(value);
// group.incX(value, step);
group.incY(value);
// group.incY(value, step);
group.incXY(x, y);
// group.incXY(x, y, stepX, stepY);
Shift position
group.shiftPosition(x, y);
// group.shiftPosition(x, y, direction);
direction :
0 : First to last
1 : Last to first
Angle¶
Set angle
group.angle(value);
// group.angle(value, step);
group.rotate(value);
// group.rotate(value, step);
Rotate around
group.rotateAround(point, angle);
group.rotateAroundDistance(point, angle, distance);
Visible¶
Set visible
group.setVisible(value);
// group.setVisible(value, index, direction);
index : An optional offset to start searching from within the items array.
direction : The direction to iterate through the array.
1 : From beginning to end
-1 : From end to beginning
Toggle visible
group.toggleVisible();
Alpha¶
Set alpha
group.setAlpha(value);
// group.setAlpha(value, step);
Tint¶
Set tint
group.setTint(value);
// group.setTint(topLeft, topRight, bottomLeft, bottomRight);
Blend mode¶
Set blend mode
group.setBlendMode(value);
Scale¶
Set scale
group.scaleX(value);
// group.scaleX(value, step);
group.scaleY(value);
// group.scaleY(value, step);
group.scaleXY(scaleX, scaleY);
// group.scaleXY(scaleX, scaleY, stepX, stepY);
Origin¶
Set origin
group.setOrigin(originX, originY);
// group.setOrigin(originX, originY, stepX, stepY);
Depth¶
Set depth
group.setDepth(value, step);
Animation¶
Play animation
group.playAnimation(key, startFrame);
Hit area¶
Set hit-area
group.setHitArea();
// group.setHitArea(hitArea, hitAreaCallback);
Shuffle¶
Shuffle array
group.shuffle();
Active/inactive game objects¶
Set inactive
group.kill(gameObject);         // gameObject.setActive(false)
group.killAndHide(gameObject);  // gameObject.setActive(false).setVisible(false)
Amount of active game objects
var activeCount = group.countActive();
or
var activeCount = group.getTotalUsed();
Amount of active game objects
var inactiveCount = group.countActive(false);
Amount of free (maxSize - activeCount) game objects
var freeCount = group.getTotalFree();  // group.maxSize - group.getTotalUsed()
Get first active/inactive game object,
Return null if no game object picked.
var gameObject = group.getFirst(active);  // active = true/false
var gameObject = group.getFirstAlive(); // Equal to group.getFirst(true, ...)
var gameObject = group.getFirstDead(); // Equal to group.getFirst(false, ...)
Create one if no game object picked.
var gameObject = group.getFirst(active, true, x, y, key, frame, visible);  // active = true/false
var gameObject = group.getFirstAlive(true, x, y, key, frame, visible); // Equal to group.getFirst(true, ...)
var gameObject = group.getFirstDead(true, x, y, key, frame, visible); // Equal to group.getFirst(false, ...)
var gameObject = group.get(x, y, key, frame, visible); // Equal to group.getFirst(false, true, ...)
Use (x, y, key, frame) to create Image/Sprite game object.
var newGameObject = new GameObjectClass(x, y, key, frame);
Create game objects¶
var gameObjects = group.createFromConfig(config);
var gameObjects = group.createMultiple(config);    // config in array
config
{
classType: this.classType,
key: undefined,             // Required
frame: null,
visible: true,
active: true,
repeat: 0,                  // Create (1 + repeat) game objects
createCallback: undefined,  // Override this.createCallback if not undefined
// Position
setXY: {
x:0,
y:0,
stepX:0,
stepY:0
},
// Actions.SetXY(gameObjects, x, y, stepX, stepY)
gridAlign: false,
// {
//     width: -1,
//     height: -1,
//     cellWidth: 1,
//     cellHeight: 1,
//     position: Phaser.Display.Align.TOP_LEFT,
//     x: 0,
//     y: 0
// }
// Actions.GridAlign(gameObjects, gridAlign)
// Angle
setRotation: {
value: 0,
step:
},
// Actions.SetRotation(gameObjects, value, step)
// Scale
setScale: {
x:0,
y:0,
stepX:0,
stepY:0
},
// Actions.SetScale(gameObjects, x, y, stepX, stepY)
// Alpha
setAlpha: {
value: 0,
step:
},
// Actions.SetAlpha(gameObjects, value, step)
setOrigin: {
x:0,
y:0,
stepX:0,
stepY:0
},
// Input
hitArea: null,
hitAreaCallback: null,
// Actions.SetHitArea(gameObjects, hitArea, hitAreaCallback)
}
classType :
Sprite: Phaser.GameObjects.Sprite
Image: Phaser.GameObjects.Image
Destroy¶
Destroy group only
group.destroy();
Destroy group and children
group.destroy(true);