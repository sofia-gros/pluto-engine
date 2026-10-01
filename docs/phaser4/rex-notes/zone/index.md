Zone
Introduction¶
Non-rendering rectangular game object for creating drop zones and input hit areas, built-in game object of phaser.
Author: Phaser Team
Usage¶
Add zone object¶
var zone = scene.add.zone(x, y, width, height);
Add zone from JSON
var zone = scene.make.zone({
x: 0,
y: 0,
//width: 1,
//height: 1,
// origin: {x: 0.5, y: 0.5},
});
Custom class¶
Define class
class MyZone extends Phaser.GameObjects.Zone {
constructor(scene, x, y, width, height) {
super(scene, x, y, width, height);
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
var zone = new MyZone(x, y, width, height);
Input hit zone¶
zone.setInteractive();
See touch events
Drop zones¶
Default drop zone
zone.setDropZone();
Rectangle drop zone
zone.setRectangleDropZone(width, height);
Circular drop zone
zone.setCircleDropZone(radius);
Custom drop zone
zone.setDropZone(shape, callback);
callback
function(shape, x, y, gameObject) {
return hit;  // true/false
}
See drop zone
Other properties¶
See game object