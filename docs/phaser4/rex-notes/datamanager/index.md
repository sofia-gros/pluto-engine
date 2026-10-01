Built-in data
Introduction¶
Store data in key-value pairs, built-in object of phaser.
Author: Phaser Team
Usage¶
Write¶
Set value¶
Set value
parent.data.set(key, value);
or
parent.data.values[key] = value;
key : Key string.
Increase number value. If the key doesn't already exist in the Data Manager then it is increased from 0.
parent.data.inc(key, data);
or
parent.data.values[key] += value;
data : The value to increase.
Toggle boolean value. If the key doesn't already exist in the Data Manager then it is toggled from false.
parent.data.toggle(key);
or
parent.data.values[key] = !parent.data.values[key];
Set values¶
parent.data.set(data);    // data: {key:value, ...}
Merge values¶
parent.data.merge(data);  // data: {key:value, ...}
parent.data.merge(data, false);  // won't overwrite existed keys
Events¶
Fires setdata event when a value is first set.
parent.data.events.on('setdata', function(parent, key, value){ /* ... */ });
Fires changedata, and changedata- + key events when a value is set that already exists.
parent.data.events.on('changedata', function(parent, key, value, previousValue){ /* ... */ });
parent.data.events.on('changedata-' + key, function(parent, value, previousValue){ /* ... */ });
Read¶
Get value¶
var value = parent.data.get(key);
or
var value = parent.data.values[key];
Get values¶
var values = parent.data.get(keys); // values: [value, value, ...], keys: [key, key, ...]
Get all values¶
var allValues = parent.data.getAll();  // return a copy of data
Query¶
Using string.match() to pick matched keys.
var result = parent.data.query(rgExp);
Remove¶
Remove key¶
parent.data.remove(key);
Remove keys¶
parent.data.remove(keys);  // keys: [key, key, ...]
Pop key¶
var value = parent.data.pop(key);
Get and remove that key.
Delet all keys¶
Delete all data in this Data Manager and unfreeze it.
parent.data.reset();
Events¶
Fires removedata event when a key is removed.
parent.data.events.on('removedata', function(parent, key, value){ /* ... */ });
Freeze¶
var isFrozen = parent.data.freeze;
parent.data.freeze = true;
No changes can be written to it.
Has key¶
var hasKey = parent.data.has(key);
For each key¶
parent.data.each(function(parent, key, value){
/* ... */
}, scope);
Count of data¶
var cnt = parent.data.count;
Reset¶
Reset status and clear all keys.
parent.data.reset()