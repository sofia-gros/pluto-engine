Typing
Introduction¶
Typing text on text object, bbcode text object, or tag text object.
Author: Rex
Behavior of text object
Live demos¶
BBCode text + page + typing
Tag text + typing
Text wrap enable
TextBox, see text-box.
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rextexttypingplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexttypingplugin.min.js', true);
Add typing behavior
var typing = scene.plugins.get('rextexttypingplugin').add(textGameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import TextTypingPlugin from 'phaser4-rex-plugins/plugins/texttyping-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexTextTyping',
plugin: TextTypingPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add typing behavior
var typing = scene.plugins.get('rexTextTyping').add(textGameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import TextTyping from 'phaser4-rex-plugins/plugins/texttyping.js';
Add typing behavior
var typing = new TextTyping(textGameObject, config);
Create instance¶
var typing = scene.plugins.get('rexTextTyping').add(textGameObject, {
// wrap: false,
// speed: 333,       // typing speed in ms
// typeMode: 0,      //0|'left-to-right'|1|'right-to-left'|2|'middle-to-sides'|3|'sides-to-middle'
// setTextCallback: function(text, isLastChar, insertIdx){ return text; }  // callback before set-text
// setTextCallbackScope: null,
});
textObject : Text object, bbcode text object, tag text object, or bitmap text object
wrap :
false : Don't insert \n, default behavior.
true : Insert \n to wrap content according to style of text, to prevent typing jittering.
speed : Typing speed in ms, default value is 333.
typeMode :
'left-to-right', or 0 : Typing characters from left to right.
'right-to-left', or 1 : Typing characters from right to left.
'middle-to-sides', or 2 : Typing characters from middle to sides.
'sides-to-middle', or 3 : Typing characters from sides to middle.
setTextCallback : Callback befor set-text, to decorate display text.
function(text, isLastChar, insertIdx) { return text; }
setTextCallbackScope : Scope of setTextCallback function.
Start typing¶
typing.start(text);
// typing.start(text, speed);
text : Typing content string.
speed : Typing speed in ms.
Start typing from line¶
typing.startFromLine(text, lineIndex);
// typing.startFromLine(text, lineIndex, speed);
text : Typing content string.
lineIndex : Start from line.
speed : Typing speed in ms.
Typing more text¶
typing.appendText(text);
Stop typing¶
typing.stop();
// typing.stop(true);;  // stop and show all text
Pause/Resume typing¶
Pause typing
typing.pause();
Resume typing
typing.resume();
Set typing speed¶
typing.setTypingSpeed(speed);  // speed in ms
// typing.speed = speed;
Set speed in typing event or setTextCallback to change typing speed of remaining text.
Set typing mode¶
typing.setTypeMode(mode);
typeMode :
'left-to-right', or 0 : typing characters from left to right.
'right-to-left', or 1 : typing characters from right to left.
'middle-to-sides', or 2 : typing characters from middle to sides, optional.
'sides-to-middle', or 3 : typing characters from sides to middle.
Events¶
On changing content of text game object :
typing.on('type', function(){
});
On typing a character
typing.on('typechar', function(char){
});
On typing completed :
typing.on('complete', function(typing, txt){});
Status¶
Is typing
var isTyping = typing.isTyping;