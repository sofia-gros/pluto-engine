Set
Introduction¶
A collection of unique elements, built-in data structure of phaser.
Author: Phaser Team
Usage¶
Create instance¶
var set = new Phaser.Structs.Set();
or
var set = new Phaser.Structs.Set(elements);
Add an element¶
set.set(element);
Remove an element¶
set.delete(element);
Remove all elements¶
set.clear();
Has element¶
set.contains(element);
Get elements¶
var elements = set.entries;
or get a shallow copy of elements
var elements = set.getArray();
Element counts¶
var size = set.size;
For each element¶
For when you know this Set will be modified during the iteration.
set.each(function(element, index) {
// return false;  // return false to cancel iteration
}, scope)
For when you absolutely know this Set won't be modified during the iteration.
set.iterate(function(element, index) {
// return false;  // return false to cancel iteration
}, scope)
Set operations¶
C = A | B
var setC = setA.union(setB);
C = A & B
var setC = setA.intersect(setB);
C = A - B
var setC = setA.difference(setB);