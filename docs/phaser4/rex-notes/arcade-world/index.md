World
Introduction¶
World of Arcade physics engine in phaser.
Author: Phaser Team
Usage¶
Configuration¶
var config = {
// ...
physics: {
default: 'arcade',
arcade: {
//    x: 0,
//    y: 0,
//    width: scene.sys.scale.width,
//    height: scene.sys.scale.height,
//    gravity: {
//        x: 0,
//        y: 0
//    },
//    checkCollision: {
//        up: true,
//        down: true,
//        left: true,
//        right: true
//    },
//    customUpdate: false,
//    fixedStep: true,
//    fps: 60,
//    timeScale: 1,     // 2.0 = half speed, 0.5 = double speed
//    customUpdate: false,
//    overlapBias: 4,
//    tileBias: 16,
//    forceX: false,
//    isPaused: false,
//    debug: false,
//    debugShowBody: true,
//    debugShowStaticBody: true,
//    debugShowVelocity: true,
//    debugBodyColor: 0xff00ff,
//    debugStaticBodyColor: 0x0000ff,
//    debugVelocityColor: 0x00ff00,
//    maxEntries: 16,
//    useTree: true   // set false if amount of dynamic bodies > 5000
}
}
// ...
};
var game = new Phaser.Game(config);
Update¶
Default updating : World updating every tick
Custom updating :
Set customUpdate of arcade config to false.
Enable world updating : scene.physics.enableUpdate()
Disable world updating : scene.physics.disableUpdate()
Run world updating manually
scene.physics.world.update(time, delta);
Enable/disable world updating
Enable : scene.physics.enableUpdate()
Disable : scene.physics.disableUpdate()
Step¶
Advances the simulation by a single step.
scene.physics.world.singleStep();
Advances the simulation by a time increment.
scene.physics.world.step(delta);
Events¶
World step
scene.physics.world.on('worldstep', function(delta) { /* ... */ });
delta : The delta time amount of this step, in seconds.
Control¶
Pause¶
scene.physics.pause();
Resume¶
scene.physics.resume();
Events¶
Pause world
scene.physics.world.on('pause', function() { /* ... */ });
Resume world
scene.physics.world.on('resume', function() { /* ... */ });
Duration per frame¶
Time scale
scene.physics.world.timeScale = timeScale;
1.0 = normal speed
2.0 = half speed
0.5 = double speed
FPS
scene.physics.world.setFPS(framerate);
Tile filter options¶
var option = scene.physics.world.tileFilterOptions;
option
{
isColliding: true,
isNotEmpty: true,
hasInterestingFace: true
}
Body¶
Enable¶
scene.physics.world.enable(gameObject);
// scene.physics.world.enable(gameObject, bodyType);
gameObject : A game object, or array of game objects, or game objects in a Group
bodyType :
0 : Dynamic body. Default value.
1 : Static body.
Or
scene.physics.add.existing(gameObject, bodyType);
See arcade-body
Disable¶
scene.physics.world.disable(gameObject);
gameObject : A game object, or array of game objects, or game objects in a Group
Add/remove body¶
Add body to the local search trees.
scene.physics.world.add(body);
Remove body from the local search trees.
scene.physics.world.disableBody(body);
Collision¶
Set bound¶
See bound in body object, or game object.
Collider & callback¶
Add collider
Push out
scene.physics.add.collider(objectsA, objectsB);
Performs a collision check and separation between the two physics enabled objects given.
var collider = scene.physics.add.collider(objectsA, objectsB, collideCallback);
// var collider = scene.physics.add.collider(objectsA, objectsB, collideCallback, processCallback, callbackContext);
If you don't require separation then use overlap instead.
var collider = scene.physics.add.overlap(objectsA, objectsB, collideCallback);
// var collider = scene.physics.add.overlap(objectsA, objectsB, collideCallback, processCallback, callbackContext);
Parameters
objectsA, objectsB :
A game object
An array contains Game objects (Add or remove game objects)
Physics group/Group (Add or remove game objects)
An array contains Physics group/Group
collideCallback :
var collideCallback = function(gameObject1, gameObject2) {
// ...
}
processCallback : Fired when gameObject1 intersects gameObject2, optional.
var processCallback = function(gameObject1, gameObject2) {
return true;  // return false will discard remaining collision checking
}
Remove collider
scene.physics.world.removeCollider(collider);
Deactivate collider
collider.active = false;  // Set true to activate again
Name of collider (unused by engine)
collider.name = name;
Testing wo collider¶
Test overlapping
var isOverlapping = scene.physics.world.overlap(object1, object2);
or
var isOverlapping = scene.physics.world.overlap(object1, object2, collideCallback);
// var isOverlapping = scene.physics.world.overlap(object1, object2, collideCallback, processCallback, callbackContext);
Test colliding, also push out
var isCollided = scene.physics.world.collide(object1, object2);
or
var isCollided = scene.physics.world.collide(object1, object2, collideCallback);
// var isCollided = scene.physics.world.collide(object1, object2, collideCallback, processCallback, callbackContext);
Events¶
Two bodies overlap and at least one of them has their onOverlap property set to true.
scene.physics.world.on('overlap', function(gameObject1, gameObject2, body1, body2) { /* ... */ });
Two bodies overlap and at least one of them has their onCollide property set to true.
scene.physics.world.on('collide', function(gameObject1, gameObject2, body1, body2) { /* ... */ });
A body overlaps with a Tile and has its onOverlap property set to true.
scene.physics.world.on('tileoverlap', function(gameObject, tile, body) { /* ... */ });
A body overlaps with a Tile and has its onCollide property set to true.
scene.physics.world.on('tilecollide', function(gameObject, tile, body) { /* ... */ });
World bounds¶
Enable¶
Body : Set body.setCollideWorldBounds() to enable worldBounds property.
World :
Set bounds rectangle and enable bounds
scene.physics.world.setBounds(x, y, width, height);
// scene.physics.world.setBounds(x, y, width, height, checkLeft, checkRight, checkUp, checkDown);
Set bounds rectangle
scene.physics.world.bounds.setTo(x, y, width, height);
or
scene.physics.world.bounds.x = x;
scene.physics.world.bounds.y = y;
scene.physics.world.bounds.width = width;
scene.physics.world.bounds.height = height;
Enable bounds
scene.physics.world.setBoundsCollision();
// scene.physics.world.setBoundsCollision(left, right, up, down);
or
scene.physics.world.checkCollision.left = left;
scene.physics.world.checkCollision.right = right;
scene.physics.world.checkCollision.up = up;
scene.physics.world.checkCollision.down = down;
Get bounds rectangle
var top = scene.physics.world.bounds.top;
var bottom = scene.physics.world.bounds.bottom;
var left = scene.physics.world.bounds.left;
var right = scene.physics.world.bounds.right;
Bodies inside an area¶
Overlap a rectangle area
var bodies = scene.physics.overlapRect(x, y, width, height, includeDynamic, includeStatic);
includeDynamic : Set true to search Dynamic Bodies
includeStatic : Set true to search Static Bodies
Overlap a circle area
var bodies = scene.physics.overlapCirc(x, y, radius, includeDynamic, includeStatic);
includeDynamic : Set true to search Dynamic Bodies
includeStatic : Set true to search Static Bodies
Events¶
World bounds
scene.physics.world.on('worldbounds', function(body, blockedUp, blockedDown, blockedLeft, blockedRight) { /* ... */ });
Wrap¶
scene.physics.world.wrap(gameObject, padding);
gameObject:
game object
group
array of game objects
Move to¶
Move to position with a steady velocity
scene.physics.moveTo(gameObject, x, y, speed, maxTime);
Move to object with a steady velocity
scene.physics.moveToObject(gameObject, destination, speed, maxTime);
Accelerate to¶
Accelerate to position
scene.physics.accelerateTo(gameObject, x, y, acceleration, xSpeedMax, ySpeedMax);
Accelerate to object
scene.physics.accelerateToObject(gameObject, destination, acceleration, xSpeedMax, ySpeedMax);
Gravity¶
Set
scene.physics.world.gravity.x = gx;
scene.physics.world.gravity.y = gy;
Get
var gx = scene.physics.world.gravity.x;
var gy = scene.physics.world.gravity.y;
Total Gravity = world.gravity + body.gravity
Bodies¶
Closest/furthest¶
Closest
var body = scene.physics.closest(point);  // point: {x,y}
// var body = scene.physics.closest(point, targets);
targets : Array of Arcade Physics Game Object, Body or Static Body.
Furthest
var body = scene.physics.furthest(point);  // point: {x,y}
// var body = scene.physics.furthest(point, targets);
targets : Array of Arcade Physics Game Object, Body or Static Body.
Debug¶
Draw body & velocity¶
Bounds of dynamic Body
Enable drawing body
scene.physics.world.defaults.debugShowBody = true;
Color
scene.physics.world.defaults.bodyDebugColor = 0xff00ff;
Bounds of static Body
Enable drawing body
scene.physics.world.defaults.debugShowStaticBody = true;
Color
scene.physics.world.defaults.staticBodyDebugColor = 0x0000ff;
Direction and magnitude of velocity
Enable drawing body
scene.physics.world.defaults.debugShowVelocity = true;
Color
scene.physics.world.defaults.velocityDebugColor = 0x00ff00;
Graphics¶
Draw debug body & velocity on a Graphics object.
var graphics = scene.physics.world.debugGraphic;
Set visible
scene.physics.world.debugGraphic.setVisible();
Set invisible
scene.physics.world.debugGraphic.setVisible(false);
Update loop¶
scene.sys.events: update
Update position & angle of each body
Process each collider
Update final position of each body
Emit worldstep event
scene.sys.events: postupdate
Draw debug graphics
graph TB
SceneEventUpdate>"scene.sys.events: update<br><br>Update arcade world<br>gameObject.preUpdate()"]
SceneUpdate["scene.update()"]
SceneEventPostUpdate>"scene.sys.events: postupdate<br><br>Post update arcade world"]
Render
SceneEventUpdate --> SceneUpdate
SceneUpdate --> SceneEventPostUpdate
SceneEventPostUpdate --> Render