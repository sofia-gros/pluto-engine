Camera
Introduction¶
Camera to display game objects, built-in object of phaser.
Author: Phaser Team
Usage¶
Get camera¶
Each scene has one or more cameras.
Main camera
var camera = scene.cameras.main;
Get camera by name
var camera = scene.cameras.getCamera(name);
Add new camera
var camera = scene.cameras.add();
// var camera = scene.cameras.add(x, y, width, height);
Add new camera with name
var camera = scene.cameras.add(undefined, undefined, undefined, undefined, false, name);
// var camera = scene.cameras.add(x, y, width, height, makeMain, name);
Add existed camera
scene.cameras.addExisting(camera);
Create cameras from JSON¶
scene.cameras.fromJSON(config);
// scene.cameras.fromJSON(configArray);
config :
{
name: '',
x: 0,
y: 0,
width: scene.sys.scale.width,
height: scene.sys.scale.height,
zoom: 1,
rotation: 0,
scrollX: 0,
scrollY: 0,
roundPixels: false,
visible: true,
backgroundColor: false,
bounds: null, // {x, y, width, height}
}
Remove camera¶
scene.cameras.remove(camera);
Destroy camera¶
camera.destroy();
View port¶
Set
camera.setViewport(top, left, width, height);
or
camera.setPosition(top, left);
// camera.x = top;
// camera.y = left;
camera.setSize(width, height);
// camera.width = width;
// camera.height = height;
Get
Position
Top-left
var top = camera.x;
var left = camera.y;
Center, relative to the top-left of the game canvas.
var x = camera.centerX;
var y = camera.centerY;
Width & height
var width = camera.width;
var height = camera.height;
var displayWidth = camera.displayWidth;
var displayHeight = camera.displayHeight;
Zoom¶
Set
camera.setZoom(zoomValue);  // The minimum it can be is 0.001.
camera.zoom = zoomValue;
Get
var zoomValue = camera.zoom;
Rotation¶
Set
camera.setAngle(angle);  // angle in degree
camera.setRotation(angle);  // angle in radians
camera.rotation = angle; // angle in radians
Get
var angle = camera.rotation;  // angle in radians
Origin¶
Set
camera.setOrigin(x, y);
// camera.originX = 0.5;
// camera.originY = 0.5;
Get
var originX = camera.originX
var originY = camera.originY
Visible¶
A visible camera will render and perform input tests.
An invisible camera will not render anything and will skip input tests.
camera.setVisible(value);
// camera.visible = value
var visible = camera.visible;
Alpha¶
camera.setAlpha(value);
// camera.alpha = value;
var alpha = camera.alpha;
Scroll¶
camera.setScroll(x, y)
camera.scrollX = scrollX;
camera.scrollY = scrollY;
camera.centerToBounds();
camera.centerOn(x, y);  // centered on the given coordinates
camera.centerOnX(x);
camera.centerOnY(y);
camera.centerToSize();
Follow game object¶
Start following
camera.startFollow(gameObject);
// camera.startFollow(gameObject, roundPx, lerpX, lerpY, offsetX, offsetY);  //
roundPx : set true to round the camera position to integers
lerpX, lerpY : A value between 0 and 1.
1 : Camera will instantly snap to the target coordinates.
0.1 : Camera will more slowly track the target, giving a smooth transition.
offsetX, offsetY : The horizontal/vertical offset from the camera follow target.x position.
Stop following
camera.stopFollow();
Set follow offset
camera.setFollowOffset(x, y);
Set lerp
camera.setLerp(x, y);
1 : Camera will instantly snap to the target coordinates.
0.1 : Camera will more slowly track the target, giving a smooth transition.
Deadzone
camera.setDeadzone(width, height);
If the target moves outside of this area, the camera will begin scrolling in order to follow it.
Boundaries
var left = camera.deadzone.left;
var right = camera.deadzone.right;
var top = camera.deadzone.top;
var bootom = camera.deadzone.bottom;
Clear deadzone
camera.setDeadzone();
Events¶
Follower Update
camera.on('followupdate', function(camera, gameObject){ })
Scroll factor¶
See Scroll factor in game object.
Bounds¶
Set
camera.setBounds(x, y, width, height)
Get
var bounds = camera.getBounds();  // bounds: a rectangle object
// var out = camera.getBounds(out);
World coordinates¶
World view, a rectangle object
var worldView = camera.worldView;
var x = worldView.x;
var y = worldView.y;
var width = worldView.width;  // displayWidth
var height = worldView.height; // displayHeight
var left = worldView.left;  // x
var right = worldView.right;  // x + width
var top = worldView.top;  // y
var bottom = worldView.bottom;  // y + height
var centerX = worldView.centerX;
var centerY = worldView.centerY;
var isInside = worldView.contains(x, y);
var randPoint = worldView.getRandomPoint(point); // point: {x, y}
Middle point
var x = camera.midPoint.x;
var y = camera.midPoint.y;
Get world position
var out = camera.getWorldPoint(x, y);
// var out = camera.getWorldPoint(x, y, out);
x , y : Position of camera.
out : World position {x, y}
Set background color¶
camera.setBackgroundColor(color);
Ignore game object¶
Ignored game objects won't show at that camera.
camera.ignore(gameObject);
gameObject :
A game object
An array of game objects
A group
Get cameras below pointer¶
var cameras = scene.cameras.getCamerasBelowPointer(pointer);
cameras : An array of cameras.
pointer : {x, y}
Pause, resume¶
Pause
camera.renderToTexture = false; // Pause
Resume
camera.renderToTexture = true; // Resume
Clear¶
camera.clearRenderToTexture();
Children¶
Visible children¶
Filter visible children
var visible = scene.cameras.getVisibleChildren(children, camera);
Get all visible children
var visible = scene.cameras.getVisibleChildren(scene.sys.displayList.list, camera);
See also: gameObject.willRender(camera)
Render children¶
var children = camera.renderList;
Read only.