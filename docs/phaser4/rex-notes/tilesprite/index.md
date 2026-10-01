Tile sprite
Introduction¶
Display of repeating texture, built-in game object of phaser.
Author: Phaser Team
Usage¶
Load texture¶
scene.load.image(key, url);
Reference: load image
Add tile sprite object¶
var image = scene.add.tileSprite(x, y, width, height, textureKey);
Add tile sprite from JSON
var image = scene.make.tileSprite({
x: 0,
y: 0,
width: 512,
height: 512,
key: '',
// angle: 0,
// alpha: 1
// flipX: true,
// flipY: true,
// scale : {
//    x: 1,
//    y: 1
//},
// origin: {x: 0.5, y: 0.5},
add: true
});
Custom class¶
Define class
class MyTileSprite extends Phaser.GameObjects.TileSprite {
constructor(scene, x, y, width, height, texture, frame) {
super(scene, x, y, width, height, texture, frame);
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
var image = new MyTileSprite(scene, x, y, key);
Properties of tiles¶
Position
image.setTilePosition(x, y);
or
image.tilePositionX = x;
image.tilePositionY = y;
Scale
image.setTileScale(scaleX, scaleY);
or
image.tileScaleX = scaleX;
image.tileScaleY = scaleY;
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters