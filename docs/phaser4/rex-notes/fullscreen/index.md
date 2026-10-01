Full screen
Introduction¶
Enable or disable full screen mode, built-in method of phaser.
Author: Phaser Team
Usage¶
Enable/disable¶
Under any input event (touch or keyboard)
gameObject.setInteractive().on('pointerdown', function() {
if (scene.scale.isFullscreen) {
scene.scale.stopFullscreen();
// Will leave full screen
} else {
scene.scale.startFullscreen();
// Will enter full screen
}
});
Fire one of these events
'fullscreenunsupported' : Tried to enter fullscreen mode, but it is unsupported by the browser.
'enterfullscreen' : Entered fullscreen mode successfully.
'fullscreenfailed' : Tried to enter fullscreen mode but failed.
Toggle¶
Under any input event (touch or keyboard)
gameObject.setInteractive().on('pointerdown', function() {
if (scene.scale.isFullscreen) {
// Will leave full screen
} else {
// Will enter full screen
}
scene.scale.toggleFullscreen();
});
Fire 'fullscreenunsupported' or 'enterfullscreen' event.
State¶
Is in full screen mode
var isFullScreen = scene.scale.isFullscreen;
Support full screen
var supported = Phaser.Device.Fullscreen.available;
Events¶
Enter full screen
scene.scale.on('enterfullscreen', function() {}, scope);
Enter full screen failed
scene.scale.on('fullscreenfailed', function(error) {}, scope);
Leave full screen
scene.scale.on('leavefullscreen', function() {}, scope);
Full screen unsupport
scene.scale.on('fullscreenunsupported', function() {}, scope);
Leave full screen
scene.scale.on('leavefullscreen', function() {}, scope);
With DOM game object¶
Set gameConfig.fullscreenTarget to parent id.
var config = {
parent: parentDivID,
fullscreenTarget: parentDivID
};
var game = new Phaser.Game(config);