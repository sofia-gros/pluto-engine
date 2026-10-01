Rope
Introduction¶
Manipulate the vertices of images, built-in game object of phaser.
Author: Phaser Team
WebGL only
It only works in WebGL render mode.
Usage¶
Load texture¶
scene.load.image(key, url);
Reference: load image
Add object¶
var rope = scene.add.rope(x, y, texture, frame, points, horizontal);
// var rope = scene.add.rope(x, y, texture, frame, points, horizontal, colors, alphas);
points :
A number : Segments to split the texture frame into.
An number array : An array containing the vertices data.
horizontal :
true : Vertices of this Rope be aligned horizontally.
false : Vertices of this Rope be aligned vertically.
colors : An optional array containing the color data for this Rope. One color value per pair of vertices.
alphas : An optional array containing the alpha data for this Rope. One alpha value per pair of vertices.
Add rope from JSON
var rope = scene.make.rope({
x: 0,
y: 0,
key: '',
frame: null,
horizontal: true,
points: undefined,
colors: undefined,
alphas: undefined,
// angle: 0,
// alpha: 1
// flipX: true,
// flipY: true,
// origin: {x: 0.5, y: 0.5},
add: true
});
Custom rope class¶
Define class
class MyRope extends Phaser.GameObjects.Rope {
constructor(scene, x, y, texture, frame, points, horizontal, colors, alphas) {
super(scene, x, y, texture, frame, points, horizontal, colors, alphas);
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
var rope = new MyRope(scene, x, y, texture, frame, points, horizontal);
Origin¶
A Ropes origin is always 0.5 x 0.5 and cannot be changed.
Set vertices¶
Set vertices via
rope.setPoints(points);
// rope.setPoints(points, colors, alphas);
points :
A number : Segments to split the texture frame into.
An number array : An array containing the vertices data.
colors : An optional array containing the color data for this Rope. One color value per pair of vertices.
alphas : An optional array containing the alpha data for this Rope. One alpha value per pair of vertices.
Also change horizontal mode :
Change vertical rope to horizontal rope, do nothing if rope is horizontal mode already
rope.setHorizontal(points);
// rope.setHorizontal(points, colors, alphas);
Change horizontal rope to vertical rope, do nothing if rope is vertical mode already
rope.setVertical(points);
// rope.setVertical(points, colors, alphas);
Or set rope.points directly :
Change rope.points
Horizontal rope : rope.points[i].y = newY
Vertical rope :  rope.points[i].x = newX
Call rope.setDirty(), or rope.updateVertices()
Each point is relative to position of rope object, get points of world via
var worldX = rope.points[i].x + rope.x;
var worldY = rope.points[i].y + rope.y;
Play animation¶
rope.play(key);
// rope.play(key, ignoreIfPlaying, startFrame);
ignoreIfPlaying : If an animation is already playing then ignore this call. Default value is false.
startFrame : Optionally start the animation playing from this frame index. Default value is 0.
Alpha¶
Single alpha
rope.setAlphas(alpha);
Top - bottom alpha
rope.setAlphas(topAlpha, bottomAlpha);
Alpha array for each point
rope.setAlphas(alphaArray);
alphaArray : Array of alpha value.
Color tint¶
Single color tint
rope.setColors(color);
Color tint array for each point
rope.setAlphas(colorArray);
colorArray : Array of color tint value.
Flip¶
rope.flipX = flip;
rope.flipY = flip;
If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
Debug¶
Draw debug mesh each render tick.
rope.setDebug(graphic);
// rope.setDebug(graphic, callback);
graphic : Graphics game object
callback : Callback of rendering debug graphics (default callback)
function(rope, meshLength, verts) {
// var graphic = rope.debugGraphic;
}
rope : Rope instance.
rope.debugGraphic : Graphics game object
meshLength : The number of mesh vertices in total.
verts : An array of the translated vertex coordinates.
Note
Clear Debug graphics (rope.debugGraphic.clear()) during scene's update stage (scene.update() { })