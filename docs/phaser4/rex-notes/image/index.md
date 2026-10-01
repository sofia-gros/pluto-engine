Image
Introduction¶
Display of static images, built-in game object of phaser.
Author: Phaser Team
Game object
Usage¶
Load texture¶
scene.load.image(key, url);
Reference: load image
Add image object¶
var image = scene.add.image(x, y, key);
// var image = scene.add.image(x, y, key, frame);
Add image from JSON
var image = scene.make.image({
x: 0,
y: 0,
key: '',
// frame: '',
// angle: 0,
// alpha: 1,
// flipX: true,
// flipY: true,
// scale : {
//    x: 1,
//    y: 1
//},
// origin: {x: 0.5, y: 0.5},
add: true
});
key, frame :
A string
An array of string to pick one element at random
x, y, scale.x, scale.y :
A number
A callback to get return value
function() { return 0; }
Random integer between min and max
{ randInt: [min, max] }
Random float between min and max
{ randFloat: [min, max] }
Custom class¶
Define class
class MyImage extends Phaser.GameObjects.Image {
constructor(scene, x, y, texture, frame) {
super(scene, x, y, texture, frame);
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
var image = new MyImage(scene, x, y, key);
Texture¶
See game object - texture
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters