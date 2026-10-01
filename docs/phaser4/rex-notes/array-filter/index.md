Filter/Map
Introduction¶
Built-in javascript object.
Author: Built-in javascript function
Usage¶
Run function for each element¶
arr.forEach(function(element, index, arr) {
//
}, scope);
Filter elements¶
Creates a new array with all elements that pass the test function.
var result = arr.filter(function(element, index, arr) {
return true; // false
}, scope);
Find one element¶
var element = arr.find(function(element, index, arr) {
return true; // false
}, scope);
Map elements to a new array¶
var newArray = arr.map(function(element, index, arr) {
return newElement;
}, scope);