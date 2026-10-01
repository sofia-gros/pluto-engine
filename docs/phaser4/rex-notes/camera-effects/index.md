Effects
Introduction¶
Effects of camera.
Author: Phaser Team
Usage¶
Fade¶
Fades the Camera in, from the given color over the duration specified.
camera.fadeIn(duration);   // duration in ms
// camera.fadeIn(duration, red, green, blue, callback, context);
// red/green/blue: the value to fade the red/green/blue channel from. A value between 0 and 255.
callback , context : It will be invoked every frame for the duration of the effect.
function(camera, progress) {}
Fades the Camera out, to the given color over the duration specified.
camera.fadeOut(duration);   // duration in ms
// camera.fadeOut(duration, red, green, blue, callback, context);
callback , context : It will be invoked every frame for the duration of the effect.
function(camera, progress) {}
Fades the Camera, from the given color to transparent over the duration specified.
camera.fadeFrom(duration);   // duration in ms
// camera.fadeFrom(duration, red, green, blue, force, callback, context);
force : Force the effect to start immediately, even if already running.
callback , context : It will be invoked every frame for the duration of the effect.
function(camera, progress) {}
Fades the Camera, from transparent to the given color over the duration specified.
camera.fade(duration);   // duration in ms
// camera.fade(duration, red, green, blue, force, callback, context);
force : Force the effect to start immediately, even if already running.
callback , context : It will be invoked every frame for the duration of the effect.
function(camera, progress) {}
Events¶
camera.on('camerafadeincomplete', camera, fade);
camera.on('camerafadeoutcomplete', camera, fade);
Flash¶
camera.flash(duration);   // duration in ms
// camera.flash(duration, red, green, blue, force, callback, context);
callback , context : It will be invoked every frame for the duration of the effect.
function(camera, progress) {}
Events¶
camera.on('cameraflashstart', camera, flash, duration, red, green, blue);
camera.on('cameraflashcomplete', camera, flash);
Shake¶
camera.shake(duration);   // duration in ms
// camera.shake(duration, intensity, force, callback, context);  // callback: invoked when completed
callback , context : It will be invoked every frame for the duration of the effect.
function(camera, progress) {}
Events¶
camera.on('camerashakestart', camera, shake, duration, intensity);
camera.on('camerashakecomplete', camera, shake);
Pan¶
camera.pan(x, y, duration);   // duration in ms
// camera.pan(x, y, duration, ease, force, callback, context);
x, y : The destination x/y coordinate to scroll the center of the Camera viewport to.
callback , context : It will be invoked every frame for the duration of the effect.
function(camera, progress, x, y) {}
Events¶
camera.on('camerapanstart', camera, pan, duration, x, y);
camera.on('camerapancomplete', camera, pan);
Zoom¶
camera.zoomTo(zoomValue, duration);   // duration in ms
// camera.zoomTo(zoomValue, duration, ease, force, callback, context);
callback , context : It will be invoked every frame for the duration of the effect.
function(camera, progress, zoomValue) {}
Events¶
camera.on('camerazoomstart', camera, zoom, duration, zoomValue);
camera.on('camerazoomcomplete', camera, zoom);
Rotate to¶
camera.rotateTo(radians, shortestPath, duration);   // duration in ms
// camera.rotateTo(radians, shortestPath, duration, ease, force, callback, context);
callback , context : It will be invoked every frame for the duration of the effect.
function(camera, progress, angle) {}
Events¶
camera.on('camerarotatestart', camera, rotateTo, duration, angle);
camera.on('camerarotatecomplete', camera, rorotateTotate);
Mask¶
Add mask
camera.setMask(mask);
Clear mask
camera.clearMask();
More detail about mask