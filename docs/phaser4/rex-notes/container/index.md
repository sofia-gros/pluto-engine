Container
Introduction¶
Control the position and angle of children game objects, built-in game object of phaser.
Author: Phaser Team
Usage¶
Container¶
Add container object¶
var container = scene.add.container(x, y);
// var container = scene.add.container(x, y, children); // children: an array of game object
Custom class¶
Define class
class MyContainer extends Phaser.GameObjects.Container {
constructor(scene, x, y, children) {
super(scene, x, y, children);
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
var container = new MyContainer(scene, x, y, children);
Destroy¶
container.destroy();
Also destroy all children game objects.
Set properties¶
Reference game object, to set position, angle, visible, alpha, etc...
Set size¶
container.setSize(width, height);
Default size is 0x0.
Set scroll factor¶
container.setScrollFactor(x, y);
Apply this scrollFactor to all Container children.
container.setScrollFactor(x, y, true);
Hit area¶
container.setInteractive(new Phaser.Geom.Circle(0, 0, radius), Phaser.Geom.Circle.Contains);
// container.setInteractive(false); // disable
Assign hit area with a circle shape.
Non-exclusive¶
container.setExclusive(false);
Allows a game object added to container many times.
Children¶
Add child¶
container.add(child);  // child: a game object or an array of game objects
container.addAt(child, index);
Exist¶
var hasChild = container.exists(child);
Get child¶
var firstChild = container.first;
var nextChild = container.next;
var prevChild = container.previous;
var lastChild = container.last;
var child = container.getByName(name);
var child = container.getRandom(startIndex, length);
var child = container.getFirst(property, value, startIndex, endIndex);
// value: the value to test the property against. Must pass a strict (`===`) comparison check.
var children = container.getAll(property, value, startIndex, endIndex);
// value: the value to test the property against. Must pass a strict (`===`) comparison check.
var amount = container.count(property, value, startIndex, endIndex);
// value: the value to test the property against. Must pass a strict (`===`) comparison check.
Sort children¶
container.sort(property);
container.sort(property, function(childA, childB){
return 0; // 0, 1, -1
});
Remove child¶
container.remove(child);
// container.remove(child, true);  // remove child object and destroy it
container.removeAt(index);
// container.removeAt(index, true);  // remove child object and destroy it
container.removeBetween(startIndex, endIndex);
// container.removeBetween(startIndex, endIndex, true);  // remove children objects and destroy them
container.removeAll();
// container.removeAll(true);  // remove all children objects and destroy them
Removing child from container without destroying will put back into scene's display list.
Order of child¶
container.moveTo(child, index);
container.bringToTop(child);
container.sendToBack(child);
container.moveUp(child);
container.moveDown(child);
container.moveAbove(child1, child2);  // Move child1 above child2
container.moveBelow(child1, child2);  // Move child1 below child2
container.swap(child1, child2);
container.reverse();
container.shuffle();
Replace child¶
container.replace(oldChild, newChild);
// container.replace(oldChild, newChild, true);  // destroy oldChild
Set properties¶
container.setAll(property, value, startIndex, endIndex);
For each child¶
Iterate current children list
container.iterate(callback);
// container.iterate(callback, context);
// container.iterate(callback, context, arg0, arg1, ...);
callback :
function(child, arg0, arg1, ...) {
}
Iterate a copy of current children list
container.each(callback);
// container.each(callback, context);
// container.each(callback, context, arg0, arg1, ...);
callback :
function(child, arg0, arg1, ...) {
}
Get world position, rotation, scale¶
var matrix = child.getWorldTransformMatrix();
var x = matrix.tx;
var y = matrix.ty;
var rotation = matrix.rotation;
var scaleX = matrix.scaleX;
var scaleY = matrix.scaleY;
Alpha¶
Set alpha to all children
container.alpha = value;
// container.setAlpha(value);
Set alpha to rendering result of container
Eanble dedicated framebuffer
container.enableFilters().filtersForceComposite = true;
Set alpha to internal camera
var camera = container.filters.internal.camera;
camera.alpha = value;
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters
Compare with group object¶
Container and group objects are all have a children list.
Container has position, angle, alpha, visible, ...etc, but group does not have.
Container controls properties of children (position, angle, alpha, visible, ...etc), but group won't.
A game object could be added to many groups, but it only could be added to one container (exclusive mode).