Grid buttons
Introduction¶
A container with a group of buttons in grids.
Author: Rex
Game object
Live demos¶
Number pad
Checkboxes/radio
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
Add buttons object
var buttons = scene.rexUI.add.gridButtons(config);
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
var buttons = scene.rexUI.add.gridButtons(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { GridButtons } from 'phaser4-rex-plugins/templates/ui/ui-components.js';
Add buttons object
var buttons = new GridButtons(scene, config);
scene.add.existing(sizer);
Add grid sizer object¶
var buttons = scene.rexUI.add.gridButtons({
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
[buttonGameObject, buttonGameObject, buttonGameObject, ...],
[buttonGameObject, buttonGameObject, buttonGameObject, ...],
[buttonGameObject, buttonGameObject, buttonGameObject, ...],
...
],
// row: 0,
// column: 0,   // col: 0
// createCellContainerCallback: function(scene, x, y) {
//       return cellContainer;
// },
expand: true,
click: {
mode: 'pointerup',
clickInterval: 100
},
// space: {
//     left: 0, right: 0, top: 0, bottom:0,
//     column: 0, // [0, 0, 0]
//     row: 0     // [0, 0, 0]
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
width : Minimum width. i.e. Width of this gridButtons will larger then this value.
height : Minimum height. i.e. Hieght of this gridButtons will larger then this value.
origin, originX, originY : Set origin of this sizer. Default value is (0.5, 0.5).
background : Game object of background, optional. This background game object will be resized to fit the size of grid table.
buttons : 2d array of button game objects, or create buttons via row, column(or col), and createCellContainerCallback.
createCellContainerCallback : Callback to create buttons.
function(scene, x, y) {
return cellContainer;
}
expand : Set true to expand width and height of buton game objects.
space : Space around this sizer, and space between columns/rows
space.left, space.right, space.top, space.bottom : Space around this sizer.
space.column : Space between 2 columns
A number
A number array
space.row : Space between 2 rows
A number
A number array
name : Set name of this game object.
draggable : Set true to drag top-most object.
sizerEvents : Set true to fire sizer events. Default value is false.
enableLayer :
false : Add child game objects into scene's display list. Default behavior.
true : Add child game objects into an internal layer game object. See also.
eventEmitter : Dispatch buttons' touch events to other game object, default is this buttons game object.
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
class MyGridButtons extends RexPlugins.UI.GridButtons {
constructor(scene, config) {
super(scene, config);
// ...
scene.add.existing(this);
}
// ...
}
Create instance
var buttons = new MyGridButtons(scene, config);
Layout children¶
Arrange position of all children.
buttons.layout();
See also - dirty
Other properties¶
See grid sizer object.
Events¶
The same as events of buttons.
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
Show/hide button¶
The same as for each button of buttons.
For each button¶
The same as for each button of buttons.
Checkboxes/radio¶
The same as checkboxes/radio of buttons.