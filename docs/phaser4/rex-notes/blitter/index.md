Blitter
Introduction¶
Display of static images, built-in game object of phaser.
Author: Phaser Team
Usage¶
Load texture¶
scene.load.image(key, url);
Reference: load image
Add blitter container¶
Add blitter container
var blitter = scene.add.blitter(x, y, key);
Add blitter container from JSON
var blitter = scene.make.blitter({
x: 0,
y: 0,
key: '',
// angle: 0,
// alpha: 1
// flipX: true,
// flipY: true,
// origin: {x: 0.5, y: 0.5},
add: true
});
Custom class¶
Define class
class MyBlitter extends Phaser.GameObjects.Blitter {
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
var blitter = new MyBlitter(scene, x, y, key);
Add bob object¶
var bob = blitter.create(x, y);
// var bob = blitter.create(x, y, frame, visible, index);
frame : The Frame the Bob will use. It must be part of the Texture the parent Blitter object is using.
visible : Should the created Bob render or not?
index : The position in the Blitters Display List to add the new Bob at. Defaults to the top of the list.
Add mutiple bob objects¶
var bobs = blitter.createMultiple(quantity, frame, visible);
quantity : The quantity of Bob objects to create.
Add bob object from callback¶
var bobs = blitter.createFromCallback(callback, quantity, frame, visible)
// var callback = function(bob, i){};
Get bob objects¶
var bobs = blitter.children.list;
Clear all bob objects¶
blitter.clear();
Bob object¶
A Bob has a position, alpha value and a frame from a texture that it uses to render with. You can also toggle the flipped and visible state of the Bob.
Position¶
Get
var x = bob.x;
var y = bob.y;
Set
bob.setPosition(x, y);
// bob.x = 0;
// bob.y = 0;
or
bob.reset(x, y);
// bob.reset(x, y, frame);
Frame¶
Get
var frame = bob.frame;
frame : Frame object.
Set
bob.setFrame(frame);
Flip¶
Get
var flipX = bob.flipX;
var flipY = bob.flipY;
Set
bob.setFlip(boolX, boolY);
// bob.setFlipX(boolean);
// bob.setFlipY(boolean);
// bob.flipX = flipX;
// bob.flipY = flipY;
or
bob.resetFlip(); // bob.setFlip(false, false)
Visible¶
Get
var visible = bob.visible;
Set
bob.setVisible(boolean);
// bob.visible = v;
Alpha¶
Get
var alpha = bob.alpha;
Set
bob.setAlpha(v);
// bob.aplha = v;
Tint¶
Get
var tint = bob.tint;
Set
bob.setTint(tint);
// bob.tint = tint;
tint : Tint value, between 0 and 0xffffff.
Destroy¶
bob.destroy();
Data¶
var data = bob.data;  // {}
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters