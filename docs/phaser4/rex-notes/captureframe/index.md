Capture frame
Introduction¶
Capture the current state of the render, stored as a texture.
Author: Phaser Team
WebGL only
Only work in WebGL render mode.
Usage¶
Add capture-frame object¶
Setup
Capture rendering result in scene's display list
camera.setForceComposite(true);
or
camera.filtersForceComposite = true;
Capture rendering result in Layer or Container
layer.setForceComposite(true);
or
layer.filtersForceComposite = true;
Create a capture-frame object.
var captureFrame = scene.add.captureFrame(key);
key : Texture key.
Add render texture from JSON
var captureFrame = scene.make.renderTexture({
// key: null,
add: true
});
Custom class¶
Define class
class MyCaptureFrame extends Phaser.GameObjects.CaptureFrame {
constructor(scene, key) {
super(scene, key);
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
var captureFrame = new MyCaptureFrame(scene, key);
Display texture¶
Display captured result by Image game object
var image = scene.add.image(x, y, key);
Note
Place a fully opaque image at the bottom.
Snapshot¶
Snapshot captured result by RenderTexture game object's snapshot method
var rt = scene.add.rendertexture(0, 0, windowW, height)
.draw(captureFrame).render().snapshot(callback);
Other properties¶
See game object