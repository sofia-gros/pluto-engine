Scroll-able panel
Introduction¶
A container with a panel, slider, and scroller.
Author: Rex
Game object
Live demos¶
Scroll-able panel + grid sizer
Scroll-able panel + table by fix-width sizer
Scroll-able panel + fix-width sizer
Scroll-able panel + built-in container
Container panel
Container child
Button click
Dropdown, scrollable list
Add child
Scroll to child
Drag item
Destroy
XY sliders
Min-width panel
Drag, resize panel
Single scroller
ScrollerX, scrollerY
Drag&drop items between panels :
With scroller
Without scroller
Snap
Swipe Carousel
Nested scroll-able panel
Typing on Label
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
Add scrollable-panel object
var panel = scene.rexUI.add.scrollablePanel(config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import UIPlugin from 'phaser4-rex-plugins/templates/ui/ui-plugin.js';
var config = {
// ...
plugins: {
scene: [{
key: 'rexUI',
plugin: UIPlugin,
mapping: 'rexUI'
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add scrollable-panel object
var panel = scene.rexUI.add.scrollablePanel(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { ScrollablePanel } from 'phaser4-rex-plugins/templates/ui/ui-components.js';
Add scrollable-panel object
var panel = new ScrollablePanel(scene, config);
scene.add.existing(panel);
Add scroll-able panel object¶
var panel = scene.rexUI.add.scrollablePanel({
// x: 0,
// y: 0,
// anchor: undefined,
// width: undefined,
// height: undefined,
// origin: 0.5
// originX:
// originY:
// scrollMode: 0,
// Elements
background: backgroundGameObject,
panel: {
child: panelGameObject,
mask: {
padding: 0, // or {left, right, top, bottom}
// maskType: 'children',
// updateMode: 0,
},
// enableLayer: false,
childOrigin0: true,
}.
slider: {
// background: sliderBackgroundGameObject,
track: trackGameObject,
/*
track: {
width: 1, height: 1,
radius: 0,
color: undefined, alpha: 1,
strokeColor: undefined, strokeAlpha: 1, strokeWidth: 2,
shape: undefined
}
*/
thumb: thumbGameObject,
/*
thumb: {
width: 1, height: 1,
radius: 0,
color: undefined, alpha: 1,
strokeColor: undefined, strokeAlpha: 1, strokeWidth: 2,
shape: undefined
}
*/
// input: 'drag',
// position: 'right',
// gap: undefined,
// hideUnscrollableSlider: false,
// disableUnscrollableDrag: false,
// adaptThumbSize: false,
// minThumbSize: undefined,
// buttons: {
//     top: topButtonGameObject,
//     bottom: bottomButtonGameObject,
//     left: leftButtonGameObject,
//     right: rightButtonGameObject,
//     step: 0.01,
// }
},
// sliderX: {...},
// sliderY: {...},
// scrollDetectionMode: 0,
// scroller: {
//     threshold: 10,
//     slidingDeceleration: 5000,
//     backDeceleration: 2000,
//     pointerOutRelease: true,
//     rectBoundsInteractive: true,
//     dragRate: 1,
// },
// scrollerX: {...},
// scrollerY: {...},
mouseWheelScroller: false,
// mouseWheelScroller: {
//     focus: true,
//     speed: 0.1
// },
// mouseWheelScrollerX: {...},
// mouseWheelScrollerY: {...},
clampChildOY: false,
// clampChildOX: false,
// snapStepY: undefined,
// snapStepX: undefined,
header: headerGameObject,
footer: footerGameObject,
space: {
left: 0,
right: 0,
top: 0,
bottom: 0,
panel: 0,
// panel: {
//    top: 0,
//    bottom: 0,
//    left: 0,
//    right: 0,
//},
slider: 0,
// slider: {
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
// },
// sliderX: 0,
// sliderY: 0,
header: 0,
footer: 0,
},
expand: {
header: true,
footer: true,
panel: true,
},
align: {
header: 'center',
footer: 'center',
panel: 'center',
},
// name: '',
// draggable: false,
// enableLayer: false,
});
x, y : Position of this object, it is valid when this object is the top object.
anchor : See anchor.
left, right, centerX, x, top, bottom, centerY, y, aspectRatio : Position based on visible window, which composed of
Percentage of visible width/height : 'p%', p: 0 ~ 100.
'left'(=0%), 'center'(=50%), 'right'(=100%)
'top'(=0%), 'center'(=50%), 'bottom'(=100%)
Offset : '+n', or '-n'.
width, height : Set size (invoke onResizeCallback) based on visible window, which composed of
Percentage of visible width/height : 'p%', p: 0 ~ 100.
Padding : '+n', or '-n'.
aspectRatio :
undefined, or false : Does not keep aspect ratio. Default behavior.
true : Use the current width and height as the aspect ratio.
A number : Use given number as the aspect ratio.
onResizeCallback : A default resize callback will be assigned interanlly.
width, height : Minimum width, minimum height.
origin, originX, originY : Set origin of this sizer. Default value is (0.5, 0.5).
scrollMode : Scroll panel vertically, or horizontally.
0, 'vertical', or 'v', 'y' : Scroll panel vertically. Default value.
1, 'horizontal', or 'h'. 'x' : Scroll panel horizontally.
2, or 'xy' : Two-sliders mode, scroll panel vertically and horizontally.
background : Game object of background, optional. This background game object will be resized to fit the size of scroll-able panel.
panel : Configuration of panel game object.
panel.child : Panel game object.
panel.mask : Configuration of panel's mask.
panel.mask.padding :
A number : Extra left/right/top/bottom padding spacing of this rectangle mask. Default value is 0.
A plain object {left, right, top, bottom}
panel.mask.maskType :
children or undefined : Applies the mask to each partially visible child.
layer : Applies one shared layer mask and only toggles child visibility.
stencil : Uses a stencil mask and only toggles child visibility.
panel.mask.updateMode : When to update mask
0, or 'update' : Apply mask only when scrolling. Default behavior.
1, or 'everyTick' : Apply mask every tick. Use this mode if children game objects of panel are moved after scrolling and still been masked.
false : No mask
panel.enableLayer :
false : Add children game objects into scene's display list. Default behavior.
true : Add children game objects into an internal layer game object. See also.
panel.childOrigin0 :
true : Change origin of penal game object to (0, 0). Default behavior for backward compatible.
false : Ignore this feature.
slider : Componments of slider, optional.
slider.background :
Game object of background, optional. This background game object will be resized to fit the size of slider.
A plain object to create round rectangle shape
{
radius: 0,
color: undefined, alpha: 1,
strokeColor: undefined, strokeAlpha: 1, strokeWidth: 2,
shape: undefined
}
slider.track :
Game object of track, optional. This track game object will be resized to fit the size of slider, with space.
A plain object to create round rectangle shape
{
width: 1, height: 1,
radius: 0,
color: undefined, alpha: 1,
strokeColor: undefined, strokeAlpha: 1, strokeWidth: 2,
shape: undefined
}
slider.indicator :
Game object of indicator, optional.
A plain object to create round rectangle shape
{
width: 1, height: 1,
radius: 0,
color: undefined, alpha: 1,
strokeColor: undefined, strokeAlpha: 1, strokeWidth: 2,
shape: undefined
}
slider.thumb :
Game object of thumb, optional.
A plain object to create round rectangle shape
{
width: 1, height: 1,
radius: 0,
color: undefined, alpha: 1,
strokeColor: undefined, strokeAlpha: 1, strokeWidth: 2,
shape: undefined
}
slider.input :
'pan', 'drag', or 0 : Control slider by panning/dragging thumb game object. Default setting.
'click', or 1 : Control slider by touching track game object.
'none', or -1 : Disable sider controlling.
slider.position : Position of this slider.
0, 'right', 'bottom' : Slider at right/bottom side. Default value.
1, 'left', 'top' : Slider at left/top side.
slider.hideUnscrollableSlider :
false : Slider is always visible no matter it is scrollable or not. Default behavior.
true : Set slider to invisible if it is unscrollable.
slider.disableUnscrollableDrag :
false : Scroller is always enale no matter it is scrollable or not. Default behavior.
true : Set scroller to disable if it is unscrollable.
slider.adaptThumbSize :
false : Don't adjust height/width of thumb. Default behavior.
true : Adjust height/width of thumb according to ratio of visible child.
Minimum height/width of thumb = slider.minThumbSize. If content is larger then a page.
Maximum height/width of thumb = height/width of slider.track. If content is less then a page.
slider.minThumbSize : Minimum height/width of thumb used in slider.adaptThumbSize mode.
slider.buttons : Press button to scroll content in each tick.
slider.buttons.top, slider.buttons.bottom : Top and bottom buttons.
slider.buttons.left, slider.buttons.right : Left and right buttons
slider.buttons.step : Scrolling step in each tick. Default value is 0.01.
Set to false to skip creating slider.
sliderX, sliderY : Componments of sliderX and sliderY, for two-sliders mode.
scrollDetectionMode :
0 : Dectct drag-scrolling, mouse-wheel-scrolling by game object's touch event. Default behavior.
1 : Dectct drag-scrolling, mouse-wheel-scrolling by rectangle bounds.
scroller : Configuration of scroller behavior.
scroller.threshold : Minimal movement to scroll. Set 0 to scroll immediately.
scroller.slidingDeceleration : Deceleration of slow down when dragging released.
Set false to disable it.
scroller.backDeceleration : Deceleration of pull back when out of bounds.
Set false to disable it.
scroller.pointerOutRelease : Set to true to release input control when pointer out of gameObject.
scroller.rectBoundsInteractive :
false : Detect scrolling by game object's touch input.
true : Detect scrolling by rectangle bounds of game object. Default behavior.
scroller.dragRate : Rate of dragging distance/dragging speed. Default value is 1.
Set to false to skip creating scroller.
scrollerX, scrollerY : Configuration of scrollerX, scrollerY behavior, for two-sliders mode.
mouseWheelScroller : Configuration of mouse-wheel-scroller behavior.
mouseWheelScroller.focus :
false, or 0 : Without checking if cursor is over game object or not.
true, or 1 : Cursor is inside the rectangle bounds of game object. Default behavior.
2 : Cursor is over game object.
mouseWheelScroller.speed : Scrolling speed, default value is 0.1.
Set to false to skip creating mouse-wheel-scroller. Default behavior.
mouseWheelScrollerX, mouseWheelScrollerY : Configuration of mouse-wheel-scrollerX, or mouse-wheel-scrollerY behavior, for two-sliders mode.
clampChildOY : Set true to clamp scrolling.
clampChildOX : Set true to clamp scrolling, for two-sliders mode.
snapStepY : The interval at which a value snaps to the nearest multiple.
undefined, or 0 : Disable snapping mode, default behavior.
snapStepX : The interval at which a value snaps to the nearest multiple, for two-sliders mode.
undefined, or 0 : Disable snapping mode, default behavior.
header : Game object of header, optional.
footer : Game object of footer, optional.
space : Pads spaces
space.left, space.right, space.top, space.bottom : Space of bounds.
space.panel :
A number: Space between panel object and slider object.
An object: Padding of panel object.
If scrollMode is 0 (vertical) :
space.panel.top, space.panel.bottom : Top, bottom padding space of panel object.
space.panel.right : Space between panel object and slider object.
If scrollMode is 1 (horizontal) :
space.panel.left, space.panel.right : Left, right padding space of panel object.
space.panel.bottom : Space between panel object and slider object.
If two-sliders mode (scrollMode is 2):
space.panel.top, space.panel.bottom, space.panel.left, space.panel.right : Top, bottom, left, right padding space of panel object.
space.slider :
0 : No space around slider.
space.slider.left, space.slider.right, space.slider.top, space.slider.bottom : Space around slider.
space.sliderX, space.sliderX : Space configuration of sliderX, sliderX, for two-sliders mode.
0 : No space around slider.
space.header : Space between header and panel.
space.footer : Space between footer and panel.
expand : Expand width or height of element
expand.header : Set true to expand width or height of header game object. Default value is true.
expand.footer : Set true to expand width or height of footer game object. Default value is true.
expand.panel : Set true to expand width or height of panel game object. Default value is true.
align : Align element
align.header
'center', or Phaser.Display.Align.CENTER : Align game object at center. Default value.
'left', or Phaser.Display.Align.LEFT_CENTER : Align game object at left-center.
'right', or Phaser.Display.Align.RIGHT_CENTER : Align game object at right-center.
'top', or Phaser.Display.Align.ALIGN.TOP_CENTER : Align game object at top-center.
'bottom', or Phaser.Display.Align.ALIGN.BOTTOM_CENTER : Align game object at bottom-center.
align.footer
'center', or Phaser.Display.Align.CENTER : Align game object at center. Default value.
'left', or Phaser.Display.Align.LEFT_CENTER : Align game object at left-center.
'right', or Phaser.Display.Align.RIGHT_CENTER : Align game object at right-center.
'top', or Phaser.Display.Align.ALIGN.TOP_CENTER : Align game object at top-center.
'bottom', or Phaser.Display.Align.ALIGN.BOTTOM_CENTER : Align game object at bottom-center.
align.panel
'center', or Phaser.Display.Align.CENTER : Align game object at center. Default value.
'left', or Phaser.Display.Align.LEFT_CENTER : Align game object at left-center.
'right', or Phaser.Display.Align.RIGHT_CENTER : Align game object at right-center.
'top', or Phaser.Display.Align.ALIGN.TOP_CENTER : Align game object at top-center.
'bottom', or Phaser.Display.Align.ALIGN.BOTTOM_CENTER : Align game object at bottom-center.
name : Set name of this game object.
draggable : Set true to drag top-most object.
sizerEvents : Set true to fire sizer events. Default value is false.
Scroll mode¶
If scrollMode parameter is not given :
Set scrollMode to 2, if configuration has sliderX, sliderY, or scrollerX, scrollerY parameters.
Set scrollMode to 0, if configuration has sliderY, or scrollerY parameters.
Set scrollMode to 1, if configuration has sliderX, or scrollerX parameters.
Child bounds¶
Scrollable panel will mask child if child's bounds (child.getBounds())  is across mask area.
Bitmaptext game object does not have getBounds method.
User can inject it by
const Components = Phaser.GameObjects.Components;
Phaser.Class.mixin(
Phaser.GameObjects.BitmapText,
[
Components.ComputedSize,
Components.GetBounds
]
);
Custom class¶
Define class
class MyPanel extends RexPlugins.UI.ScrollablePanel {
constructor(scene, config) {
super(scene, config);
// ...
scene.add.existing(this);
}
// ...
}
Create instance
var panel = new MyPanel(scene, config);
Layout children¶
Arrange position of all elements.
panel.layout();
See also - dirty
Scroll content¶
Set
panel.childOY = oy;
// panel.setChildOY(oy);
Set and clamp
panel.setChildOY(oy, true);
Add
panel.addChildOY(oy);
Add and clamp
panel.addChildOY(oy, true);
Get
var childOY = panel.childOY;
Top OY
var topOY = panel.topChildOY;
Bottom OY
var bottomOY = panel.bottomChildOY;
Is overflow (height of content is larger than display height)
var isOverflow = panel.isOverflow;
Scroll by percentage¶
Set
panel.t = t;  // t: 0~1
// panel.setT(t);
Set and clamp
panel.setT(t, true);
Get
var t = panel.t;
Scroll to top/bottom¶
Scroll to top
panel.scrollToTop();
Equal to panel.t = 0;
Scroll to bottom
panel.scrollToBottom();
Equal to panel.t = 1;
Scroll to child¶
panel.scrollToChild(child);
or
panel.scrollToChild(child, align);
or
panel.scrollToChild(child, align, duration, ease);
child : Child game object.
align :
undefined : Align child to top(left), or bottom(right) of panel. Default value.
'top', 'center', 'bottom' : Align child to top/center/bottom of panel.
'left', 'center', 'right' : Align child to left/center/right of panel.
duration :
undefined, or 0 : Scroll to child immediately. Default value.
A number : Scroll to child with easing.
ease :
undefined : Linear easeing. Default value.
A string : Easing mode.
Enable/disable scrolling¶
Slider
Set enable state
panel.setSliderEnable(enabled);
or
panel.sliderEnable = enabled;
Get enable state
var enable = panel.sliderEnable;
Scroller
Set enable state
panel.setScrollerEnable(enabled);
or
panel.scrollerEnable = enabled;
Get enable state
var enable = panel.scrollerEnable;
Mouse-Wheel-Scroller
Set enable state
panel.setMouseWheelScrollerEnable(enabled);
or
panel.mouseWheelScrollerEnable = enabled;
Get enable state
var enable = panel.mouseWheelScrollerEnable;
Event¶
Scroll
panel.on('scroll', function(panel) {
// ...
})
Slider
Slider drag start
panel.getElement('slider').on('inputstart', function(panel) {
// ...
})
Slider drag end
panel.getElement('slider').on('inputend', function(panel) {
// ...
})
Scroller
Scroller drag start
panel.getElement('scroller').on('dragstart', function(panel) {
// ...
})
Scroller drag end
panel.getElement('scroller').on('dragend', function(panel) {
// ...
})
Other properties¶
See sizer object, base sizer object, container-lite.
Get element¶
Get element
Background game object
var background = panel.getElement('background');
Child-panel game object
var childPanel = panel.getElement('panel');
Child-panel mask game object, which is a graphics game object.
var maskGameObject = panel.getElement('mask');
Layer of panel, assigned at config panel.mask.layer.
var layer = panel.getElement('panelLayer');
Header game object
var childPanel = panel.getElement('header');
Footer game object
var childPanel = panel.getElement('footer');
Slider
Slider top
var slider = panel.getElement('slider');
Track
var track = panel.getElement('slider.track');
Thumb
var thumb = panel.getElement('slider.thumb');
Scroller
var scroller = panel.getElement('scroller');
Scrollable-block, registering scroller and children-interactive on it.
var scrollableBlock = panel.getElement('scrollableBlock');
Get by name
var gameObject = panel.getElement('#' + name);
// var gameObject = panel.getElement('#' + name, recursive);
or
var gameObject = panel.getByName(name);
// var gameObject = panel.getByName(name, recursive);
recursive : Set true to search all children recursively.
Input events¶
Two possible solution to register input events to children of scrollable panel.
Individual input events¶
When scene.input.topOnly is true (default value), input events of children elements will block the drag-scrolling of scrollable panel. (Assmue that the children elememts are above scrollable panel)
Set scene.input.topOnly to false to enable drag-scrolling and input events of children elememts both.
Or Set scrollDetectionMode: 1 in config of constructor, to using rectangle-bounds input detection.
Test if pointer is inside the mask of panel via panel.isInTouching('mask'), during input events' callback.
To recognize pointer-down and dragging-start, use press's pressstart event.
Set children interactive¶
Applies click, tap, press, swipe behaviors on this scrollable panel, to detect input events of children.
panel.setChildrenInteractive({
// targetMode: 'parent',
targets: targetSizers,
// dropZone: false,
// click: {mode: 'release', clickInterval: 100},
// over: undefined,
// press: {time: 251, threshold: 9},
// tap: {time: 250, tapInterval: 200, threshold: 9, tapOffset: 10,
//       taps: undefined, minTaps: undefined, maxTaps: undefined,},
// swipe: {threshold: 10, velocityThreshold: 1000, dir: '8dir'},
// inputEventPrefix: 'child.',
})
targetMode :
'parent' : targetSizers is an array of hit-targrts' parentSizers. Will run hit-test on parentSizers first, then run hit-test on children of parentSizer. Default behavior.
'direct' : targetSizers is an array of hit-targrts. Will run hit-test directly on these hit-targrts.
targetSizers : Array of hit-targrts' parentSizers, or array of hit-targrts. See targetMode parameter.
dropZone :
true : Enable drop Zone on scrollable area.
false : Do nothing.
See Base-sizer/Set children interactive
Events¶
See Base-sizer/Set children interactive/Events
Steps of building a scrollable panel¶
Build child panel from bottom to top
Child panel might be composed of sizers (sizer/fix-width sizer/grid sizer)
Return child sizer from method
Build scrollable panel
Add interactive events