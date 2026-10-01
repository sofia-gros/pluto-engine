Unique item list
Introduction¶
List of unique items. Support array and set methods.
Author: Rex
Data structure
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexuniqueitemlistplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuniqueitemlistplugin.min.js', true);
Add list object
var listA = scene.plugins.get('rexuniqueitemlistplugin').add(config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import UniqueItemListPlugin from 'phaser4-rex-plugins/plugins/uniqueitemlist-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexUniqueItemList',
plugin: UniqueItemListPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add list object
var listA = scene.plugins.get('rexUniqueItemList').add(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import UniqueItemList from 'phaser4-rex-plugins/plugins/uniqueitemlist.js';
Add list object
var listA = new UniqueItemList();
Create instance¶
var listA = scene.plugins.get('rexUniqueItemList').add({
// items: undefined,
// autoCleanup: true
});
items : Initial items.
autoCleanup : Set true to remove item when item is destroyed (from item's 'destroy' event)
or
var listA = scene.plugins.get('rexUniqueItemList').add(items);
Items¶
Get first item
var item = listA.getFirst();
Get last item
var item = listA.getLast();
Get item at index
var item = listA.get(index);
Get a random item
var item = listA.getRandom();
Get items
var items = listA.getItems();
Clone items to a new array
var items = listA.cloneItems();
Item count¶
Get item count
var count = listA.length;
List is empty
var isEmpty = listA.isEmpty();
Contains¶
Has item
var hasItem = listA.contains(item);
Has any item
var hasAny = listA.any(listB);
Has all items
var hasAll = listA.all(listB);
Array operations¶
Add¶
Add to last
listA.add(item);
or
listA.addLast(item);
Add to first
listA.addFirst(item);
Insert to index
listA.add(item, index);
Insert, or move to index
listA.add(item, iindex, true);
Add items
listA.addMultiple(items);
Clone list
var newList = listA.clone();
// listA.clone(listB)
Remove¶
Remove item
listA.remove(item);
Remove first
listA.removeFirst();
Remove last
listA.removeLast();
Remove item at index
listA.remove(undefined, index);
Remove items
listA.removeMultiple(items);
Remove all items
listA.clear();
Destroy all items
listA.clear(true);
Pop¶
Pop first item
var item = listA.pop();
or
var item = listA.popFirst();
Pop last item
var item = listA.popLast();
Pop item at index
var item = listA.pop(index);
Pop a random item
var item = listA.popRandom();
Slice¶
Extract items from startIndex to endIndex (item of endIndex is included)
var newList = listA.slice(startIndex, endIndex);
// listA.slice(startIndex, endIndex, listB);
Sort¶
Sort
list.sort(function(itemA, itemB) {
if (itemA > itemB) {
return 1;
} else if (itemA < itemB) {
return -1;
} else {
return 0;
}
})
Reverse
listA.reverse();
Shuffle
listA.shuffle();
Set operations¶
C = A | B
var listC = listA.union(listB);
// listA.union(listB, listC);
listC : Result unique-item-list. Can be listA, or listB.
C = A & B
var listC = listA.intersect(listB);
// listA.intersect(listB, listC);
listC : Result unique-item-list. Can be listA, or listB.
C = A - B
var listC = listA.difference(listB);
// listA.difference(listB, listC);
listC : Result unique-item-list. Can be listA, or listB.
Call method¶
Apply method of each item.
listA.call(fnName, arg0, arg1, arg2, ...);
fnName : Method name of item.
arg0, arg1, arg2 : Arguments of fnName method.
Warning
Don't add or remove any item during this method.
listA.call(function(item, i) {
// ....
}, scope);
callback : A function object.
function(item, i) {
}