Vector2
Introduction¶
A representation of a vector in 2D space ({x, y}), built-in object of phaser.
Author: Phaser Team
Usage¶
Create object¶
var vector = new Phaser.Math.Vector2();
// var vector = new Phaser.Math.Vector2(x, y);
// var vector = new Phaser.Math.Vector2({x, y});
Clone¶
var newVector = vector.clone();
Set components¶
Set (x, y)
vector.set(x, y);
// vector.setTo(x, y);
or
vector.copy({x, y});
// vector.setFromObject({x, y});
Set angle
vector.setAngle(angle);
angle : Angle in radians.
Rotate
vector.rotate(delta);
delta : The angle to rotate by, in radians.
Project
vector.project(srcVector2);
Set length
vector.setLength(length);
Set from polar coordinate
vector.setToPolar(azimuth, radius);
azimuth : The angular coordinate, in radians.
radius : The radial coordinate (length). Default is 1.
Reset to (0, 0)
vector.reset();
Get componments¶
X, Y
var x = vector.x;
var y = vector.y;
Angle
var angle = vector.angle(); // angle in radians
Length
var length = vector.length();
or
var lengthSq = vector.lengthSq(); // squared
Methods¶
Scale
vector.scale(value);
Limit the length
vector.limit(value);
Normalize
vector.normalize();
Negate
vector.negate();
Rotate perpendicular
vector.normalizeRightHand();
vector.normalizeLeftHand();
Reflect
Reflect this Vector off a line defined by a normal.
vector.reflect(normal);
normal : A vector perpendicular to the line.
Reflect this Vector across another.
vector.mirror(axis);
axis : A vector to reflect across.
Vector methods¶
Add
vector.add(src); // src: {x, y}
Subtract
vector.subtract(src); // src: {x, y}
Multiply
vector.multiply(src); // src: {x, y}
Divide
vector.divide(src); // src: {x, y}
Dot
var value = vector.dot(src); // src: {x, y}
Cross
var value = vector.cross(src); // src: {x, y}
Fuzzy Equal
var equal = vector.fuzzyEquals(src); // src: {x, y}
// var equal = vector.fuzzyEquals(src, epsilon);
Points method¶
Distance between 2 points.
var distance = vector.distance(src);
or
var distanceSq = vector.distanceSq(src); // squared
Linearly interpolate between 2 points.
vector.lerp(src, t); // src: {x, y}
t : The interpolation percentage, between 0 and 1.
Constant¶
Zero (0,0)
var vector = Phaser.Math.Vector2.ZERO;
One (1,1)
var vector = Phaser.Math.Vector2.ONE;
Right (1,0)
var vector = Phaser.Math.Vector2.RIGHT;
Left (-1,0)
var vector = Phaser.Math.Vector2.LEFT;
Up (0,-1)
var vector = Phaser.Math.Vector2.UP;
Down (0,1)
var vector = Phaser.Math.Vector2.DOWN;