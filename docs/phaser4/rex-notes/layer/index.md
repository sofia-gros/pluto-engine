Layer
Introduction¶
A local display list, built-in game object of phaser.
Layers have no position or size
Layers have no position or size within the Scene
Cannot enable a Layer for physics or input.
Cannot change the position, rotation or scale of a Layer.
No scroll factor, texture, tint, origin, crop or bounds.
Layers cannot be added to Containers
Containers can be added to Layers, but Layers cannot be added to Containers.
Author: Phaser Team
Usage¶
Add layer¶
var layer = scene.add.layer();
// var layer = scene.add.layer(children);
children : Array of game objects added to this layer.
Custom class¶
Define class
class MyLayer extends Phaser.GameObjects.Layer {
constructor(scene, children) {
super(scene, children);
// ...
scene.add.existing(this);
}
// ...
// preUpdate(time, delta) {}
}
scene.add.existing(gameObject) : Adds an existing Game Object to this Scene.
If the Game Object renders, it will be added to the Display List.
If it has a preUpdate method, it will be added to the Update List.
Create instance
var layer = new MyLayer(scene, children);
Add child¶
Add child
layer.add(gameObject);
// layer.add(gameObjects);
gameObject : A game object, or an array of game objects.
Add child at
layer.addAt(gameObject, index);
Replace child
layer.replace(oldGameObject, newGameObject);
Remove child¶
Remove child
var removed = layer.remove(gameObject);
Remove child at
var removed = layer.removeAt(index);
Remove children between indexes
var removed = layer.removeBetween(startIndex, endIndex);
Remove all children
layer.removeAll();
Removed game object won't be added to display list of scene, use
gameObject.addToDisplayList();
to add it back to scene's display list.
Get child¶
Get child at
var gameObject = layer.getAt(index);
Get first child by name
var gameObject = layer.getByName(name);
Get first child by property
var gameObject = layer.getFirst(property, value);
// var gameObject = layer.getFirst(property, value, startIndex, endIndex);
Get random child
var gameObject = layer.getRandom();
// var gameObject = layer.getRandom(startIndex, length);
Get all children
var gameObjects = layer.getAll();
Get index of child
var index = layer.getIndex(gameObject);
Get child count
var count = layer.count(property, value);
Get total children count
var count = layer.length;
Has child
var hasChild = layer.exists(gameObject);
Iterate¶
Get first child (set iterator index to 0)
var gameObject = layer.first;
Get last child (set iterator index to last)
var gameObject = layer.last;
Get next child (increase iterator index, until last)
var gameObject = layer.next;
Get previous child (decrease iterator index, until 0)
var gameObject = layer.previous;
Move child¶
Swap
layer.swap(gameObject1, gameObject2);
Move to
layer.moveTo(gameObject, index);
Bring to top
layer.bringToTop(gameObject);
Send to back
layer.sendToBack(gameObject);
Move up
layer.moveUp(gameObject);
Move down
layer.moveDown(gameObject);
Move child1 above child2
layer.moveAbove(child1, child2);
Move child1 below child2
layer.moveBelow(child1, child2);
Sort
layer.sort(property);
or
layer.sort('', function(gameObject1, gameObject2) {
return 1; // 0, or -1
});
Reverse
layer.reverse();
Shuffle
layer.shuffle();
Note
Children game objects also sort by depth.
For each child¶
layer.each(function(gameObject) {
}, scope);
Set property¶
layer.setAll(property, value);
// layer.setAll(property, value, startIndex, endIndex);
Alpha¶
Set alpha to all children
layer.alpha = value;
// layer.setAlpha(value);
Set alpha to rendering result of layer
Eanble dedicated framebuffer
layer.enableFilters().filtersForceComposite = true;
Set alpha to internal camera
var camera = layer.filters.internal.camera;
camera.alpha = value;
Events¶
On add game object
layer.events.on('addedtoscene', function(gameObject, scene) {
})
On remove game object
layer.events.on('removedfromscene', function(gameObject, scene) {
})
layer.events references to scene.events.
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters