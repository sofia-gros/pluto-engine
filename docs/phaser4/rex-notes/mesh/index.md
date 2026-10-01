Mesh
Introduction¶
Render a group of textured vertices.
Author:Rex
Game object
WebGL only
It only works in WebGL render mode.
Incompatible
Does not support 3D model display.
Usage¶
Load texture¶
scene.load.image(key, url);
Reference: load image
Add image object¶
var image = scene.add.rexMesh(x, y, key);
// var image = scene.add.rexMesh(x, y, key, frame);
Add image from JSON
var image = scene.make.rexMesh({
x: 0,
y: 0,
key: '',
// frame: '',
// angle: 0,
// alpha: 1,
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
class MyMesh extends Mesh {
constructor(scene, x, y, texture, frame) {
super(scene, x, y, texture, frame);
// ...
scene.add.existing(this);
}
// ...
// preUpdate(time, delta) {
//     super.preUpdate(time, delta);
// }
}
scene.add.existing(gameObject) : Adds an existing Game Object to this Scene.
If the Game Object renders, it will be added to the Display List.
If it has a preUpdate method, it will be added to the Update List.
Create instance
var image = new MyMesh(scene, x, y, key);
Texture¶
See game object - texture
Faces¶
Add grid faces¶
mesh.addGridFaces(columns, rows);
Add faces with vertices¶
Create vertiex
var v0 = mesh.createVertex(u0, v0);
var v1 = mesh.createVertex(u1, v1);
var v2 = mesh.createVertex(u2, v2);
u0, v0, u1. v1, ... : 0 ~ 1
Create face
var face = mesh.createFace(v0, v1, v2);
A face can use vertices shared by other faces.
Add face(s)
mesh.addFace(face);
or
mesh.addFaces(faces);
Clear faces¶
mesh.clear();
Get all faces¶
var faces = mesh.faces;
Point inside face¶
Get face contains point
var face = mesh.getFaceAt(worldX, worldY);
// var face = mesh.getFaceAt(worldX, worldY, camera);
Has any face which contains point
var isHit = mesh.hasFaceAt(worldX, worldY);
// var isHit = mesh.hasFaceAt(worldX, worldY, camera);
Face properties¶
Alpha
Get
var alpha = face.alpha;
Set
face.alpha = alpha;
Angle
Rotate
Phaser.Geom.Mesh.RotateFace(face, radians);
Offset position
Get
var localX = face.localOffsetX;
var localY = face.localOffsetY;
Set
face.localOffsetX = localX;
face.localOffsetY = localY;
Vertices
var vertex0 = face.vertex0;
var vertex1 = face.vertex1;
var vertex2 = face.vertex2;
or
var vertices = face.vertices;
var vertex0 = vertices[0];
var vertex1 = vertices[1];
var vertex2 = vertices[2];
Vertices¶
Each face has 3 vertices, and a face can use vertices shared by other faces.
var vertices = mesh.vertices;
vertices : Array of vertex.
var vertices = face.vertices;
Properties¶
World position
Get
var worldX = vertex.worldX;
var worldY = vertex.worldY;
// var worldX = vertex.x;
// var worldY = vertex.y;
or
var wordXY = vertex.getWorldXY();       // {x,y}
// var worldXY= vertex.getWorldXY(out);
Set
vertex.setWorldXY(worldX, worldY);
vertex.setPosition(worldX, worldY);
Local position
Get
var localX = vertex.localX;
var localY = vertex.localY;
Set
vertext.setLocalPosition(localX, localY);
or
vertext.localX = localX;
vertext.localY = localY;
Rotate local position around another point
vertex.rotateAround(ox, oy, rotation);
ox, oy : Origin point.
rotation : Rotation angle by radius.
Reset to default position
vertex.resetPosition();
Alpha
Get
var alpha = vertex.alpha;
Set
vertex.alpha = alpha;
Tint
Get
var color = vertex.color;
Set
vertex.color = color;
Interactive with texture rectangle¶
Texture rectangle the same as normal Image Game object.
mesh.setInteractive();
Interactive with faces¶
Set face-interactive
mesh.setFaceInteractive();
On pointer down at face
mesh.on('face.pointerdown', function (face, pointer, localX, localY, event) {
})
On pointer up at face
mesh.on('face.pointerup', function (face, pointer, localX, localY, event) {
})
On pointer move at face
mesh.on('face.pointermove', function (face, pointer, localX, localY, event) {
})
On pointer over face
mesh.on('face.pointerover', function (face, pointer, event) {
})
On pointer out face
mesh.on('face.pointerout', function (face, pointer, event) {
})
Debug¶
Set debug Graphics
var debugGraphics = scene.add.graphics();
mesh.setDebug(debugGraphics);
Update Graphics in scene.update() method.
debugGraphics.clear();
debugGraphics.lineStyle(1, 0x00ff00);
Other properties¶
See game object
Shader effects¶
Support internal and external filters