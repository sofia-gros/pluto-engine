Custom conext
Introduction¶
Use a custom WebGL drawing context while rendering a group of child Game Objects.
Author: Phaser Team
WebGL only
Only work in WebGL render mode.
Usage¶
Add custom-context object¶
A CustomContext is a Container. Before its children are rendered, it clones the current DrawingContext, passes the clone to a callback, then renders its children with that modified context.
var customContext = scene.add.customcontext(x, y, children, callback);
x, y : Position of the custom-context container.
children : A Game Object, or an array of Game Objects, rendered with the custom drawing context.
callback : Callback that receives the cloned drawing context.
var customContext = scene.add.customcontext(0, 0, [
image0,
image1
], function (drawingContext) {
drawingContext.setAlphaStrategy('dither');
});
Note
CustomContext changes the render state only for its own children.
Add custom-context from JSON¶
var customContext = scene.make.customContext({
x: 0,
y: 0,
children: [
image
],
customContextCallback: function (drawingContext) {
drawingContext.setAlphaStrategy('dither');
},
add: true
});
Change callback¶
customContext.customContextCallback = function (drawingContext) {
drawingContext.setScissorBox(0, 250, 800, 350);
};
Disable custom context modification.
customContext.customContextCallback = null;
Disable stencil for children¶
CustomContext can render selected children without the current stencil test.
var customContext = scene.add.customcontext(0, 0,
scene.add.image(400, 260, 'mech').setScale(2),
function (drawingContext) {
drawingContext.state.stencil.enabled = false;
}
);
This is useful when the scene has active Stencil state, but one object should ignore it.
In the official disable-stencil example:
A stencil creates a drawing region.
The mech image is wrapped in CustomContext and rendered with stencil disabled.
Later particle flames are not wrapped, so they are still affected by stencil.
Warning
Directly editing drawingContext.state is low-level. Prefer drawingContext.set...() methods when a setter exists.
Set scissor box¶
CustomContext can modify the scissor rectangle used by its children.
var customContext = scene.add.customcontext(0, 0,
scene.add.image(400, 250, 'starfield'),
function (drawingContext) {
drawingContext.setScissorBox(0, 250, 800, 350);
}
);
Nested CustomContext objects can override the context again.
var customContext = scene.add.customcontext(0, 0,
[
scene.add.image(400, 250, 'starfield'),
scene.add.customcontext(0, 0,
scene.add.image(400, 500, 'donut').setScale(2),
function (drawingContext) {
drawingContext.setScissorBox(0, 0, 800, 600);
}
)
],
function (drawingContext) {
drawingContext.setScissorBox(0, 250, 800, 350);
}
);
Note
Cameras also use scissor rectangles for their draw areas. Changing scissor state can make children render outside the normal camera scissor area.
Set alpha strategy¶
CustomContext can change alpha handling for its children.
var customContext = scene.add.customcontext(0, 0, emitter, function (drawingContext) {
drawingContext.setAlphaStrategy('dither');
});
This is useful for render paths such as stencil or special alpha handling where the child should use another alpha strategy.
Custom class¶
Define class
class MyCustomContext extends Phaser.GameObjects.CustomContext {
constructor(scene, x, y, children, callback) {
super(scene, x, y, children, callback);
// ...
scene.add.existing(this);
}
// ...
}
scene.add.existing(gameObject) : Adds an existing Game Object to this Scene.
If the Game Object renders, it will be added to the Display List.
If it has a preUpdate method, it will be added to the Update List.
Create instance
var customContext = new MyCustomContext(scene, x, y, children, callback);
Advanced notes¶
CustomContext is an advanced rendering tool. It is intended for focused render-state overrides.
The callback receives a clone of the current DrawingContext.
The modified context is activated before children render.
The cloned context is released after children render.
Mostly use drawingContext.set...() methods.
Methods that do not begin with set are usually internal.
Warning
If the callback changes the DrawingContext to render to a new framebuffer, the result will not automatically render to the canvas. Use the framebuffer texture yourself.
Warning
Creating a new framebuffer every frame is expensive. Use a retained framebuffer, such as one owned by a DynamicTexture, when framebuffer output is required.
Other properties¶
See container and game object.