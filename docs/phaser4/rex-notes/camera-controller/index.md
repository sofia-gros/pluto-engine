Controller
Introduction¶
Scroll/zoom camera.
Author: Phaser Team
Usage¶
Setup¶
Create controllor
// var cursors = scene.input.keyboard.createCursorKeys();
var controls = new Phaser.Cameras.Controls.SmoothedKeyControl({
camera: camera,
left: cursors.left,    // { isDown, isUp }
right: cursors.right,  // { isDown, isUp }
up: cursors.up,        // { isDown, isUp }
down: cursors.down,    // { isDown, isUp }
zoomIn: null,          // { isDown, isUp }
zoomOut: null,         // { isDown, isUp }
zoomSpeed: 0.01,
minZoom: 0.001,
maxZoom: 1000,
acceleration: null,
// acceleration: {
//    x: 0,
//    y: 0
// }
drag: null,
// drag: {
//    x: 0,
//    y: 0
// }
maxSpeed: null
// maxSpeed: {
//    x: 0,
//    y: 0
// }
});
or
var controls = new Phaser.Cameras.Controls.FixedKeyControl(config);
Update
scene.update = function (time, delta) {
controls.update(delta);
}
Other methods¶
Start
controls.start();
Stop
controls.stop();
Set camera
controls.setCamera(camera);