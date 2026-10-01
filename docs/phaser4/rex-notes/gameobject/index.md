Game object
Introduction¶
Base class of all game object in phaser.
Author: Phaser Team
Usage¶
Destroy¶
Destroy game object
gameObject.destroy();
Game object will be destroyed automatically when scene destroyed, if it is in display list, or update list.
Event
gameObject.once('destroy', function(gameObject, fromScene) {
}, scope);
fromScene : true if game object is destroyed during scene is shutdown. When scene is shutdown, all game objects will be destroyed.
Is destroyed
var isDestroyed = gameObject.isDestroyed;
Position¶
Get
var x = gameObject.x;
var y = gameObject.y;
Set
gameObject.x = 0;
gameObject.y = 0;
gameObject.setPosition(x,y);
gameObject.setX(x);
gameObject.setY(y);
Set random
gameObject.setRandomPosition(x, y, width, height);
// gameObject.setRandomPosition(); // x=0, y=0, width=game.width, height=game.height
Local point¶
Transfer world point to local point
var point = gameObject.getLocalPoint(x, y);  // point : {x, y}
// var out = gameObject.getLocalPoint(x, y, out);
or
var out = gameObject.getLocalPoint(x, y, out, camera);
Angle¶
Get
var angle = gameObject.angle;
var radians = gameObject.rotation;  // angle in radians
Set
gameObject.angle = degrees;
gameObject.rotation = radians;
gameObject.setAngle(degrees);
gameObject.setRotation(radians);
Visible¶
Get
var visible = gameObject.visible; // visible: true/false
Set
gameObject.visible = visible;
gameObject.setVisible(visible);
Alpha¶
Get
var alpha = gameObject.alpha;  // 0~1
Set
gameObject.setAlpha(alpha);
// gameObject.alpha = alpha;
or
gameObject.setAlpha(topLeft, topRight, bottomLeft, bottomRight);
// gameObject.alphaTopLeft = alpha;
// gameObject.alphaTopRight = alpha;
// gameObject.alphaBottomLeft = alpha;
// gameObject.alphaBottomRight = alpha;
Clear (set to 1)
gameObject.clearAlpha();
FlipX, FlipY¶
Get
var flip = gameObject.flipX;  // flip: true/false
var flip = gameObject.flipY;  // flip: true/false
Set
gameObject.flipX = flip;
gameObject.flipY = flip;
gameObject.setFlipX(flip);
gameObject.setFlipY(flip);
gameObject.setFlip(flipX, flipY);
gameObject.toggleFlipX();
gameObject.toggleFlipY();
gameObject.resetFlip();  // equal to gameObject.setFlip(false, false);
Order of rendering¶
Depth (z-index)¶
The depth starts from zero (the default value) and increases from that point. A game object with a higher depth value will always render in front of one with a lower value.
Get
var depth = gameObject.depth;
Set
gameObject.depth = value;
gameObject.setDepth(value);
Display list¶
Get displayList
var displayList = gameObject.getDisplayList();
Move the game Object to the top of the display list
gameObject.setToTop()
var displayList = gameObject.getDisplayList();
displayList.bringToTop(child);
Move the game Object to the bottom of the display list
gameObject.setToBack()
var displayList = gameObject.getDisplayList();
displayList.sendToBack(child);
Move the Game Object to appear above a given Game Object
gameObject.setAbove(givenGameObject)
var displayList = gameObject.getDisplayList();
displayList.moveAbove(gameObject, givenGameObject);
Move the Game Object to appear below a given Game Object
gameObject.setBelow(givenGameObject)
var displayList = gameObject.getDisplayList();
displayList.moveBelow(gameObject, givenGameObject);
Move the game object by index
var displayList = gameObject.getDisplayList();
displayList.moveTo(gameObject, index);
Swap two game objects
var displayList = gameObject.getDisplayList();
displayList.swap(gameObject, givenGameObject);
Move up or down
var displayList = gameObject.getDisplayList();
displayList.moveUp(gameObject);
displayList.moveDown(gameObject);
Layer game object¶
Place game object into Layer game object
Scroll factor¶
Get
var scrollFactorX = gameObject.scrollFactorX;
var scrollFactorY = gameObject.scrollFactorY;
Set
gameObject.setScrollFactor(scrollFactor);
gameObject.setScrollFactor(scrollFactorX, scrollFactorY);
Scroll factor: 0~1
0= fixed to camera
0.25= quarter the speed of the camera
0.5= half the speed of the camera
Bounds¶
var output = gameObject.getTopLeft(output);     // output: {x, y}
var output = gameObject.getTopCenter(output);     // output: {x, y}
var output = gameObject.getTopRight(output);    // output: {x, y}
var output = gameObject.getLeftCenter(output);    // output: {x, y}
var output = gameObject.getRightCenter(output);    // output: {x, y}
var output = gameObject.getBottomLeft(output);  // output: {x, y}
var output = gameObject.getBottomCenter(output);     // output: {x, y}
var output = gameObject.getBottomRight(output); // output: {x, y}
var output = gameObject.getCenter(output);      // output: {x, y}
var output = gameObject.getBounds(output);      // output: {x, y, width, height}
Draw bounds on graphics
// var graphics = scene.add.graphics();
graphics
.lineStyle(lineWidth, color, alpha)
.strokeRectShape(gameObject.getBounds());
Origin¶
Get
var originX = gameObject.originX;
var originY = gameObject.originY;
Set
gameObject.setOrigin(x, y);
// gameObject.setOrigin(x); // y = x
Set to top-left
gameObject.setOrigin(0);
Set to center
gameObject.setOrigin(0.5);
Set to bottom-right
gameObject.setOrigin(1);
Tint¶
Tint color
Get
var color = gameObject.tintTopLeft;     // color: 0xRRGGBB
var color = gameObject.tintTopRight;
var color = gameObject.tintBottomLeft;
var color = gameObject.tintBottomRight;
var tint = gameObject.tint; // tintTopLeft
Set
gameObject.setTint(color);
gameObject.setTint(colorTopLeft, colorTopRight, colorBottomLeft, colorBottomRight);
gameObject.tint = color;
Tint mode
Get
var tintMode = gameObject.tintMode;
var isTinted = gameObject.isTinted;
tintMode :
Phaser.TintModes.MULTIPLY
Phaser.TintModes.FILL
Phaser.TintModes.ADD
Phaser.TintModes.SCREEN
Phaser.TintModes.OVERLAY
Phaser.TintModes.HARD_LIGHT
Set
gameObject.setTintMode(tintMode);
gameObject.tintMode = tintMode;
Clear tint
gameObject.clearTint();
// gameObject.setTint(0xffffff).setTintMode(Phaser.TintModes.MULTIPLY);
WebGL only
Only work in WebGL render mode.
Blend mode¶
Get
var blendMode = gameObject.blendMode;
Set
gameObject.blendMode = blendMode;
gameObject.setBlendMode(blendMode);
blendMode : Blend mode
Mask¶
See Mask.
Built-in shader effects¶
See built-in shader effects
Post-fx pipeline¶
Register post-fx pipeline¶
Register post-fx pipeline in game config
import PostFxClass from 'path';
var config = {
// ...
pipeline: [PostFxClass]
// ...
};
var game = new Phaser.Game(config);
Some post-fx pipelines:
Barrel: Barrel post processing filter.
Color replace: Replace color post processing filter.
Cross-stitching: Cross-stitching post processing filter.
Dissolve: Dissolve transition post processing filter.
Fish eye: Fish-eye post processing filter.
Hsl-adjust: Adjust color in HSL domain, post processing filter.
Horri-fi: 6-in-1 post processing filter.
Toonify: Draw outlines and quantize color in HSV domain, post processing filter.
Shockwave: Shockwave post processing filter.
Split: Split image into 4 parts.
Swirl: Swirl post processing filter.
Warp: Warp post processing filter.
Add post-fx pipeline¶
gameObject.setPostPipeline(PostFxClass);
PostFxClass : Class of post-fx pipeline.
Remove post-fx pipeline¶
Remove a post-fx pipeline
gameObject.removePostPipeline(PostFxClass);
Remove all post-fx pipelines
gameObject.resetPipeline(true);
or
gameObject.postPipelines = [];
gameObject.hasPostPipeline = false;
Get post-fx pipeline¶
var pipelineInstance = gameObject.getPostPipeline(PostFxClass);
Size¶
Native (un-scaled) size
Get
var width = gameObject.width;
var height = gameObject.height;
Set
gameObject.setSize(width, height);
or
gameObject.width = width;
gameObject.height = height;
Display size
Get
var displayWidth = gameObject.displayWidth;
var displayHeight = gameObject.displayHeight;
Set
gameObject.setDisplaySize(displayWidth, displayHeight);
or
gameObject.displayWidth = displayWidth;
gameObject.displayHeight = displayHeight;
Scale
Get
var scaleX = gameObject.scaleX;
var scaleY = gameObject.scaleY;
or
var scale = gameObject.scale;  // Return (scaleX + scaleY)/2
Set
gameObject.setScale(scaleX, scaleY);
or
gameObject.scaleX = scaleX;
gameObject.scaleY = scaleY;
or
gameObject.scale = scale;  // Set scaleX, scaleY to scale
Click¶
gameObject.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
// ...
});
See touch event
State¶
Get
var state = gameObject.state;
Set
gameObject.setState(state);
Data¶
Get
var value = gameObject.getData(key);
var values = gameObject.getData(keys); // keys: an array of keys
var value = gameObject.data.values[key];
Set
gameObject.setData(key, value);
gameObject.incData(key, value);
gameObject.setData(obj); // obj: {key0:value0, key1:value1, ...}
gameObject.data.values[key] = value;
gameObject.data.values[key] += inc;
or
gameObject.toggleData(key);
Enable
gameObject.setDataEnabled();
Events :
Set data evant
gameObject.on('setdata', function(gameObject, key, value){ /* ... */ });
Change data event
gameObject.on('changedata', function(gameObject, key, value, previousValue){ /* ... */ });
gameObject.on('changedata-' + key, function(gameObject, value, previousValue){ /* ... */ });
See data manager
Note
Ensure data manager is created before binding any data-changed events.
Texture¶
Set texture via key string
gameObject.setTexture(key);
// gameObject.setTexture(key, frame);
// gameObject.setTexture(key, frame, updateSize, updateOrigin);
Set texture via texture object
gameObject.setTexture(texture);
// gameObject.setTexture(texture, frame);
texture : Texture object, or canvas texture object
Set frame
gameObject.setFrame(frame);
// gameObject.setFrame(frame, updateSize, updateOrigin);
frame :　The name or index of the frame within the Texture.
updateSize : Should this call adjust the size of the Game Object?
updateOrigin : Should this call adjust the origin of the Game Object?
Set frame by frame object
gameObject.setFrame(frameObject);
// gameObject.setFrame(frameObject, updateSize, updateOrigin);
Applies a crop to a texture
gameObject.setCrop(x, y, width, height);
The crop coordinates are relative to the texture frame, not the Game Object, meaning 0 x 0 is the top-left.
Reset crop
gameObject.setCrop();
// gameObject.isCropped = false;
Get texture, frame.
var texture = gameObject.texture;
var frame = gameObject.frame;
Get texture key, frame name.
var textureKey = gameObject.texture.key;
var frameName = gameObject.frame.name;
Name¶
Get
var name = gameObject.name;
Set
gameObject.setName(name);
gameObject.name = name;
Will render¶
Test render flag and camera filter.
var willRennder = gameObject.willRender(camera);
Test render flag only
var willRender = (gameObject.renderFlags === Phaser.GameObjects.GameObject.RENDER_MASK);
Phaser.GameObjects.GameObject.RENDER_MASK : 15 (Visible, Alpha, Transform and Texture)
Add to scene/container¶
Add¶
Trigger 'addedtoscene' event, which invoke gameObject.addedToScene()
Register 'addedtoscene' event
gameObject.on('addedtoscene', function(gameObject, scene){});
Or, override addedToScene method
class MyClass extends BaseClass {
// ...
addedtoscene() {
super.addedtoscene();
// ...
}
}
Remove¶
Trigger 'removedfromscene' event, which invoke gameObject.removedFromScene()
Register 'removedfromscene' event
gameObject.on('removedfromscene', function(gameObject, scene){});
Or, override removedFromScene method
class MyClass extends BaseClass {
// ...
removedFromScene() {
super.removedFromScene();
// ...
}
}
Custom class¶
Define class
class MyClass extends BaseClass {
constructor(scene, x, y) {
super(scene, x, y);
// ...
scene.add.existing(this);
}
// ...
// preUpdate(time, delta) {
//     if (super.preUpdate) {
//         super.preUpdate(time, delta);
//     }
// }
// destroy(fromScene) {
//     //  This Game Object has already been destroyed
//     if (!this.scene) {
//         return;
//     }
//     super.destroy(fromScene);
// }
}
scene.add.existing(gameObject) : Adds an existing Game Object to this Scene.
If the Game Object renders, it will be added to the Display List.
If it has a preUpdate method, it will be added to the Update List.
Some kinds of game object like Sprite, Dom-element has preUpdate method already.
Create instance
var image = new MyClass(scene, x, y, key);