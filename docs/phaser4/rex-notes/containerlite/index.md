Container Lite
Introduction¶
Control the position and angle of children game objects.
It is inspired from Ziao/phaser3-interim-containers.
Author: Rex
Game object
Live demos¶
Rotate, alpha
Tween child
Create tween config
Mix timeline
Snapshot
Destroy:
Destroy containerLite
Destory scrollablePanel,
Add to p3-container
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexcontainerliteplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcontainerliteplugin.min.js', true);
Add container object
var container = scene.add.rexContainerLite(x, y);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import ContainerLitePlugin from 'phaser4-rex-plugins/plugins/containerlite-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexContainerLitePlugin',
plugin: ContainerLitePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add container object
var container = scene.add.rexContainerLite(x, y);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import ContainerLite from 'phaser4-rex-plugins/plugins/containerlite.js';
Add container object
var container = new ContainerLite(scene, x, y);
scene.add.existing(container);
Add container object¶
var container = scene.add.rexContainerLite(x, y);  // width = 1, height = 1
// var container = scene.add.rexContainerLite(x, y, width, height);
or
var container = scene.add.rexContainerLite(x, y, children);  // width = 1, height = 1
// var container = scene.add.rexContainerLite(x, y, width, height, children);
Add container from JSON
var container = scene.make.rexContainerLite({
x: 0,
y: 0,
width: 1,
height: 1,
// angle: 0,
// alpha: 1,
// scale : {
//    x: 1,
//    y: 1
//},
// origin: {x: 0.5, y: 0.5},
});
Custom class¶
Define class
class MyContainer extends ContainerLite {
constructor(scene, x, y, width, height, children) {
super(scene, x, y, width, height, children);
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
var container = new MyContainer(scene, x, y, width, height, children);
Destroy¶
container.destroy();
Also destroy all children.
Other properties¶
This container game object inherits from Zone.
Add child¶
Pin¶
Add(pin) a game obejct to container
container.add(child);  // child: a game object
// container.pin(child);
child : A game object
or
container.pin(child, {
// syncPosition: true,
// syncRotation: true,
// syncScale : true,
// syncAlpha: true,
// syncScrollFactor: true,
// syncCameraFilter: true,
// syncDisplayList: true
});
child : A game object
syncPosition :
true : Sync position of child, default behavior.
false : Don't sync position of child.
syncRotation :
true : Sync angle of child, default behavior.
false : Don't sync angle of child.
syncScale :
true : Sync scale of child, default behavior.
false : Don't sync angle of child.
syncAlpha :
true : Sync alpha of child, default behavior.
false : Don't sync alpha of child.
syncScrollFactor :
true : Sync scrollFactor of child, default behavior.
false : Don't sync scrollFactor of child.
syncCameraFilter :
true : Sync cameraFilter of child, default behavior.
false : Don't sync cameraFilter of child.
syncDisplayList :
true : Put child into parent's displayList/Layer, default behavior.
Child has to belong to any displayList first.
false : Don't change child's displayList.
Or add(pin) children
container.addMultiple(children);
// container.add(children);
children : An array of game objects
These world properties of children will be changed with container.
Position/Angle/Scale
Visible
Alpha
Scroll factor
Mask
Note
Position of child is the world position, i.e. position of child won't be changed when adding to container initially.
For example, container-lite is at (100, 100), and child is at (110, 110), then child will be placed at (110, 110) after adding to container-lite.
This behavior is different from official container, which using related position of child when adding to container.
For example, official container is at (100, 100), and child is at (10, 10), then child will be placed at (110, 110) after adding to official container.
Add local¶
container.addLocal(child);
or
container.addLocalMultiple(children);
or
container.pinLocal(child, {
// syncPosition: true,
// syncRotation: true,
// syncScale : true,
// syncAlpha: true,
});
Add child to container with related properties, like official container.
For example, container-lite is at (100, 100), and child is at (10, 10), then child will be placed at (110, 110) after adding to container-lite.
Remove child¶
Remove(unpin) a child
container.remove(child);
// container.remove(child, destroyChild);
or
container.unpin(child);
// container.unpin(child, destroyChild);
child : Game object
destroyChild : Set true to destroy child. Default is false.
Remove all children
container.clear();
// container.clear(destroyChild);
Get child¶
Get first child by name
var gameObject = container.getByName(name);
// var gameObject = container.getByName(name, recursive);
gameObject : A child, or null if not found.
recursive : Set true to search all children recursively.
Get a random child
var gameObject = container.getRandom();
// var gameObject = container.getRandom(startIndex, length);
Get children in this container-lite
Internal children array
var gameObjects = container.getChildren();
Copy of children array
var gameObjects = container.getChildren([]);
// var gameObjects = container.getChildren(out);
Get all children under this container-lite recursively
var gameObjects = container.getAllChildren();
Put container itself and all children into Layer
layer.add(container.getAllChildren([container]));
Draw on render texture
rt.draw(container.getAllChildren());
Ignored in camera
camera.ignore(container.getAllChildren());
Traversal¶
Depth-First Search
container.dfs(function(current) {
// return true;  // Discard children traveraling
})
Return true to discard children traveraling
Breadth-First Search
container.bfs(function(current) {
// return true;  // Discard children traveraling
})
Return true to discard children traveraling
Exist¶
Return true if child is under this container-lite (nested).
var hasChild = container.contains(child);
Children¶
var children = container.children;
children : Array of child game objects.
Get parent¶
var parentContainer = scene.plugins.get('rexContainerLitePlugin').getParent(child);
or
var parentContainer = Container.GetParent(child); // Static method
Set properties of child¶
Position¶
container.setChildPosition(child, x, y);
Rotation¶
container.setChildRotation(child, rotation);
rotation : Angle in radians.
Scale¶
container.setChildScale(child, scaleX, scaleY);
or
container.setChildDisplaySize(child, width, height);
Visible¶
container.setChildVisible(child, visible);
Alpha¶
container.setChildAlpha(child, alpha);
Local state of child¶
Get local state
var localState = container.getLocalState(child);
or
var localState = child.rexContainer;
Properties of localState
x, y
rotation
scaleX, scaleY
visible
alpha
Change local state of child¶
Local position
container.setChildLocalPosition(child, x, y);
Local scale
container.setChildLocalScale(child, scaleX, scaleY);
Local alpha
container.setChildLocalAlpha(child, alpha);
Local visible
container.setChildLocalVisible(child, visible);
Reset local state of child¶
Reset local state of child according to current properties of children
Reset local state of all properties
container.resetChildState(child);
Reset local state of position
container.resetChildPositionState(child);
Reset local state of rotation
container.resetChildRotationState(child);
Reset local state of scale
container.resetChildScaleState(child);
Reset local state of alpha
container.resetChildAlphaState(child);
Reset local state of visible
container.resetChildVisibleState(child);
Reset local state of active
container.resetChildActiveState(child);
Tween local state¶
var tweenObj = container.tweenChild({
targets: child,
// x: '+=100',
// y: '+=100',
// repeat: -1,
// yoyo: true
})
targets : A game object, or an array of game object.
A containerLite child, can tween its local state.
Paramters of configuration is the same as tween task.
Supported properties :
x, y,
angle, rotation
scaleX, scaleY, displayWidth, displayHeight
alpha
Tween local state of a containerlite child¶
var tweenObj = containerLiteChild.tweenSelf({
// x: '+=100',
// y: '+=100',
// repeat: -1,
// yoyo: true
})
Equal to
containerLiteChild.tweenChild({
targets: containerLiteChild,
// x: '+=100',
// y: '+=100',
// repeat: -1,
// yoyo: true
})
Create tween config¶
var tweenConfig = container.createTweenChildConfig({
targets: child,
// x: '+=100',
// y: '+=100',
// repeat: -1,
// yoyo: true
});
scene.tweens.add(tweenConfig);
Input of targets is/are game object(s), will be replaced by local state of game object(S)
Wrap onUpdate callback, to update properties of child according to local state.
Depth¶
Get depth of container
var depth = container.depth;
Set depth of container
container.setDepth(value, true);
// container.depth = depth;
Set depth of container and all children
container.setDepth(value);
Bring this container and its children to top
container.bringMeToTop();
// container.bringToTop();
Send this container and its children to back
container.sendMeToBack();
// container.sendToBack();
Swap depth with another container
containerA.swapDepth(containerB);
Increase of container and all children
container.incDepth(value);
Move game object below this container and all children
container.moveMyDepthBelow(gameObject);
// container.moveDepthBelow(gameObject);
Move game object above this container and all children
container.moveMyDepthAbove(gameObject);
// container.moveDepthAbove(gameObject);
Bring a child of container to top of this container
container.bringChildToTop(gameObject);
Send a child of container to bottom of this container
container.sendChildToBack(gameObject);
Renderer layer¶
A containerLite can have an internal renderer layer.
All children will be put into this internal layer, instead of displayList of scene,
and ContainerLite will be very bottom of all children.
Enable renderer layer before adding any child.
container.enableLayer();
Mask¶
Assign mask object to children
container.setMask(mask);  // container.mask = mask;
Remove mask object of children
container.clearMask();
Remove mask object of children, and destroy mask object
container.clearMask(true);
Shader effects¶
Apply filter effect on layer of containerLite.
Snapshot¶
Draw all visible children on a render-texture.
var renderTexture = container.snapshot({
renderTexture: undefined,
padding: 0
});
renderTexture : Draw on this render-texture
undefined : Create a new render-texture
padding :
0 : No extra padding space. Default value.
A number : Add extra padding space around this render-texture.
Draw all visible children on a dynamic-texture
container.snapshot({
padding: 0,
saveTexture: textureKey
});
saveTexture : Save render result to texture manager.
Draw bounds¶
Draw bounds of shown game object on a graphics game object
container.drawBounds(graphics);
// container.drawBounds(graphics, color);
or
container.drawBounds(graphics, {
// color: 0xffffff,
// lineWidth: 1,
// padding: 0,
// drawContainer: true,
// children: undefined,
});
graphics : Graphics game object
color : Default value is 0xffffff.
lineWidth : Default value is 1.
padding : Extra space around bounds. Default value is 0.
drawContainer :
true : Draw all children game objects included containerLite. Default behavior.
false : Draw all children game objects excluded containerLite
children :
Array of game objects : Only draw bounds of these children
undefined : Draw bounds of all children
Scroll factor¶
Set scroll factor to children
container.setScrollFactor(x, y);
Change origin¶
container.changeOrigin(originX, originY);
This method also will reset all local state of children.
Add to container¶
Add to built-in container
containerLite.addToContainer(p3Container);
or
p3Container.add(containerLite);
p3Container : Container game object.
Add to Layer
container.addToLayer(layer);
layer : Layer game object.
Remove from container¶
Remove from built-in container
containerLite.removeFromContainer(p3Container);
or
p3Container.remove(containerLite);
p3Container : Container game object.
Remove from Layer
container.removeFromLayer(layer);
layer : Layer game object.
Other properties¶
See game object
Compare with Official Container¶
Position/anlge/scale of a child object :
Container : Local position/anlge/scale, responding to parent container, not a world position/anlge/scale.
Container-Lite : World position/anlge/scale.
Updating period
Container : Re-calculate position/anlge/scale of each child every render.
Container-Lite: Re-calculate position/anlge/scale of each child when parent container changes position/anlge/scale.
Mask
Container : It has mask property, and it could become a mask object.
Container-Lite : It has mask property, but it could not become a mask object.
DOM game object
Container : Only 1 level parent container will affect DOM game object. Therefore position of DOM game object in nested container might be incorrect.
Container-Lite : DOM game object can work with nested Container-Lite.