Scroll bar
Introduction¶
A container with slider, two buttons, and background.
Author: Rex
Game object
Live demos¶
Scroll bar
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin(
"rexuiplugin",
"https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
"rexUI",
"rexUI"
);
Add scroll bar object
var scrollBar = scene.rexUI.add.scrollBar(config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import UIPlugin from "phaser4-rex-plugins/templates/ui/ui-plugin.js";
var config = {
// ...
plugins: {
scene: [
{
key: "rexUI",
plugin: UIPlugin,
mapping: "rexUI",
},
// ...
],
},
// ...
};
var game = new Phaser.Game(config);
Add scroll bar object
var scrollBar = scene.rexUI.add.scrollBar(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { ScrollBar } from "phaser4-rex-plugins/templates/ui/ui-components.js";
Add scroll bar object
var sizer = new ScrollBar(scene, config);
scene.add.existing(sizer);
Add scroll bar object¶
var scrollBar = scene.rexUI.add.scrollBar({
// x: 0,
// y: 0,
// anchor: undefined,
// width: undefined,
// height: undefined,
// origin: 0.5
// originX:
// originY:
orientation: 0,
background: backgroundGameObject,
slider: {
background: backgroundGameObject,
/*
background: {
radius: 0,
color: undefined, alpha: 1,
strokeColor: undefined, strokeAlpha: 1, strokeWidth: 2,
shape: undefined
}
*/
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
indicator: indicatorGameObject,
/*
indicator: {
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
input: 'drag',
tick: undefined,
easeValue: {
duration: 0,
ease: 'Linear'
},
},
buttons: {
top: topButtonGameObject,
bottom: bottomButtonGameObject,
left: leftButtonGameObject,
right: rightButtonGameObject,
step: 0.01,
}
valuechangeCallback: function(newValue, oldValue, scrollBar) {
// scrollBar.text = Math.round(Phaser.Math.Linear(0, 100, newValue));
}
space: {
left: 0,
right: 0,
top: 0,
bottom: 0,
item: 0
},
enable: true,
// name: '',
// draggable: false,
// sizerEvents: false,
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
orientation : Main orientation of the sizer.
'left-to-right', 'horizontal','h', 'x', or 0 : Arrange game objects from left ot right.
'top-to-bottom', 'vertical','v', 'y', or 1 : Arrange game objects from top to bottom.
background : Game object of background, optional. This background game object will be resized to fit the size of scrollBar.
slider : Slider game object which composed of
slider.width : Fixed width of slider, optional. Width of slider will be extended if this value is not set.
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
'pan', 'drag', or 0 : Control knob by panning/dragging thumb game object. Default setting.
'click', or 1 : Control slider by touching track game object.
'none', or -1 : Disable sider controlling.
slider.tick : Snap a value to nearest grid slice, using rounding.
undefined : Disable this feature.
slider.easeValue : Easing value when input is 'click'.
slider.easeValue.duration : Duration of value easing, default is 0 (no easing).
slider.easeValue.ease : Ease function, default is 'Linear'.
buttons : Press button to scroll content in each tick.
buttons.top, buttons.bottom : Top and bottom buttons.
buttons.left, buttons.right : Left and right buttons
buttons.step : Scrolling step in each tick. Default value is 0.01.
space : Pads spaces
space.left, space.right, space.top, space.bottom : Space of bounds
space.item : Space between 2 children game objects.
valuechangeCallback : callback function when value changed.
enable : Set false to disable controlling.
name : Set name of this game object.
draggable : Set true to drag top-most object.
sizerEvents : Set true to fire sizer events. Default value is false.
Custom class¶
Define class
class MyScrollBar extends RexPlugins.UI.ScrollBar {
constructor(scene, config) {
super(scene, config);
// ...
scene.add.existing(this);
}
// ...
}
Create instance
var scrollBar = new MyScrollBar(scene, config);
Layout children¶
Arrange position of all elements.
scrollBar.layout();
See also - dirty
Get element¶
Get element
Background game object
var background = scrollBar.getElement("background");
Slider game object
Slider background
var sliderBackground = scrollBar.getElement("slider.background");
Slider track
var sliderTrack = scrollBar.getElement("slider.track");
Slider indicator
var sliderIndicator = scrollBar.getElement("slider.indicator");
Slider thumb
var sliderThumb = scrollBar.getElement("slider.thumb");
Button game objects
var buttons = scrollBar.getElement("buttons");
buttons : Array of button game objects.
buttons[0] : Left or top button.
buttons[1] : Right or bottom button.
Get by name
var gameObject = scrollBar.getElement("#" + name);
// var gameObject = scrollBar.getElement('#' + name, recursive);
or
var gameObject = scrollBar.getByName("#" + name);
// var gameObject = scrollBar.getByName(name, recursive);
recursive : Set true to search all children recursively.
Enable¶
Get
var enable = scrollBar.enable;
Set
scrollBar.setEanble(enable);
or
scrollBar.enable = enable;
Value¶
Change value will also change the position of slider thumb and width of slider indicator.
Get value
var value = scrollBar.getValue(min, max); // value : min ~ max
or
var value = scrollBar.getValue(); // value: 0 ~ 1
or
var value = scrollBar.value; // value: 0 ~ 1
Set value
scrollBar.setValue(value, min, max); // value: min ~ max
or
scrollBar.setValue(value); // value: 0 ~ 1
or
scrollBar.value = value; // value: 0 ~ 1
Increase value
scrollBar.addValue(inc, min, max); // inc: min ~ max
or
scrollBar.addValue(inc); // inc: 0 ~ 1
or
scrollBar.value += inc; // inc: 0 ~ 1
Ease value¶
Ease value to
scrollBar.easeValueTo(value, min, max);  // value: min ~ max
or
scrollBar.easeValueTo(value);  // value: 0 ~ 1
Stop ease
scrollBar.stopEaseValue();
Set ease duration
scrollBar.setEaseValueDuration(duration);
Set ease function
scrollBar.setEaseValueFunction(ease);
ease : Ease function.
Tick¶
Set
scrollBar.setTick(tick);  // tick: 0~1
or
scrollBar.setTick(tick, min, max);  // tick: min~max
Get
var tick = scrollBar.tick;  // tick: 0~1
Other properties¶
See sizer object, base sizer object, container-lite.
Events¶
On value changed
scrollBar.on('valuechange',
function (newValue, oldValue, scrollBar) {
// scrollBar.text = Math.round(Phaser.Math.Linear(0, 100, newValue));
},
scope
);
On input start
scrollBar.on('inputstart', function(pointer) {
}, scope);
On input end
scrollBar.on('inputend', function(pointer) {
}, scope);