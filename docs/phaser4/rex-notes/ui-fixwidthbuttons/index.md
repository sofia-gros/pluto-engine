Fix-width buttons
Introduction¶
A container with a group of fix-width buttons.
Author: Rex
Game object
Live demos¶
Checkboxes/radio
Indent left
Indent top
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
Add fix-Width buttons object
var buttons = scene.rexUI.add.fixWidthButtons(config);
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
Add fix-Width buttons object
var buttons = scene.rexUI.add.fixWidthButtons(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { FixWidthButtons } from 'phaser4-rex-plugins/templates/ui/ui-components.js';
Add fix-Width buttons object
var buttons = new FixWidthButtons(scene, config);
scene.add.existing(buttons);
Add Buttons object¶
var buttons = scene.rexUI.add.fixWidthButtons({
// x: 0,
// y: 0,
// anchor: undefined,
// width: undefined,
// height: undefined,
// origin: 0.5
// originX:
// originY:
// Elements
// background: backgroundGameObject,
buttons: [
buttonGameObject,
buttonGameObject,
// ...
],
// rtl: false,
align: 0,
click: {
mode: 'pointerup',
clickInterval: 100
},
// space: 0,
// space: {
//     left: 0, right: 0, top: 0, bottom: 0,
//     item: 0, line: 0,
//     indentLeftOdd: 0, indentLeftEven: 0,
//     indentTopOdd: 0, indentTopEven: 0,
// },
// name: '',
// draggable: false,
// sizerEvents: false,
// enableLayer: false,
// eventEmitter: this,
// groupName: undefined,
// buttonsType: undefined,
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
background : Game object of background, optional. This background game object will be resized to fit the size of grid table.
buttons : 1d/2d array of button game objects.
align : Align children of a line.
0, 'left' : Align children of a line to left/top side.
1, 'right' : Align children of a line to right/bottom side.
2, 'center' : Align children of a line to ceter.
3, 'justify', 'justify-left' : If remainder space is less or equal than 25%, then justify children. Else align children to left/top side.
4, 'justify-right' : If remainder space is less or equal than 25%, then justify children. Else align children to right/bottom side.
5, 'justify-cneter' : If remainder space is less or equal than 25%, then justify children. Else align children to center.
click: Configuration of button clicking.
click.mode :
'pointerdown', 'press', or 0 : Fire 'click' event when touch pressed.
'pointerup', 'release', or 1 : Fire 'click' event when touch released after pressed.
click.clickInterval : Interval between 2 'click' events, in ms.
space :
A number: Space between 2 button game objects.
An object: Padding of button game objects.
space.left, space.right, space.top, space.bottom : Space of bounds.
space.item : Space betwen each child of a line.
space.line : Space between each line.
space.indentLeftOdd, space.indentLeftEven : Indent at each odd/even line.
space.indentTopOdd, space.indentTopEven : Indent at each odd/even item.
name : Set name of this game object.
draggable : Set true to drag top-most object.
sizerEvents : Set true to fire sizer events. Default value is false.
enableLayer :
false : Add child game objects into scene's display list. Default behavior.
true : Add child game objects into an internal layer game object. See also.
eventEmitter : Dispatch buttons' touch events to other game obhect, default is this buttons game object.
groupName : Optional group name for argument of touch events.
buttonsType : Type/behavior of these buttons.
undefined : No extra behavior, default value.
'checkboxes' : Set these buttons to checkboxes.
'radio' : Set these buttons to radio.
setValueCallback or setButtonStateCallback : Callback to set value of a button.
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
class MyButtons extends RexPlugins.UI.FixWidthButtons {
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
Enable button's input
buttons.on('button.enable', function(button, index) {
// ...
}, scope);
or
buttons.on('button.enable', function(button, groupName, index, pointer, event) {
// ...
}, scope);
Disable button's input
buttons.on('button.disalbe', function(button, index) {
// ...
}, scope);
or
buttons.on('button.disalbe', function(button, groupName, index, pointer, event) {
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
Add non-button child, see fixWidthSizer.add() method.
buttons.add(gameObject,
{
padding: {left: 0, right: 0, top: 0, bottom: 0},
key: undefined,
index: undefined
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
Remove a button or non-button child, see fixWidthSizer.remove() method.
buttons.remove(gameObject, destroyChild);
Remove all button or non-button children, see fixWidthSizer.remove() method.
buttons.removeAll(destroyChild);
Show/hide button¶
The same as for each button of buttons.
For each button¶
The same as for each button of buttons.
Checkboxes/radio¶
The same as checkboxes/radio of buttons.