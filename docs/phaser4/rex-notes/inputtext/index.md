Input text
Introduction¶
Input DOM element.
Author: Rex
DOM Game object
Live demos¶
Input text
Number input
In fullscreen
Usage¶
Sample code
Install plugin¶
Load minify file¶
Enable dom element in configuration of game
var config = {
parent: divId,
// fullscreenTarget: divId, // For fullscreen
dom: {
createContainer: true
},
input: {
mouse: {
target: divId
},
touch: {
target: divId
},
},
// ...
};
var game = new Phaser.Game(config);
Set parent to divId
Set dom.createContainer to true.
Load plugin (minify file) in preload stage
scene.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);
Add input-text object
var inputText = scene.add.rexInputText(x, y, width, height, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import InputTextPlugin from 'phaser4-rex-plugins/plugins/inputtext-plugin.js';
var config = {
parent: divId,
// fullscreenTarget: divId, // For fullscreen
dom: {
createContainer: true
},
input: {
mouse: {
target: divId
},
touch: {
target: divId
},
},
// ...
plugins: {
global: [{
key: 'rexInputTextPlugin',
plugin: InputTextPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add input-text object
var inputText = scene.add.rexInputText(x, y, width, height, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Enable dom element in configuration of game
var config = {
parent: divId,
// fullscreenTarget: divId, // For fullscreen
dom: {
createContainer: true
},
input: {
mouse: {
target: divId
},
touch: {
target: divId
},
},
// ...
};
var game = new Phaser.Game(config);
Set parent to divId
Set dom.createContainer to true.
Import class
import InputText from 'phaser4-rex-plugins/plugins/inputtext.js';
Add input-text object
var inputText = new InputText(scene, x, y, width, height, config);
scene.add.existing(inputText);
Add input text object¶
var inputText = scene.add.rexInputText(x, y, width, height, config);
// var inputText = scene.add.rexInputText(x, y, config);
// var inputText = scene.add.rexInputText(config);
Default configuration
{
x: 0,
y: 0,
width: undefined,
height: undefined,
type: 'text',    // 'text'|'password'|'textarea'|'number'|'color'|...
// Element properties
id: undefined,
text: undefined,
maxLength: undefined,
minLength: undefined,
placeholder: undefined,
tooltip: undefined,
readOnly: false,
spellCheck: false,
autoComplete: 'off',
autoCapitalize: 'off',
// Style properties
align: undefined,
paddingLeft: undefined,
paddingRight: undefined,
paddingTop: undefined,
paddingBottom: undefined,
fontFamily: undefined,
fontSize: undefined,
color: '#ffffff',
border: 0,
backgroundColor: 'transparent',
borderColor: 'transparent',
borderRadius: undefined,
outline: 'none',
direction: 'ltr',
selectAll: false
}
x, y : Position
width, height : Size of element
type : Type of element
'text', 'password', 'textarea', 'number', 'color', ...
Element properties
id : id element property.
text : value element property.
maxLength : maxLength element property.
minLength : minLength element property.
placeholder : placeholder element property.
tooltip : title element property.
readOnly : readonly element property.
spellCheck : spellcheck element property.
autoComplete : autocomplete element property.
autoCapitalize : autocapitalize element property.
Element style properties
align : text-align style property.
paddingLeft, paddingRight, paddingTop, paddingBottom : padding-left, padding-right, padding-top, padding-bottom style property.
fontFamily : font-family style property.
fontSize : font-size style property.
color : color style property.
backgroundColor : backgroundColor style property.
border, borderColor, borderRadius : border, borderColor, border-radius style property.
outline : outline style property.
direction : direction style property.
selectAll : Set true to select all text.
Custom class¶
Define class
class MyText extends InputText {
constructor(scene, x, y, width, height, config) {
super(scene, x, y, width, height, config) {
// ...
scene.add.existing(this);
}
// ...
// preUpdate(time, delta) {}
}
scene.add.existing(gameObject) : Adds an existing Game Object to this Scene.
If the Game Object renders, it will be added to the Display List.
If it has a preUpdate method, it will be added to the Update List.
Create instance
var inputText = new MyText(scene, x, y, width, height, config);
Text¶
Get
var text = inputText.text;
Set
inputText.setText(text);
// inputText.text = text;
Scroll to bottom
inputText.scrollToBottom();
Style¶
Get
var value = inputText.getStyle(key);
Set
inputText.setStyle(key, value)
Focus¶
Focus
inputText.setFocus();
Blur
inputText.setBlur();
Is focused
var isFocused = inputText.isFocused;
Font color¶
Get
var color = inputText.fontColor;
// var color = inputText.node.style.color;
Set
inputText.fontColor = color;  // CSS color string
// inputText.node.style.color = color;
or
inputText.setFontColor(color);  // CSS color string
Max length¶
Get
var value = inputText.maxLength;
Set
inputText.maxLength = value;
or
inputText.setMaxLength(value);
Min length¶
Get
var value = inputText.minLength;
Set
inputText.minLength = value;
or
inputText.setMinLength(value);
Placeholder¶
Get
var value = inputText.placeholder;
Set
inputText.placeholder = value;
or
inputText.setPlaceholder(value);
Tooltip¶
Get
var value = inputText.tooltip;
Set
inputText.tooltip = value;
or
inputText.setTooltip(value);
Readonly¶
Get
var readOnly = inputText.readOnly;
Set
inputText.readOnly = value;
inputText.setReadOnly();
// inputText.setReadOnly(value);
Resize¶
inputText.resize(width, height);
Select text¶
Select all text
inputText.selectText();
// inputText.selectAll();
Select sub-string
inputText.selectText(selectionStart, selectionEnd);
Cursor position¶
Get
var cursorPosition = inputText.cursorPosition;
Equal to inputText.selectionStart.
Set
inputText.setCursorPosition(cursorPosition);
inputText.cursorPosition = cursorPosition;
Equal to inputText.setSelectionRange(cursorPosition, cursorPosition)
Events¶
On text changed
inputText.on('textchange', function(inputText, e){ }, scope);
On focus
inputText.on('focus', function(inputText, e){ }, scope);
On blur
inputText.on('blur', function(inputText, e){ }, scope);
On click, double click
inputText.on('click', function(inputText, e){ }, scope);
inputText.on('dblclick', function(inputText, e){ }, scope);
Touch/mouse events on input text object won't be propagated to game canvas.
On keydown, keyup
inputText.on('keydown', function(inputText, e){ }, scope);
inputText.on('keyup', function(inputText, e){ }, scope);
Keyboard events on input text object won't be propagated to game canvas.
On pointerdown, pointermove, pointerup
inputText.on('pointerdown', function(inputText, e){ }, scope);
inputText.on('pointermove', function(inputText, e){ }, scope);
inputText.on('pointerup', function(inputText, e){ }, scope);
Mouse/touch events on input text object won't be propagated to game canvas.
On select
inputText.on('select', function(inputText, e){
var selectedString = inputText.selectedText;
var selectionStart = inputText.selectionStart;
var selectionEnd = inputText.selectionEnd;
}, scope);
On composition inpit
inputText.on('compositionStart', function(inputText, e){ }, scope);
inputText.on('compositionEnd', function(inputText, e){ }, scope);
inputText.on('compositionUpdate', function(inputText, e){ }, scope);
Bypass key input¶
Registered keyboard events might capture key input.
var keyObj = scene.input.keyboard.addKey('W', enableCapture, emitOnRepeat);
Set enableCapture to false to bypass key input to this input-text game objecct.
Other properties¶
See dom game object, game object
Interactive with other game objects¶
See dom-element's Interactive with other game objects
Close editing¶
Close editing (set blur) when pointerdown outside
scene.input.on('pointerdown', function () {
inputText.setBlur();
})
Close editing (set blur) when ENTER key press
inputText.on('keydown', function (inputText, e) {
if ((inputText.inputType !== 'textarea') && (e.key === 'Enter')) {
inputText.setBlur();
}
})
inputType : 'text', 'textarea', ...