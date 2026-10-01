Buttons
Introduction¶
A container with a group of buttons.
Author: Rex
Game object
Live demos¶
Buttons with header and footer
Expand
Space
Checkboxes/radio
CustomProgress background
Popup each button
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
Add buttons object
var buttons = scene.rexUI.add.buttons(config);
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
Add buttons object
var buttons = scene.rexUI.add.buttons(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { Buttons } from 'phaser4-rex-plugins/templates/ui/ui-components.js';
Add buttons object
var buttons = new Buttons(scene, config);
scene.add.existing(buttons);
Add Buttons object¶
var buttons = scene.rexUI.add.buttons({
// x: 0,
// y: 0,
// anchor: undefined,
// width: undefined,
// height: undefined,
// origin: 0.5
// originX:
// originY:
orientation: 0,
// rtl: false,
// buttonsType: undefined,
// Elements
// background: backgroundGameObject,
buttons: [
buttonGameObject,
buttonGameObject,
// ...
],
expand: false,
align: undefined,
click: {
mode: 'pointerup',
clickInterval: 100
},
// space: 0,   // deprecated
// space: { left: 0, right:0, top:0, bottom:0, item:0 },
// name: '',
// draggable: false,
// sizerEvents: false,
// enableLayer: false,
// eventEmitter: this,
// groupName: undefined,
// setValueCallback: undefined,  // or setButtonStateCallback: undefined
// setValueCallbackScope: undefined  // or setButtonStateCallbackScope: undefined
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
orientation : Main orientation of button game objects.
'left-to-right', 'horizontal','h', 'x', or 0 : Arrange button game objects from left ot right.
'top-to-bottom', 'vertical','v', 'y', or 1 : Arrange button game objects from top to bottom.
rtl :
true : Layout children from right to left.
false : Layout children from left to right. Default behavior.
buttonsType : Type/behavior of these buttons.
undefined : No extra behavior, default value.
'checkboxes' : Set these buttons to checkboxes.
'radio' : Set these buttons to radio.
background : Game object of background, optional. This background game object will be resized to fit the size of grid table.
buttons : Array of button game objects, or Space (scene.rexUI.add.space()).
expand : Set true to expand width, or height of buton game objects.
align : Note: Add Space (scene.rexUI.add.space()) into buttons parameter to have more flexible alignment style. Alignment of these button game objects. Only valid when expand is false.
undefined, or 'left', or 'top' : Align game objects at left, or top.
'center' : Align game objects at center.
'right', or 'bottom' : Align game objects at right, or bottom.
click: Configuration of button clicking.
click.mode :
'pointerdown', 'press', or 0 : Fire 'click' event when touch pressed.
'pointerup', 'release', or 1 : Fire 'click' event when touch released after pressed.
click.clickInterval : Interval between 2 'click' events, in ms.
space :
An object: Padding of button game objects.
space.top, space.bottom, space.left, space.right : Padding around bottons.
space.item : Space between 2 button game objects.
A number: Deprecated, space between 2 button game objects.
name : Set name of this game object.
draggable : Set true to drag top-most object.
sizerEvents : Set true to fire sizer events. Default value is false.
enableLayer :
false : Add child game objects into scene's display list. Default behavior.
true : Add child game objects into an internal layer game object. See also.
eventEmitter : Dispatch buttons' touch events to other game object, default is this buttons game object.
groupName : Optional group name for argument of touch events.
setValueCallback, or setButtonStateCallback : Callback to set value of a button.
undefined : No callback, default value.
A function object.
function(button, value, previousValue) {
// ...
}
button : Button game object.
value: true, or false.
previousValue : true, or false.
Custom class¶
Define class
class MyButtons extends RexPlugins.UI.Buttons {
constructor(scene, config) {
super(scene, config);
// ...
scene.add.existing(this);
}
// ...
}
Create instance
var buttons = new MyButtons(scene, config);
Layout children¶
Arrange position of all elements.
buttons.layout();
See also - dirty
Other properties¶
See sizer object
Events¶
Click button
buttons.on('button.click', function(button, index, pointer, event) {
// ...
}, scope);
or
buttons.on('button.click', function(button, groupName, index, pointer, event) {
// ...
}, scope);
groupName : Optional group name.
button : Triggered button game object.
index : Index of triggered button game object.
pointer : Pointer object.
Cancel remaining touched events : event.stopPropagation()
Pointer-over button
buttons.on('button.over', function(button, index, pointer, event) {
// ...
}, scope);
or
buttons.on('button.over', function(button, groupName, index, pointer, event) {
// ...
}, scope);
Pointer-out button
buttons.on('button.out', function(button, index, pointer, event) {
// ...
}, scope);
or
buttons.on('button.out', function(button, groupName, index, pointer, event) {
// ...
}, scope);
Pointer-down button
buttons.on('button.down', function(button, index, pointer, event) {
// ...
}, scope);
or
buttons.on('button.down', function(button, groupName, index, pointer, event) {
// ...
}, scope);
Pointer-up button
buttons.on('button.up', function(button, index, pointer, event) {
// ...
}, scope);
or
buttons.on('button.up', function(button, groupName, index, pointer, event) {
// ...
}, scope);
Enable button's input
buttons.on('button.enable', function(button, index) {
// ...
}, scope);
or
buttons.on('button.enable', function(button, groupName, index, pointer, event) {
// ...
}, scope);
Disable button's input
buttons.on('button.disable', function(button, index) {
// ...
}, scope);
or
buttons.on('button.disable', function(button, groupName, index, pointer, event) {
// ...
}, scope);
Emit button click event¶
buttons.emitButtonClick(index);
index : Index of triggered button game object, or a button game object.
Enable/disable input of button¶
Enable a button's input
buttons.setButtonEnable(index);
// buttons.setButtonEnable(index, true);
index : Index of triggered button game object, or a button game object.
Enable all buttons' input
buttons.setButtonEnable();
// buttons.setButtonEnable(true);
Disable
buttons.setButtonEnable(index, true);
index : Index of triggered button game object, or a button game object.
Disable all buttons' input
buttons.setButtonEnable(false);
Toggle
buttons.toggleButtonEnable(index);
Toggle all buttons's input
buttons.toggleButtonEnable();
Get button's input enable
var enabled = bottons.getButtonEnable(index);
Get element¶
Get element
Background game object
var background = buttons.getElement('background');
Button game objects
var buttonObjects = buttons.getElement('buttons');
or
var buttonObject = buttons.getButton(index);
or
var buttonObjects = buttons.getElement('buttons[0]'); // First button
Get by name
var gameObject = buttons.getElement('#' + name);
// var gameObject = buttons.getElement('#' + name, recursive);
or
var gameObject = buttons.getByName(name);
// var gameObject = buttons.getByName(name, recursive);
recursive : Set true to search all children recursively.
Add child¶
Add button child
buttons.addButton(gameObject)
gameObject : A game object, or an array of game objects.
Add non-button child, see sizer.add() method.
buttons.add(gameObject,
{
proportion: 0,
align: 'center',
padding: {left: 0, right: 0, top: 0, bottom: 0},
expand: false,
key: undefined,
index: undefined,
minWidth: undefined,
minHeight: undefined
}
)
Remove child¶
Remove button child
buttons.removeButton(gameObject, destroyChild);
gameObject :
Game object, or array of game objects : Button game object.
A number, or array of numbers : Index of button game object.
A string, or array of strings : Name of button game object.
destroyChild : Set true to destroy button game object.
Remove all buttton children
buttons.clearButtons(destroyChild);
destroyChild : Set true to destroy button game objects.
Remove a button or non-button child, see sizer.remove() method.
buttons.remove(gameObject, destroyChild);
Remove all button or non-button children, see sizer.remove() method.
buttons.removeAll(destroyChild);
Show/hide button¶
Hidden elements won't be counted when layouting.
Call buttons.layout(), or topSizer.layout() after show/hide any button.
Show button
buttons.showButton(index);
index : A number index, or a button game object.
Hide button.
buttons.hideButton(index);
index : A number index, or a button game object.
For each button¶
buttons.forEachButtton(callback, scope);
callback :
function(button, index, buttonArray) {
// ...
}
Checkboxes/radio¶
Configure buttons to checkboxes/radio
var buttons = scene.rexUI.add.buttons({
buttons: [
buttonGameObject,
buttonGameObject,
// ...
],
buttonsType: 'checkboxes', // or 'radio'
setValueCallback: function(button, value, previousValue) {
// ...
}, // or setButtonStateCallback
});
buttons : Array of button game objects.
Property name of each button game object will be used as a key in buttons.data
buttonsType : Set type to 'checkboxes', or 'radio'.
setValueCallback or setButtonStateCallback : Callback to set value of a button.
function(button, value) {
// ...
}
button : Button game object.
value: true, or false.
previousValue : true, or false.
Also trigger 'button.statechange' event.
State of a button : Stored in buttons.data
Get states of all buttons :
var states = buttons.getAllButtonsState();  // { key: boolean }
Clear states of all button :
buttons.clearAllButtonsState();
Will trigger setValueCallback and 'button.statechange' event.
Checkboxes¶
Read state
var state = buttons.getButtonState(key);
key : name property of a button game object. (i.e. button.name)
state : true, or false
Set state
buttons.setButtonState(key, state);
key : name property of a button game object. (i.e. button.name)
state : true, or false
Radio¶
Read state
var value = buttons.getSelectedButtonName();
or
var value = buttons.value;
value : name property of a button game object. (i.e. button.name)
Set state
buttons.setSelectedButtonName(key);
or
buttons.value = key;
key : name property of a button game object. (i.e. button.name)
Events¶
On button state changed. For Checkboxes/radio
buttons.on('button.statechange', function(button, index, value, previousValue) {
// ...
}, scope);
or
buttons.on('button.statechange', function(button, groupName, index, value, previousValue) {
// ...
}, scope);
Can be used to replace setValueCallback.