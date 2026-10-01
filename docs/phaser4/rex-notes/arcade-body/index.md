Body
Introduction¶
Arcade physics body.
Author: Phaser Team
Usage¶
Get physics body¶
Enable physics world
Add existing game object(s) to physics world
Add a game object
var gameObject = scene.physics.add.existing(gameObject, bodyType);
bodyType :
0 : Dynamic body
1 : Static body
Add game objects
scene.physics.world.enable(gameObjects, bodyType);
gameObjects : An array of game objects, or a group object
bodyType :
0 : Dynamic body
1 : Static body
Get physics body
var body = gameObject.body;
Enable¶
Whether this Body is updated by the physics simulation.
Enable (default)
body.setEnable();
or
body.enable = true;
Disable
body.setEnable(false);
or
body.enable = false;
Direct control¶
Enable directControl when game object is controlled by tween or dragging.
Default behavior is disable.
Enable
body.setDirectControl();
// body.setDirectControl(true);
or
body.directControl = true;
Disable
body.setDirectControl(false);
or
body.directControl = false;
Immovable¶
Whether this Body can be moved by collisions with another Body.
Enable
body.setImmovable();
// body.immovable = true;
Disable (defalut)
body.setImmovable(false);
// body.immovable = false;
Get
var immovable = body.immovable;
Pushable¶
Sets if this Body can be pushed by another Body.
Enable (default value of dynamic body)
body.pushable = true;
Disable, reflect back all of the velocity it is given to the colliding body.
body.pushable = false;
Get
var pushable = body.pushable;
Moveable¶
Whether the Body's position and rotation are affected by its velocity, acceleration, drag, and gravity.
Enable (default)
body.moves = true;
Disable
body.moves = false;
Get
var moves = body.moves;
Destroy¶
Physics body will be destroyed automatically when game object is destroyed.
Movement¶
Velocity¶
Set
body.setVelocity(x,y);
or
body.setVelocityX(x);
body.setVelocityY(x);
Get
var vx = body.velocity.x;
var vy = body.velocity.y;
Max speed¶
Set
body.setMaxSpeed(speed);
Get
var speed = body.maxSpeed;
Max velocity¶
Set
body.setMaxVelocity(x, y);
or
body.setMaxVelocityX(x);
body.setMaxVelocityY(y);
Get
var vx = body.maxVelocity.x;
var vy = body.maxVelocity.y;
Acceleration¶
Set
body.setAcceleration(x, y);
or
body.setAccelerationX(x);
body.setAccelerationY(y);
Get
var ax = body.acceleration.x;
var ay = body.acceleration.y;
Gravity¶
Set
body.setGravity(x, y);
or
body.setGravityX(x);
body.setGravityY(y);
Get
var gx = body.gravity.x;
var gy = body.gravity.y;
Enables (default)
body.setAllowGravity();
Disable
body.setAllowGravity(false);
Drag¶
Reduces speed per second.
Set
body.setDrag(x, y);
or
body.setDragX(x);
body.setDragY(y);
Get
var dx = body.drag.x;
var dy = body.drag.y;
Enables (default)
body.setAllowDrag();
Disable
body.setAllowDrag(false);
Enable Damping (default: disable)
body.setDamping(true);
// body.useDamping = true;
Slide factor¶
The Slide Factor controls how much velocity is preserved when this Body is pushed by another Body.
body.slideFactor.set(x, y);
x, y :
1 : Take on all velocity given in the push. Default value.
0 : Allow this Body to be pushed but then remain completely still after the push ends,
such as you see in a game like Sokoban.
Other value between 0 ~ 1 : Keep x/y of the original velocity when the push ends.
Combine this with the setDrag() method to create deceleration.
Reset position¶
body.reset(x, y);
Stop¶
Sets acceleration, velocity, and speed to zero.
body.stop();
Friction¶
If this Body is immovable and in motion, this the proportion of this Body's movement received by the riding body on each axis.
Set
body.setFriction(x, y);
or
body.setFrictionX(x);
body.setFrictionY(y);
Get
var fx = body.friction.x;
var fy = body.friction.y;
Speed¶
The absolute (non-negative) change in this Body's horizontal/vertical position from the previous step.
var dx = body.deltaAbsX();
var dy = body.deltaAbsY();
Rotation¶
Allow rotation¶
Whether this Body's rotation is affected by its angular acceleration and velocity.
Enable (default)
body.setAllowRotation();
Disable
body.setAllowRotation(false);
Get
var allowRotation = body.allowRotation;
Angular velocity¶
Set
body.setAngularVelocity(v);
Get
var av = body.angularVelocity;
Angular acceleration¶
Set
body.setAngularAcceleration(v);
Get
var aa = body.angularAcceleration;
Angular drag¶
Reduces angular speed per second.
Set
body.setAngularDrag(v);
Get
var ad = body.angularDrag;
Collision¶
Collision category¶
A body is only below to one collision category.
A body can collide with multiple collision categories.
The default is that all bodies collide with all others.
Collision category
Get
var collisionCategory = body.collisionCategory;
Set
body.setCollisionCategory(category);
category :
(1 << 0)
(1 << 1)
(1 << 2)
...
(1 << 31)
Reset collision category, to default behavior (all bodies collide with all others)
body.resetCollisionCategory();
Set collisionCategory to 1.
Set collisionMask to 1
Collision mask
Get
var collisionMask = body.collisionMask;
Set
body.setCollidesWith(categories);
categories : A single category value, or an array of them.
Add
body.addCollidesWith(category):
category : A single category value.
Remove
body.removeCollidesWith(category);
category : A single category value.
Collision bound¶
Rectangle
body.setSize(width, height, center);
center : false to set body's offset to (0, 0).
Not work in Graphics object.
Circle
body.setCircle(radius, offsetX, offsetY);
Offset¶
body.setOffset(x, y);
Push out¶
scene.physics.add.collider(objectsA, objectsB);
objectsA, objectsB :
A game object
Game objects in array (Add or remove game objects)
Physics group (Add or remove game objects)
Group (Add or remove game objects)
Callbacks¶
Add collider
Point inside¶
var hit = body.hitTest(x, y);
Is colliding¶
Is colliding this tick
var isColliding = body.touching;
isColliding :
{
none: true,
up: true,
down: true,
left: true,
right: true
}
Was colliding previous tick
var wasColliding = body.wasTouching;
wasColliding :
{
none: true,
up: true,
down: true,
left: true,
right: true
}
Bounce¶
Set
body.setBounce(x, y);
or
body.setBounceX(x);
body.setBounceY(y);
Get
var bx = body.bounce.x;
var by = body.bounce.y;
World bounds¶
Default world bounds
Custom world bounds :
body.setBoundsRectangle(bounds);
bounds : A rectangle object.
Enable
body.setCollideWorldBounds();
Disable (default)
body.setCollideWorldBounds(false);
Get world bounds rectangle
var top = body.world.bounds.top;
var bottom = body.world.bounds.bottom;
var left = body.world.bounds.left;
var right = body.world.bounds.right;
Blocked¶
Whether this Body is colliding with a tile or the world boundary.
Blocked when moveing down
var onFloor = body.onFloor(); // blocked.down
Blocked when moveing up
var onCeiling = body.onCeiling();  // blocked.up
Blocked when moveing left or right
var onWall = body.onWall();  // blocked.left || this.blocked.right
State
var blocked = body.blocked;
blocked :
{
none: true,
up: false,
down: false,
left: false,
right: false
}
Mass¶
Set
body.setMass(m);
Get
var m = body.mass;
Static body¶
Sync¶
Syncs the Bodies position and size with its parent Game Object.
body.updateFromGameObject();
Debug¶
Bounds of Body
Enable drawing body
body.debugShowBody = true;
Color
body.debugBodyColor = 0xff00ff;
Direction and magnitude of velocity
Enable drawing body
body.debugShowVelocity = true;