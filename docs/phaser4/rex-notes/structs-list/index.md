List
Introduction¶
An ordered list, built-in data structure of phaser.
Author: Phaser Team
Usage¶
Create instance¶
var list = new Phaser.Structs.List();
Add child¶
list.add(child);
list.addAt(child, index);
Exist¶
var hasChild = list.exists(child);
Get child¶
var firstChild = list.first;
var nextChild = list.next;
var prevChild = list.previous;
var lastChild = list.last;
var child = list.getByName(name);
var child = list.getRandom(startIndex, length);
var child = list.getFirst(property, value, startIndex, endIndex);
// value: the value to test the property against. Must pass a strict (`===`) comparison check.
var child = list.getAll(property, value, startIndex, endIndex);
// value: the value to test the property against. Must pass a strict (`===`) comparison check.
var child = list.count(property, value);
// value: the value to test the property against. Must pass a strict (`===`) comparison check.
Get children¶
var children = list.list;
Sort children¶
Sort by property
list.sort(property);
// list.sort(property, handler);
property : The property to lexically sort by.
handler :
function (childA, childB) {
return 0; // 0, 1, -1
}
Remove child¶
list.remove(child);
list.removeAt(index);
list.removeBetween(startIndex, endIndex);
list.removeAll();
Order of child¶
list.moveTo(child, index);
list.bringToTop(child);
list.sendToBack(child);
list.moveUp(child);
list.moveDown(child);
list.moveAbove(child1, child2);  // Move child1 above child2
list.moveBelow(child1, child2);  // Move child1 below child2
list.swap(child1, child2);
list.reverse();
list.shuffle();
Replace child¶
list.replace(oldChild, newChild);
Set properties¶
list.setAll(property, value, startIndex, endIndex);
For each child¶
Iterate current children list
list.each(callback);
// list.each(callback, context);
// list.iterate(callback, context, arg0, arg1, ...);
callback :
function(child, arg0, arg1, ...) {
}
Children counts¶
var size = list.length;