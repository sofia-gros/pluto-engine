Mask
Introduction¶
Apply mask on game object or camera.
Author: Phaser Team
Usage¶
WEBGL render mode¶
Private mask¶
Create mask game object, from graphics (Graphics), image (image, sprite, bitmap text, particles, text),or shader
var maskGameObject = new Phaser.GameObjects.Graphics(scene);
Enable filter list
gameObject.enableFilters();
Create mask object
var maskObject = gameObject
.filters.external.addMask(maskGameObject)
// .filters.external.addMask(maskGameObject, invert, viewCamera, 'world', scaleFactor)
// .filters.external.addMask(maskGameObject, invert, viewCamera, viewTransform, scaleFactor)
var maskObject = gameObject
.filters.internal.addMask(maskGameObject, undefined, undefined, 'local', undefined)
// .filters.internal.addMask(maskGameObject, invert, viewCamera, 'local', scaleFactor)
// .filters.internal.addMask(maskGameObject, invert, viewCamera, viewTransform, scaleFactor)
clear mask object
gameObject.filters.external.remove(maskObject)
gameObject.filters.internal.remove(maskObject)
Shared mask¶
Create mask game object, from graphics (Graphics), image (image, sprite, bitmap text, particles, text),or shader
var maskGameObject = new Phaser.GameObjects.Graphics(scene);
Create shared mask object
var maskObject = new Phaser.Filters.Mask(maskGameObject.scene.cameras.main, maskGameObject);
maskObject.ignoreDestroy = true;
Apply shared mask object to game object
gameObject
.enableFilters()
.filters.external.add(maskObject)
clear mask object
gameObject.filters.external.remove(maskObject)
scaleFactor and viewTransform¶
When scaleFactor is not 1, the mask texture size is changed, but the mask
game object's capture transform is not adjusted automatically. In this case,
do not pass 'local' or 'world' directly as viewTransform; create a
TransformMatrix that applies the matching scale, as shown below.
import { GameObjects as PhaserGameObjects } from 'phaser';
const TransformMatrix = PhaserGameObjects.Components.TransformMatrix;
var GetMaskFilterViewTransformByScaleFactor = function (maskGameObject, scaleFactor, maskType, viewTransform) {
// maskType: 'local' or 'world'
if (scaleFactor === 1) {
return maskType;
}
if (viewTransform === undefined) {
viewTransform = new TransformMatrix();
}
var scale = 1 / scaleFactor;
viewTransform.applyITRS(0, 0, 0, scale, scale);
if ((maskType === 'world') && maskGameObject.parentContainer) {
viewTransform.multiply(
maskGameObject.parentContainer.getWorldTransformMatrix(ParentTransform),
viewTransform
);
}
return viewTransform;
}
const ParentTransform = new TransformMatrix();
Stencil mask¶
Create stencil
// var maskGameObject = this.add.rectangle(x, y, width, height, fillColor);
var stencil = this.add.stencil(0, 0, maskGameObject, {
stencilInvert: true
});
or
// var maskGameObject0 = this.add.rectangle(x, y, width, height, fillColor);
// var maskGameObject1 = ...
var stencil = this.add.stencil(0, 0, [maskGameObject0, maskGameObject1, ...], {
stencilInvert: true
});
Add game object between stencil and stencilreference
var maskTarget = this.image(x, y, key, frame);
// More game objects ...
Create stencilreference, pair of stencil
var stencilreference = this.add.stencilreference(stencil, {
stencilInvert: true,
stencilLayerMode: 'subtractLayer'
}));
CANVAS render mode¶
Create mask game object, from Graphics game object
var maskGameObject = new Phaser.GameObjects.Graphics(scene);
Create shared mask object
var maskObject = maskGameObject.createGeometryMask();
Apply shared mask object to game object
gameObject.setMask(maskObject);
// gameObject.mask = maskObject;
clear mask object
gameObject.clearMask();
// gameObject.mask = null;