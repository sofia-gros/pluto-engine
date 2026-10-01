Game object
Introduction¶
Arcade physics Image/Sprite/Group object.
Author: Phaser Team
Usage¶
Add physics object¶
Enable physics world
Image object¶
Static object, extends from Image object
var image = scene.physics.add.staticImage(x, y, key);
Dynamic object, extends from Image object
var image = scene.physics.add.image(x, y, key);
Sprite object¶
Static object, extends from Sprite object
var image = scene.physics.add.staticSprite(x, y, key, frame);
Dynamic object, extends from Sprite object
var image = scene.physics.add.sprite(x, y, key, frame);
Group¶
Static sprite objects, extends from Group object
var group = scene.physics.add.staticGroup(children, config);
// var group = scene.physics.add.staticGroup(config);
Dynamic sprite objects, extends from Group object
var group = scene.physics.add.group(children, config);
// var group = scene.physics.add.staticGroup(config);
config
var config = {
classType: ArcadeSprite,
enable: true,
collideWorldBounds: false,
customBoundsRectangle: null,
accelerationX: 0,
accelerationY: 0,
allowDrag: true,
allowGravity: true,
allowRotation: true,
useDamping: false,
bounceX: 0,
bounceY: 0,
dragX: 0,
dragY: 0,
gravityX: 0,
gravityY: 0,
frictionX: 0,
frictionY: 0,
maxSpeed: -1,
velocityX: 0,
velocityY: 0,
maxVelocityX: 10000,
maxVelocityY: 10000,
angularVelocity: 0,
angularAcceleration: 0,
angularDrag: 0,
mass: 0,
immovable: false,
maxSize: -1,
runChildUpdate: false
};
Enable¶
Enable body
gameObject.enableBody();
// gameObject.enableBody(false, 0, 0, enableGameObject, showGameObject);
Enable and reset position
gameObject.enableBody(true, x, y);
// gameObject.enableBody(true, x, y, enableGameObject, showGameObject);
enableGameObject : Also activate this Game Object.
showGameObject : Also show this Game Object.
Disable body
gameObject.disableBody();
// gameObject.disableBody(disableGameObject, hideGameObject);
disableGameObject : Also deactivate this Game Object.
hideGameObject : Also hide this Game Object.
Movement¶
Velocity¶
Set
gameObject.setVelocity(x, y);
or
gameObject.setVelocityX(x);
gameObject.setVelocityY(y);
Get
var vx = gameObject.body.velocity.x;
var vy = gameObject.body.velocity.y;
Max velocity¶
Set
gameObject.setMaxVelocity(x, y);
Get
var vx = gameObject.body.maxVelocity.x;
var vy = gameObject.body.maxVelocity.y;
Acceleration¶
Set
gameObject.setAcceleration(x, y);
or
gameObject.setAccelerationX(x);
gameObject.setAccelerationY(y);
Get
var ax = gameObject.body.acceleration.x;
var ay = gameObject.body.acceleration.y;
Gravity¶
Set
gameObject.setGravity(x, y);
or
gameObject.setGravityX(x);
gameObject.setGravityY(y);
Get
var gx = gameObject.body.gravity.x;
var gy = gameObject.body.gravity.y;
Drag¶
Set
gameObject.setDrag(x, y);
or
gameObject.setDragX(x);
gameObject.setDragY(y);
Get
var dx = gameObject.body.drag.x;
var dy = gameObject.body.drag.y;
Enable damping
gameObject.setDamping(value);
Immovable¶
Enable
gameObject.setImmovable();
Disable
gameObject.setImmovable(false);
Get
var immovable = gameObject.body.immovable;
Pushable¶
Enable
gameObject.setPushable();
Disable
gameObject.setPushable(false);
Get
var pushable = gameObject.body.pushable;
Slide factor¶
The Slide Factor controls how much velocity is preserved when this Body is pushed by another Body.
gameObject.setSlideFactor(x, y);
x, y :
1 : Take on all velocity given in the push. Default value.
0 : Allow this Body to be pushed but then remain completely still after the push ends,
such as you see in a game like Sokoban.
Other value between 0 ~ 1 : Keep x/y of the original velocity when the push ends.
Combine this with the setDrag() method to create deceleration.
Friction¶
If this Body is immovable and in motion, this the proportion of this Body's movement received by the riding body on each axis.
Set
gameObject.setFriction(x, y);
or
gameObject.setFrictionX(x);
gameObject.setFrictionY(y);
Get
var fx = gameObject.body.friction.x;
var fy = gameObject.body.friction.y;
Direct control¶
Enable directControl when game object is controlled by tween or dragging.
Default behavior is disable.
Enable
gameObject.setDirectControl();
// gameObject.setDirectControl(true);
Disable
gameObject.setDirectControl(false);
Use case
Enable setDirectControl when game object is controlled by tween or dragging.
Rotation¶
Allow rotation¶
Whether this Body's rotation is affected by its angular acceleration and velocity.
Enable (default)
body.setAllowRotation();
Disable
body.setAllowRotation(false);
Get
var allowRotation = gameObject.body.allowRotation;
Angular velocity¶
Set
gameObject.setAngularVelocity(v);
Get
var av = gameObject.body.angularVelocity;
Angular acceleration¶
-Set
gameObject.setAngularAcceleration(v);
- Get
var aa = gameObject.body.angularAcceleration;
Angular drag¶
Set
gameObject.setAngularDrag(v);
Get
var ad = gameObject.body.angularDrag;
Collision¶
Collision category¶
A body is only below to one collision category.
A body can collide with multiple collision categories.
The default is that all bodies collide with all others.
Collision category
Get
var collisionCategory = gameObject.body.collisionCategory;
Set
gameObject.setCollisionCategory(category);
category :
(1 << 0)
(1 << 1)
(1 << 2)
...
(1 << 31)
Reset collision category, to default behavior (all bodies collide with all others)
gameObject.resetCollisionCategory();
Set collisionCategory to 1.
Set collisionMask to 1
Collision mask
Get
var collisionMask = gameObject.body.collisionMask;
Set
gameObject.setCollidesWith(categories);
categories : A single category value, or an array of them.
Add
gameObject.addCollidesWith(category):
category : A single category value.
Remove
gameObject.removeCollidesWith(category);
category : A single category value.
Collision bound¶
Rectangle
gameObject.setBodySize(width, height, center);
center : false to set body's offset to (0, 0)
Circle
gameObject.setCircle(radius, offsetX, offsetY);
Offset¶
gameObject.setOffset(x, y);
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
var hit = gameObject.hitTest(x, y);
Bounce¶
Set
gameObject.setBounce(x, y);
or
gameObject.setBounceX(x);
gameObject.setBounceY(y);
Get
var bx = gameObject.body.bounce.x;
var by = gameObject.body.bounce.y;
Enable bounce when colliding with the world boundary
gameObject.setCollideWorldBounds();
Disable bounce when colliding with the world boundary
gameObject.setCollideWorldBounds(false);
Mass¶
Set
gameObject.setMass(m);
Get
var m = gameObject.body.mass;
Static game object¶
Sync¶
Syncs the Bodies position and size in static game object.
gameObject.refreshBody();
Methods of group¶
group.setVelocity(x, y, step);
group.setVelocityX(value, step);
group.setVelocityY(value, step);
group.refresh();  // call this method when position of game objects were changed in static object group
Debug¶
gameObject.setDebug(showBody, showVelocity, bodyColor);
gameObject.setDebugBodyColor(bodyColor);