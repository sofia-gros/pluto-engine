Canvas input
Introduction¶
An invisible Input DOM element to
receive character input and display on DynamicText.
Inspirited from CanvasInput.
Author: Rex
Game object
Live demos¶
Simple
Thin cursor
Text input
Number input
With rexui-Label
Text area
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexcanvasinputplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcanvasinputplugin.min.js', true);
Add canvas-input object
var txt = scene.add.rexCanvasInput(x, y, width, height, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import CanvasInputPlugin from 'phaser4-rex-plugins/plugins/canvasinput-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexCanvasInputPlugin',
plugin: CanvasInputPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add canvas-input object
var txt = scene.add.rexCanvasInput(x, y, width, height, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import CanvasInput from 'phaser4-rex-plugins/plugins/canvasinput.js';
Add canvas-input object
var txt = new CanvasInput(textGameObject, x, y, width, height, config);
scene.add.existing(txt);
Create instance¶
var txt = scene.add.rexCanvasInput({
// Parameters of DynamicText
x: 0,
y: 0,
width: undefined,
height: undefined,
resolution: 1,
// padding: 0,  // {left: 0, right: 0, top: 0, bottom: 0}
background: {
color: null,
color2: null,
horizontalGradient: true,
stroke: null,
strokeThickness: 2,
cornerRadius: 0,
cornerIteration: null,
// Style when focus
// 'focus.color': ...
// 'focus.color2': ...
// 'focus.stroke': ...
},
focusStyle: undefined,
innerBounds: {
color: null,
color2: null,
horizontalGradient: true,
stroke: null,
strokeThickness: 2
},
style: {
bold: false,
italic: false,
fontSize: '16px',
fontFamily: 'Courier',
color: '#fff',
stroke: '#fff',
strokeThickness: 0,
shadowColor: null,
shadowOffsetX: 0,
shadowOffsetY: 0,
shadowBlur: 0,
backgroundColor: null,
backgroundHeight: undefined,
backgroundBY: undefined,
offsetX: 0,
offsetY: 0,
// Style when cursor move on
// 'cursor.color': ...
// 'cursor.backgroundColor': ...
// 'cursor.xxx': ...
// Style when range selecting
// 'range.color': ...
// 'range.backgroundColor': ...
// 'range.xxx': ...
// Using cursor style if no range style is given
},
cursorStyle: undefined,
childrenInteractive: false,
// rawText: null,
text: '',
wrap: {
lineHeight: undefined,
useDefaultLineHeight: true,
maxLines: 1,
wrapWidth: undefined,
letterSpacing: 0,
wrapMode: 'char',  // 1|'word'|2|'char'|'character'|3|'mix', for single line text input
hAlign: 0, // 0|'left'|1|'center'|2|'right'|3|'justify'|'justify-left'|4|'justify-center'|5| justify-right'
vAlign: 'center',  // For single line text input
},
textArea: false,
// Parameters of hidden-text-editor
// inputType: 'text',  // 'text'|'password'|'textarea'|...
// readOnly: false,
// maxLength: undefined,
// minLength: undefined,
// selectAll: false,
// enterClose: true,
// Callbacks
// onOpen: function (textObject, hiddenInputText) {
// },
// onClose: function (textObject, hiddenInputText) {
// },
// onUpdate: function (inputText, textObject, hiddenInputText) {
//     return displayText;
// },
// onAddChar: function(child, index, canvasInput) {
//    child.modifyStyle({...})
// },
// onCursorOut: function(child, cursorIndex, canvasInput) {
//     child.modifyStyle({
//
//     });
// },
// onCursorIn: function(child, cursorIndex, canvasInput) {
//     child.modifyStyle({
//
//     });
// },
// onRangeOut: function(child, cursorIndex, canvasInput) {
//     child.modifyStyle({
//
//     });
// },
// onRangeIn: function(child, cursorIndex, canvasInput) {
//     child.modifyStyle({
//
//     });
// },
// Use 'onCursorIn' and 'onCursorOut' if 'onRangeOut' and 'onRangeIn' are not given
// parseTextCallback: function(text) {
//     return text;
// }.
});
text : Display text.
rawText : Initial raw text value. See raw text.
A string : Initial input text, and display text and input text are treated as separated values.
use onUpdate callback to return display text from input text.
null, or undefined : Ignore this mode, default behavior. Display text and input text
will be set to the same value.
textArea :
false : Single line text input. Default behavior.
true : Multiple lines text input.
Parameters of DynamicText...
wrap : Some default value in wrap are changed
wrap.useDefaultLineHeight : Default value is true
wrap.maxLines : Default value is 1
wrap.vAlign : Default value is 'center'
Parameters of hidden-text-editor
inputType : Type of element
'text', 'textarea', ...
enterClose : Set true to close input text when enter-key was pressed. Default value is true.
readOnly :
true : un-editable.
false : Editable. Defaule behavior.
maxLength, minLength : Maximun or minimun of input characters
selectAll : Set to true to select all characters when focusing.
Callbacks
onOpen : Callback invoked when focus on this hidden input text.
function (textObject) {
// textObject.setInputText(txt);
}
onClose : Callback invoked when blur.
function (textObject) {
}
onUpdate :
A callback invoked in each tick of editing.
function (inputText, textObject) {
// return displayText;
}
Can return a new string for text game object displaying. See also raw text
'number' : Only output number string.
onAddChar : Callback invoked when adding new character child
function(child, index, canvasInput) {
child.modifyStyle({...})
}
child : character child
onCursorOut : Callback invoked when cursor move out of a character child
function(child, index, canvasInput) {
child.modifyStyle({...})
}
child : character child
onCursorIn : Callback invoked when cursor move on a character child
function(child, index, canvasInput) {
child.modifyStyle({...})
}
child : character child
onRangeOut : Callback invoked when leaving range-selecting on a character child
function(child, index, canvasInput) {
child.modifyStyle({...})
}
child : character child
Use onCursorOut callback if onRangeOut and onRangeIn callbacks are not given, for backward compatible.
onRangeIn : Callback invoked when entering range-selecting on a character child
function(child, index, canvasInput) {
child.modifyStyle({...})
}
child : character child
Use onCursorIn callback if onRangeOut and onRangeIn callbacks are not given, for backward compatible.
parseTextCallback : Callback of parsing text (txt.text) to value (txt.value)
undefined : Bypass text to value. Default behavior.
A function object
function(text) {
return text;
}
focusStyle : Will apply this style to background when focusing.
undefined : Ignore this behavior.
A plain object
{
color: null,
color2: null,
horizontalGradient: true,
stroke: null,
strokeThickness: 2,
cornerRadius: 0,
cornerIteration: null,
}
Or add these style settings in background parameter, with prefix 'focus.'.
cursorStyle : Will apply this style when cursor move on a character child.
undefined : Ignore this behavior.
A plain object
{
bold: false,
italic: false,
fontSize: '16px',
fontFamily: 'Courier',
color: '#fff',
stroke: '#fff',
strokeThickness: 0,
shadowColor: null,
shadowOffsetX: 0,
shadowOffsetY: 0,
shadowBlur: 0,
backgroundColor: null,
backgroundHeight: undefined,
backgroundBottomY: 0,
backgroundLeftX: 0,
backgroundRightX: 0,
backgroundBY: undefined,
offsetX: 0,
offsetY: 0
}
Or add these style settings in style parameter, with prefix 'cursor.'.
rangeStyle : Will apply this style when entering range-selecting on character children.
undefined : Ignore this behavior.
A plain object
{
bold: false,
italic: false,
fontSize: '16px',
fontFamily: 'Courier',
color: '#fff',
stroke: '#fff',
strokeThickness: 0,
shadowColor: null,
shadowOffsetX: 0,
shadowOffsetY: 0,
shadowBlur: 0,
backgroundColor: null,
backgroundHeight: undefined,
backgroundBottomY: 0,
backgroundLeftX: 0,
backgroundRightX: 0,
backgroundBY: undefined,
offsetX: 0,
offsetY: 0
}
Or add these style settings in style parameter, with prefix 'range.'.
Using cursorStyle if no rangeStyle found in config, for backward compatible.
Number input¶
txt.setNumberInput();
Custom class¶
Define class
class MyCanvasInput extends CanvasInput {
constructor(textGameObject, x, y, width, height, config)) {
super(textGameObject, x, y, width, height, config)) {
// ...
}
// ...
// preUpdate(time, delta) {}
}
scene.add.existing(gameObject) : Adds an existing Game Object to this Scene.
If the Game Object renders, it will be added to the Display List.
If it has a preUpdate method, it will be added to the Update List.
Create instance
var txt = new MyCanvasInput(textGameObject, config);
Open editor¶
txt.open();
or
txt.open(onCloseCallback);
onCloseCallback : Callback invoked when closing text-editor
Close editor¶
txt.close();
Is opened¶
var isOpened = txt.isOpened;
Text¶
Display text on dynamic text game object
Get
var text = txt.text;
or
var text = txt.displayText;
Set
txt.setText(text);
or
txt.setDisplayText(text);
Input text on hidden text edit behavior
Get
var text = txt.inputText;
Set
var text = txt.setInputText(text);
Value¶
Get. Parse text to value.
var value = txt.getValue();
// var value = txt.value;
Set parseTextCallback
txt.setParseTextCallback(callback);
callback :
undefined : Bypass text to value. Default behavior.
A function object
function(text) {
return text;
}
Set. Conver any type of value to string.
txt.setValue(value);
// txt.value = value;
Raw text¶
Set raw text and enable display/raw text separation mode.
Useful when editing password.
txt.setRawText(value);
Get raw text
var rawText = txt.rawText;
Update display text from onUpdate callback.
Useful when toggling password mask.
txt.updateFromEditor();
Read only¶
Enable read only
txt.setReadOnly();
// txt.setReadOnly(true);
or
txt.readOnly = true;
Disable read only
txt.setReadOnly(false);
or
txt.readOnly = false;
Get read only
var readOnlyEanble = txt.readOnly;
Size¶
Resize canvas size
txt.setCanvasSize(width, height)
Reisze text wrapping size and canvas size.
txt.setSize(width, height);
or
txt.setFixedSize(width, height);
Resize to minimun size to show all visible characters.
txt.setToMinSize();
Events¶
On text change
txt.on('textchange', function(text, txt){
})
On character child adding
txt.on('addchar', function(child, index, canvasInput) {
child.modifyStyle({...})
})
child : character child
On cursor moving out of a character child
txt.on('cursorout', function(child, index, canvasInput) {
child.modifyStyle({...})
})
child : character child
On cursor moving on a character child
txt.on('cursorin', function(child, index, canvasInput) {
child.modifyStyle({...})
})
child : character child
On open text-editor
txt.on('open', function() {
})
On close text-editor
txt.on('close', function() {
})
Close editor by ENTER key down
txt.on('keydown-ENTER', function(){
})
Not a number input
txt.on('nan', function(text){
})
Select text¶
This feature does not support.
Bypass key input¶
Registered keyboard events might capture key input.
var keyObj = scene.input.keyboard.addKey('W', enableCapture, emitOnRepeat);
Set enableCapture to false to bypass key input to this input-text game objecct.
Other properties¶
See Dynamic text game object game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters