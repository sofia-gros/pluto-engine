Overview
Install ui plugins¶
Install from minify file¶
Download minify file (link).
Install ui plugin in preload stage
scene.load.scenePlugin({
key: 'rexuiplugin',
url: filePath,
sceneKey: 'rexUI'
});
key : Must be 'rexuiplugin'
Install from npm package¶
Install rex plugins
npm i phaser4-rex-plugins
Install ui plugin in configuration of game
import RexUIPlugin from 'phaser4-rex-plugins/templates/ui/ui-plugin.js';
var config = {
// ...
plugins: {
scene: [{
key: 'rexUI',
plugin: RexUIPlugin,
mapping: 'rexUI'
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Using typescript declaration file¶
import 'phaser';
import RexUIPlugin from 'phaser4-rex-plugins/templates/ui/ui-plugin.js';
declare module 'phaser' {
interface Scene {
rexUI: RexUIPlugin;
}
}
or
import RexUIPlugin from 'phaser4-rex-plugins/templates/ui/ui-plugin.js';
class Game extends Phaser.Scene {
rexUI: RexUIPlugin;  // Declare scene property 'rexUI' as RexUIPlugin type
create() {
var sizer = this.rexUI.add.sizer({
// ...
})
}
}
var game = new Phaser.Game({
scene: Game,
// ...
plugins: {
scene: [{
key: 'rexUI',
plugin: RexUIPlugin,
mapping: 'rexUI'
},
// ...
]
}
// ...
});
'phaser4-rex-plugins/templates/ui/ui-plugin' : Factories of rexUI components.
'phaser4-rex-plugins/templates/ui/ui-components' : Class of rexUI components.
import { Sizer } from 'phaser4-rex-plugins/templates/ui/ui-components';
See this example
List of ui plugins¶
UI components¶
Badge label: A container with badges above a main item.
Buttons: A container with a group of buttons.
Color componets: Edit color value by RGB, or HSV input fields.
Color input: Color number or color string input field.
Color picker: Pick color value from H and SV palettes.
Confirm action button: Create a modal confirm dialog temporary, invoke callback after clicking button.
Confirm dialog: Using json style to create confirm dialog.
Dialog: A container with a title, content, buttons and background.
Drop down list: A label can open a drop-down list panel.
Exp bar: Disply experience bar on NameValueLabel.
File selector button: A transparent file chooser button above a Label.
Fix-width-buttons: A container with a group of fix-width buttons.
Fix-width-sizer: Layout children game objects into lines.
Folder: A container with a title, foldable child, and background.
Grid-buttons: A container with a group of buttons in grids.
Grid-sizer: Layout children game objects in grids.
Grid-table: A container with a grid table, slider, and scroller.
Holy grail: Layout elements in Holy grail style.
Knob: A knob button based on circular progress.
Label: A container with an icon, text, and background.
Menu: A container with buttons and sub-menu.
Name-input dialog: Enter first name and last name via a dialog.
Name-value label: A container with name text, value text in a row, with a horizontal line progress bar, and an icon, background.
Image input label: A container with a canvas icon, text, and background. Click icon to popup a (image) file chooser dialog, display selected image on canvas.
Number-bar: A container with an icon, slider, text, and background.
Overlap sizer: Layout children game objects overlapped.
Pages: A container with pages, only current page is visible.
Perspective card: A container with front and back faces.
Scroll-able panel: A container with a panel, slider, and scroller.
Simple drop down list: Using plain object to create drop down list.
Simple label: Using json style to create label.
Simple title label: Using json style to create title label.
Simple text box: Using json style to create text box.
Sizer: Layout children game objects.
Slider: A container with a track, indicator, thumb and background.
Split panels: A container with left(top) panel, right(bottom) panel, splitter, and background. Drag splitter to resize with left(top) panel, right(bottom) panel.
Tab-pages: A container with tabs and pages, only current page is visible.
Tabs: A container with 4 groups of buttons around a center panel.
TextArea: A container with a text, slider, and scroller.
TextAreaInput: A container with a canvasInput, and slider.
Textbox: A container with an icon, (typing and paging) text, and background.
Title label: A container with title, text in two rows, and an icon, background.
Toast: Show text message for a short while.
Toast queue: Queue messages for a short while.
Trees: A container with trees and leaf-nodes.
Tweaker: Fine-tuning properties of target object.
Scroll-able table
There are 3 kinds of scroll-able tables :
Grid-table only creates visible objects. It is suitable for large table.
Grid-sizer adds all objects. Put this grid-sizer into scroll-able panel to have a scroll-able table.
Fixwidth-sizer adds all objects. Put this fixwidth-sizer into scroll-able panel to have a scroll-able table.
Basic container¶
ContainerLite: Control the position and angle of children game objects.
var container = scene.rexUI.add.container(x, y);
or
class MyContainer extends RexPlugins.UI.Container {
constructor(scene, x, y, width, height, children) {
super(scene, x, y, width, height, children);
// ...
scene.add.existing(this);
}
// ...
}
Background objects¶
Round-rectangle: Round rectangle shape.
var shape = scene.rexUI.add.roundRectangle(x, y, width, height, radius, fillColor);
or
class MyRoundRectangle extends RexPlugins.UI.RoundRectangle {
constructor(scene, x, y, width, height, radius, fillColor, fillAlpha) {
super(scene, x, y, width, height, radius, fillColor, fillAlpha);
// ...
scene.add.existing(this);
}
// ...
}
Nine-patch: Stretchable imaage.
var ninePatch = scene.rexUI.add.ninePatch(x, y, width, height, key, columns, rows, config);
var ninePatch = scene.rexUI.add.ninePatch2(x, y, width, height, key, columns, rows, config);
or
class MyNinePatch extends RexPlugins.UI.NinePatch {
constructor(scene, x, y, width, height, key, columns, rows, config) {
super(scene, x, y, width, height, key, columns, rows, config);
// ...
scene.add.existing(this);
}
// ...
}
class MyNinePatch extends RexPlugins.UI.NinePatch2 {
constructor(scene, x, y, width, height, key, columns, rows, config) {
super(scene, x, y, width, height, key, columns, rows, config);
// ...
scene.add.existing(this);
}
// ...
}
Quad shape: Quad shape, offsets can be given on four vertices, and additional points can be added on the four sides.
var quad = scene.rexUI.add.quadShapes(x, y, width, height, fillColor, fillAlpha);
or
class MyQuadShape extends RexPlugins.UI.QuadShape {
constructor(scene, x, y, width, height, fillColor, fillAlpha) {
super(scene, x, y, width, height, fillColor, fillAlpha);
// ...
scene.add.existing(this);
}
// ...
}
Custom shapes: Custom shapes on shape.
var customShapes = scene.rexUI.add.customShapes(x, y, width, height, config);
or
class MyCustomShapes extends RexPlugins.UI.CustomShapes {
constructor(scene, x, y, width, height, config) {
super(scene, x, y, width, height, config);
// ...
scene.add.existing(this);
}
// ...
}
Custom progress: Custom progress on shape.
var customProgress = scene.rexUI.add.customProgress(x, y, width, height, config);
or
class MyCustomProgress extends RexPlugins.UI.CustomProgress {
constructor(scene, x, y, width, height, config) {
super(scene, x, y, width, height, config);
// ...
scene.add.existing(this);
}
// ...
}
Canvas-round-rectangle: Round rectangle on canvas.
var shape = scene.rexUI.add.roundRectangleCanvas(x, y, width, height, radiusConfig, fillStyle, strokeStyle, lineWidth, fillColor2, isHorizontalGradient);
or
class MyRoundRectangleCanvas extends RexPlugins.UI.RoundRectangleCanvas {
constructor(scene, x, y, width, height, radiusConfig, fillStyle, strokeStyle, lineWidth, fillColor2, isHorizontalGradient) {
super(scene, x, y, width, height, radiusConfig, fillStyle, strokeStyle, lineWidth, fillColor2, isHorizontalGradient);
// ...
scene.add.existing(this);
}
// ...
}
Cover: Rectangle shape covered full window, and block all touch events.
var shape = scene.rexUI.add.cover(config);
or
class MyCover extends RexPlugins.UI.Cover {
constructor(scene, config) {
super(scene, config);
// ...
scene.add.existing(this);
}
// ...
}
Canvas/Shape objects¶
Canvas: Drawing on canvas.
var canvas = scene.rexUI.add.canvas(x, y, width, height);
// var canvas = scene.rexUI.add.canvas(x, y, width, height);
or
class MyCanvas extends RexPlugins.UI.Canvas {
constructor(scene, x, y, width, height) {
super(scene, x, y, width, height);
// ...
scene.add.existing(this);
}
// ...
}
Circle mask image: Load a texture, then apply a circle mask.
var image = scene.rexUI.add.circleMaskImage(x, y, key, frame, config);
or
class MyImage extends RexPlugins.UI.CircleMaskImage {
constructor(scene, x, y, key, frame, config) {
super(scene, x, y, key, frame, config);
// ...
scene.add.existing(this);
}
// ...
}
Alpha mask image: Load a texture, then apply an alpha mask from another texture.
var image = scene.rexUI.add.alphaMaskImage(x, y, key, frame, config);
or
class MyImage extends RexPlugins.UI.AlphaMaskImage {
constructor(scene, x, y, key, frame, config) {
super(scene, x, y, key, frame, config);
// ...
scene.add.existing(this);
}
// ...
}
Circular progress shape: Circular progress bar shape.
var circularProgress = scene.rexUI.add.circularProgress(x, y, radius, barColor, value, config);
or
class MyCircularProgress extends RexPlugins.UI.CircularProgress {
constructor(scene, x, y, radius, barColor, value, config) {
super(scene, x, y, radius, barColor, value, config);
// ...
scene.add.existing(this);
}
// ...
}
Circular progress canvas: Circular progress bar on canvas
var circularProgress = scene.rexUI.add.circularProgressCanvas(x, y, radius, barColor, value, config);
or
class MyCircularProgress extends RexPlugins.UI.CircularProgressCanvas {
constructor(scene, x, y, radius, barColor, value, config) {
super(scene, x, y, radius, barColor, value, config);
// ...
scene.add.existing(this);
}
// ...
}
Line progress shape: Horizontal line progress bar shape.
var lineProgress = scene.rexUI.add.lineProgress(x, y, width, height, barColor, value, config);
or
class MyLineProgress extends RexPlugins.UI.LinerProgress {
constructor(scene, x, y, width, height, barColor, value, config) {
super(scene, x, y, width, height, barColor, value, config);
// ...
scene.add.existing(this);
}
// ...
}
Round rectangle progress shape: Horizontal or vertical round rectangle progress bar shape.
var roundRectangleProgress = scene.rexUI.add.roundrectangleProgress(x, y, width, height, radius, barColor, value, config);
or
class MyRoundRectangleProgress extends RexPlugins.UI.RoundRectangleProgress {
constructor(scene, x, y, width, height, radius, barColor, value, config) {
super(scene, x, y, width, height, radius, barColor, value, config);
// ...
scene.add.existing(this);
}
// ...
}
Line progress canvas: Horizontal line progress bar filled with gradient color on canvas.
var lineProgress = scene.rexUI.add.lineProgressCanvas(x, y, width, height, barColor, value, config);
or
class MyLineProgress extends RexPlugins.UI.LinerProgressCanvas {
constructor(scene, x, y, width, height, barColor, value, config) {
super(scene, x, y, width, height, barColor, value, config);
// ...
scene.add.existing(this);
}
// ...
}
Checkbox: Checkbox input with drawing checker path animation.
var checkbox = scene.rexUI.add.checkbox(x, y, width, height, color, config);
or
class MyCheckbox extends RexPlugins.UI.Checkbox {
constructor(scene, x, y, width, height, color, config) {
super(scene, x, y, width, height, color, config);
// ...
scene.add.existing(this);
}
// ...
}
Toggle switch: Toggle-switch input.
var toggleSwitch = scene.rexUI.add.toggleSwitch(x, y, width, height, color, config);
or
class MyToggleSwitch extends RexPlugins.UI.ToggleSwitch {
constructor(scene, x, y, width, height, color, config) {
super(scene, x, y, width, height, color, config);
// ...
scene.add.existing(this);
}
// ...
}
Triangle: Trangle shape inside a rectangle bounds.
var triangle = scene.rexUI.add.triangle(x, y, width, height, fillColor, fillAlpha);
or
class MyTriangle extends RexPlugins.UI.Triangle {
constructor(scene, x, y, width, height, fillColor, fillAlpha) {
super(scene, x, y, width, height, fillColor, fillAlpha);
// ...
scene.add.existing(this);
}
// ...
}
AIO-spinner
var spinner = scene.rexUI.add.aioSpinner(config);
or
class MySpinner extends RexPlugins.UI.AIOSpinner {
constructor(scene, configa) {
super(scene, configa);
// ...
scene.add.existing(this);
}
// ...
}
Chart: Draw chart on canvas.
Colored text objects¶
BBCode text: Drawing text with BBCode protocol.
var txt = scene.rexUI.add.BBCodeText(x, y, text, style);
or
class MyText extends RexPlugins.UI.BBCodeText {
constructor(scene, x, y, text, style) {
super(scene, x, y, text, style);
// ...
scene.add.existing(this);
}
// ...
}
Tag text: Displays text with multi-color, font face, or font size with tags.
var txt = scene.rexUI.add.tagText(x, y, text, style);
or
class MyText extends RexPlugins.UI.TagText {
constructor(scene, x, y, text, style) {
super(scene, x, y, text, style);
// ...
scene.add.existing(this);
}
// ...
}
Dynamic text: Control position, angle of each character drawn on a canvas.
var txt = scene.rexUI.add.dynamicText(config);
or
class MyText extends RexPlugins.UI.DynamicText {
constructor(scene, config) {
super(scene, config);
// ...
scene.add.existing(this);
}
// ...
}
Text player: Typing characters on dynamic text, waiting click or key enter, play sound effect or backgroun music.
var txt = scene.rexUI.add.textPlayer(config);
or
class MyText extends RexPlugins.UI.TextPlayer {
constructor(scene, config) {
super(scene, config);
// ...
scene.add.existing(this);
}
// ...
}
Canvas input: An invisible Input DOM element to  receive character input and display on DynamicText.
var txt = scene.rexUI.add.canvasInput(config);
or
class MyText extends RexPlugins.UI.CanvasInput {
constructor(scene, config) {
super(scene, config);
// ...
scene.add.existing(this);
}
// ...
}
Behaviors of text¶
Hidden text edit: Create an invisible Input DOM element to edit string content.
var hiddenEdit = this.rexUI.add.hiddenEdit(textObject, config);
textObject : text, bbocodetext, tagtext, or label.
Text edit: Create an input text object above a text object to edit string content.
scene.rexUI.edit(textObject, config);
// scene.rexUI.edit(textObject, config, onClose);
Wrap-expand text
var textObject = scene.rexUI.wrapExpandText(textObject);
// var textObject = scene.rexUI.wrapExpandText(textObject, minWidth);
textObject :
Text object, bbcode text object, tag text object,
Bitmap text object
Dynamic text object, With default wrap configuration, ex:
{
lineHeight: 24,
padding: {bottom: 12}
}
Font-size-expand text
var textObject = scene.rexUI.fontSizeExpandText(textObject);
or
var textObject = scene.rexUI.fontSizeExpandText(textObject, {
fitHeight: true
});
textObject :
Text object, bbcode text object, tag text object, bitmap text game object
fitHeight :
false : Set font size to fit width only. Default behavior.
true : Set font size to fit width and height.
Set font-size to fit width
var textObject = scene.rexUI.setFontSizeFitToWidth(textObject, width);
textObject :
Text object, bbcode text object, tag text object, bitmap text game object
Text typing
var textTyping = scene.rexUI.add.textTyping(textObject, config);
Text page
var textPage = scene.rexUI.add.textPage(textObject, config);
Scaled image¶
Image box: Keep aspect ratio of image game object after scale-down resizing.
var image = scene.rexUI.add.imageBox(x, y, texture, frame, config);
or
class MyImageBox extends RexPlugins.UI.ImageBox {
constructor(scene, x, y, texture, frame, config) {
super(scene, x, y, texture, frame, config);
// ...
scene.add.existing(this);
}
// ...
}
Lazy-load Image box: Lazy-load image with spinner, then show scaled image, based on image-box game object.
var image = scene.rexUI.add.lazyLoadImageBox(config);
or
class MyLazyLoadImageBox extends RexPlugins.UI.LazyLoadImageBox {
constructor(scene, config) {
super(scene, config);
// ...
scene.add.existing(this);
}
// ...
}
Transition image¶
Transition image: Transit texture to another one.
var image = scene.rexUI.add.transitionImage(x, y, texture, frame, config);
or
class MyTransitionImage extends RexPlugins.UI.TransitionImage {
constructor(scene, x, y, texture, frame, config) {
super(scene, x, y, texture, frame, config);
// ...
scene.add.existing(this);
}
// ...
}
Transition image pack: Transit texture to another one, with some pre-build effects, extended from TransitionImage.
var image = scene.rexUI.add.transitionImagePack(x, y, texture, frame, config);
or
class MyTransitionImagePack extends RexPlugins.UI.TransitionImagePack {
constructor(scene, x, y, texture, frame, config) {
super(scene, x, y, texture, frame, config);
// ...
scene.add.existing(this);
}
// ...
}
Dom game objects¶
Input text: Input DOM element.
var inputText = scene.rexUI.add.inputText(config);
or
class MyInputText extends RexPlugins.UI.InputText {
constructor(scene, config) {
super(scene, config);
// ...
scene.add.existing(this);
}
// ...
}
File chooser: Create a transparent file chooser button (<input type="file">).
var fileChooser = scene.rexUI.add.fileChooser(config);
or
class MyFileChooser extends RexPlugins.UI.FileChooser {
constructor(scene, config) {
super(scene, config);
// ...
scene.add.existing(this);
}
// ...
}
File drop zone: Create a div element for dropping file(s).
var fileDropZone = scene.rexUI.add.fileDropZone(config);
or
class MyFileDropZpne extends RexPlugins.UI.FileDropZpne {
constructor(scene, config) {
super(scene, config);
// ...
scene.add.existing(this);
}
// ...
}
Layer manager¶
Layer manager : A dictionary to store Layer game objects.
var layerManager = scene.rexUI.add.layerManager({
// layers: ['layer0', 'layer1', ...]
});
// layerManager.addToLayer(name, gameObject);
Touch input¶
Click: Fires 'click' event when touch releasd after pressed.
var click = scene.rexUI.add.click(gameObject, config);
or
var click = new RexPlugins.UI.Click(gameObject, config);
Click-Outside: Fires 'clickoutside' event when pointer-down or pointer-up outside of game object.
var clickOutside = scene.rexUI.add.clickOutside(gameObject, config);
or
var clickOutside = new RexPlugins.UI.ClickOutside(gameObject, config);
In touching: Fires 'intouch' event every tick when pressing on a game object.
var inTouching = scene.rexUI.add.inTouching(gameObject, config);
or
var inTouching = new RexPlugins.UI.inTouching(gameObject, config);
Tap: Get tap/multi-taps events of a game object.
var tap = scene.rexUI.add.tap(gameObject, config);
or
var tap = new RexPlugins.UI.Tap(gameObject, config);
Press: Get press events of a game object.
var press = scene.rexUI.add.press(gameObject, config);
or
var press = new RexPlugins.UI.Press(gameObject, config);
Swipe: Get swipe events of a game object.
var swipe = scene.rexUI.add.swipe(gameObject, config);
or
var swipe = new RexPlugins.UI.Swipe(gameObject, config);
Pan: Get pan events of a game object.
var pan = scene.rexUI.add.pan(gameObject, config);
or
var pan = new RexPlugins.UI.Pan(gameObject, config);
Pinch: Get scale factor from 2 dragging touch pointers.
var pinch = scene.rexUI.add.pinch(config);
or
var pinch = new RexPlugins.UI.Pinch(config);
Rotste: Get spin angle from 2 dragging touch pointers.
var rotate = scene.rexUI.add.rotate(config);
or
var rotate = new RexPlugins.UI.Rotate(config);
Touch event stop: Stop touch events propagation.
var touchEventStop = scene.rexUI.add.touchEventStop(gameObject, config);
or
var touchEventStop = new RexPlugins.UI.TouchEventStop(gameObject, config);
Behaviors¶
Confirm action : Create a modal confirm dialog temporary, invoke callback after clicking button.
scene.rexUI.confirmAction(scene, config)
.then(function(data){ })
Confirm action promise : Confirm action wrapped into promise.
scene.rexUI.confirmActionPromise(scene, config)
.then(function(data){ })
Modal promise : Modal behavior wrapped into promise.
scene.rexUI.modalPromise(gameObject, config)
.then(function(closeEventData){ })
Close modal dialog:
scene.rexUI.modalClose(gameObject);
// scene.rexUI.modalClose(gameObject, closeEventData);
or
gameObject.emit('modal.requestClose');
// gameObject.emit('modal.requestClose', closeEventData);
Fire 'modal.requestClose' event on game object, which will invoke modal.requestClose() method. After closing dialog, resolve part of promise will be triggered.
Flip: Flip game object to another face by scaling width/height.
var flip = scene.rexUI.add.flip(gameObject, config);
or
var flip = new RexPlugins.UI.Flip(gameObject, config);
Fade in, fade out destroy
scene.rexUI.fadeIn(gameObject, duration);
// scene.rexUI.fadeIn(gameObject, duration, alpha);
scene.rexUI.fadeOutDestroy(gameObject, duration);
Ease-move to, ease-move from
scene.rexUI.easeMoveTo(gameObject, duration, x, y);
// scene.rexUI.easeMoveTo(gameObject, duration, x, y, ease);
scene.rexUI.easeMoveFrom(gameObject, duration, x, y);
// scene.rexUI.easeMoveFrom(gameObject, duration, x, y, ease);
Shake
scene.rexUI.shake(gameObject, config);
Perspective: Snapshot children of containerlite, to a perspective render texture.
var perspective = scene.rexUI.add.perspective(gameObject, config);
or
var perspective = new RexPlugins.UI.Perspective(gameObject, config);
Skew: Snapshot children of containerlite, to a skew render texture.
var skew = scene.rexUI.add.skew(gameObject, config);
or
var skew = new RexPlugins.UI.Skew(gameObject, config);
Fullscreen button: A behavior attached to a game object that toggles fullscreen mode when the object is clicked.
scene.rexUI.add.fullscreenButton(gameObject, config);
or
new FullscreenButton(gameObject, config);
Helper methods¶
Get parent¶
Get parent sizer
var parentSizer = scene.rexUI.getParentSizer(gameObject);
gameObject : Any game object added to sizer.
Get ancestor sizer matched given name
var parentSizer = scene.rexUI.getParentSizer(gameObject, name);
gameObject : Any game object added to sizer.
name : Name string.
Get topmost sizer
var topmostSizer = scene.rexUI.getTopmostSizer(gameObject);
gameObject : Any game object added to sizer.
Remove from parent¶
scene.rexUI.removeFromParent(gameObject);
Show/hide¶
Show
scene.rexUI.show(gameObject);
scene.rexUI.getTopmostSizer(gameObject).layout();
Hide
scene.rexUI.hide(gameObject);
scene.rexUI.getTopmostSizer(gameObject).layout();
Is shown
var isShown = scene.rexUI.isShown(gameObject);
Is pointer in bounds¶
var isInBounds = scene.rexUI.isInTouching(gameObject);
// var isInBounds = scene.rexUI.isInTouching(gameObject, pointer);
Event promise¶
Get event promise
var promise = scene.rexUI.waitEvent(eventEmitter, eventName)
.then(function() {
})
eventEmitter : Any kind of event emitter. for example, game object, or tween task, or scene event
Get complete event promise
var promise = scene.rexUI.waitComplete(eventEmitter)
.then(function() {
})
eventEmitter : Event emitter which will fire 'complete' event, for example, tween task.
Delay time promise
var promise = scene.rexUI.delayPromise(time)
.then(function() {
})
View port¶
View port is a rectangle of current visible area.
var viewport = scene.rexUI.viewport;
Which will be changed after resizing
scene.scale.on('resize', function() {
var viewport = scene.rexUI.viewport;
/*
sizer
.setPosition(viewport.centerX, viewport.centerY)
.setMinSize(viewport.width, viewport.height)
.layout();
*/
});
Demos¶
Dialog
Yes/No
Choice
Pop-up
Text input
Text edit
Hidden text edit
Canvas input
Menu
Text-box
Text-area
Number bar
Grid table
Tabs
Tabs-tables
Scroll-able panel
Pages
Fix-width sizer
Chart
Video player
Anchor
Round-rectangle