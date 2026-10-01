Number bar
Introduction¶
A container with an icon, slider, text, and background.
Author: Rex
Game object
Live demos¶
Number bar
Color picker
Video player
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
Add number bar object
var numberBar = scene.rexUI.add.numberBar(config);
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
Add number bar object
var numberBar = scene.rexUI.add.numberBar(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { NumberBar } from "phaser4-rex-plugins/templates/ui/ui-components.js";
Add number bar object
var sizer = new NumberBar(scene, config);
scene.add.existing(sizer);
Add number bar object¶
var numberBar = scene.rexUI.add.numberBar({
// x: 0,
// y: 0,
// anchor: undefined,
// width: undefined,
// height: undefined,
// origin: 0.5
// originX:
// originY:
background: backgroundGameObject,
icon: iconGameObject,
iconMask: false,
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
gap: undefined,
easeValue: {
duration: 0,
ease: 'Linear'
},
}
text: textGameObject,
valuechangeCallback: function(newValue, oldValue, numberBar) {
// numberBar.text = Math.round(Phaser.Math.Linear(0, 100, newValue));
}
space: {
left: 0,
right: 0,
top: 0,
bottom: 0,
icon: 0,
slider: 0,
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
background : Game object of background, optional. This background game object will be resized to fit the size of numberBar.
icon : Game object of icon, optional.
iconMask : Set true to add a circle mask on icon game object.
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
slider.gap : Snap a value to nearest grid slice, using rounding.
undefined : Disable this feature.
slider.easeValue : Easing value when input is 'click'.
slider.easeValue.duration : Duration of value easing, default is 0 (no easing).
slider.easeValue.ease : Ease function, default is 'Linear'.
text : Game object of text, optional.
space : Pads spaces
space.left, space.right, space.top, space.bottom : Space of bounds
space.icon : Space between icon game object and text game object.
space.slider : Space between slider game object and text game object.
valuechangeCallback : callback function when value changed.
enable : Set false to disable controlling.
name : Set name of this game object.
draggable : Set true to drag top-most object.
sizerEvents : Set true to fire sizer events. Default value is false.
enableLayer :
false : Add child game objects into scene's display list. Default behavior.
true : Add child game objects into an internal layer game object. See also.
Custom class¶
Define class
class MyNumberBar extends RexPlugins.UI.NumberBar {
constructor(scene, config) {
super(scene, config);
// ...
scene.add.existing(this);
}
// ...
}
Create instance
var numberBar = new MyNumberBar(scene, config);
Layout children¶
Arrange position of all elements.
numberBar.layout();
See also - dirty
Get element¶
Get element
Background game object
var background = numberBar.getElement("background");
Icon game object
var icon = numberBar.getElement("icon");
Slider game object
Slider background
var sliderBackground = numberBar.getElement("slider.background");
Slider track
var sliderTrack = numberBar.getElement("slider.track");
Slider indicator
var sliderIndicator = numberBar.getElement("slider.indicator");
Slider thumb
var sliderThumb = numberBar.getElement("slider.thumb");
Text game object
var textObject = numberBar.getElement("text");
Get by name
var gameObject = numberBar.getElement("#" + name);
// var gameObject = numberBar.getElement('#' + name, recursive);
or
var gameObject = numberBar.getByName("#" + name);
// var gameObject = numberBar.getByName(name, recursive);
recursive : Set true to search all children recursively.
Enable¶
Get
var enable = numberBar.enable;
Set
numberBar.setEanble(enable);
or
numberBar.enable = enable;
Value¶
Change value will also change the position of slider thumb and width of slider indicator.
Get value
var value = numberBar.getValue(min, max); // value : min ~ max
or
var value = numberBar.getValue(); // value: 0 ~ 1
or
var value = numberBar.value; // value: 0 ~ 1
Set value
numberBar.setValue(value, min, max); // value: min ~ max
or
numberBar.setValue(value); // value: 0 ~ 1
or
numberBar.value = value; // value: 0 ~ 1
Increase value
numberBar.addValue(inc, min, max); // inc: min ~ max
or
numberBar.addValue(inc); // inc: 0 ~ 1
or
numberBar.value += inc; // inc: 0 ~ 1
Ease value¶
Ease value to
numberBar.easeValueTo(value, min, max);  // value: min ~ max
or
numberBar.easeValueTo(value);  // value: 0 ~ 1
Stop ease
numberBar.stopEaseValue();
Set ease duration
numberBar.setEaseValueDuration(duration);
Set ease function
numberBar.setEaseValueFunction(ease);
ease : Ease function.
Text¶
Get text string
var s = numberBar.text;
Set text string
numberBar.setText(s);
or
numberBar.text = s;
Other properties¶
See sizer object, base sizer object, container-lite.
Events¶
On value changed
numberBar.on('valuechange', function (newValue, oldValue, numberBar) {
// numberBar.text = Math.round(Phaser.Math.Linear(0, 100, newValue));
}, scope);
On input start
numberBar.on('inputstart', function(pointer) {
}, scope);
On input end
numberBar.on('inputend', function(pointer) {
}, scope);