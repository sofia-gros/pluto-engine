Bracket parser
Introduction¶
A lite-weight delimiter parser.
Author: Rex
Object
Live demoes¶
Basic
Markup text
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexbracketparserplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbracketparserplugin.min.js', true);
Add parser object
var parser = scene.plugins.get('rexbracketparserplugin').add(config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import BracketParserPlugin from 'phaser4-rex-plugins/plugins/bracketparser-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexBracketParser',
plugin: BracketParserPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add parser object
var parser = scene.plugins.get('rexBracketParser').add(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import BracketParser from 'phaser4-rex-plugins/plugins/bracketparser.js';
Add parser object
var parser = new BracketParser(config);
Create instance¶
var parser = scene.plugins.get('rexBracketParser').add({
// delimiters: '<>', // or ['<', '>']
// valueConvert: true,
// translateTagNameCallback: undefined,
});
delimiters: String of left-delimiter and right-delimiter.
A single string with 2 characters. Default value is '<>'.
A array with 2 strings
valueConvert : A callback to convert values.
true : Use defaule value converter. Values will be converted to number (include hex number string like '0xFF'), boolean, null, or string.
false, or null : Bypass string value.
Function object:
function(s) {
return s;
}
translateTagNameCallback : Callback to translate tag-name
undefined : Use original tag-name. Default behavior.
A function, return new tag name.
function(tagName) {
return newTagName;
}
Tag and content¶
Assume that left-delimiter and right-delimiter is '<>'
Start-tag : '<TAG>'
Start-tag with a single value : '<TAG=value>'
value : If valueConvert is true,
Number
Boolean
null
String
Start-tag with array values, separated via ',' : '<TAG=value0,value1,value2>'
End-tag : '<\TAG>'
Content : Any string outside of tag-start, or tag-end.
Start parsing¶
parser.start(text);
These events will be emitted under this method.
Pause¶
Pause
parser.pause();
Pause until event
parser.pauseUntilEvent(eventEmitter, eventName);
Will invoke
eventEmitter.once(eventName, function() {
parser.next();
})
Invoke this method during tag-start,tag-end, or content events to suspend parsing.
Resume¶
parser.next();
Skip any-tag-start/any-tag-end event¶
parser.skipEvent();
When getting a tag-start, or a tag-end event, parser will emitts
Start-tag : '+TAG', then '+'
End-tag : '-TAG', then '-'
Invoke this medthod under '+TAG', or '-TAG' event to skip '+', or '-' event.
Status¶
Is parsing
var isRunning = parser.isRunning;
true : Has remainder characters
false : After parsing last character
Is paused
var isPaused = parser.isPaused;
Events¶
Tags/Content¶
Get a specific tag-start
Start-tag with a single value : '<TAG=value>'
parser.on('+' + TagName, function(value){ /* ... */ });
Start-tag with array values, separated via ',' : '<TAG=value0,value1,value2>'
parser.on('+' + TagName, function(value0, value1, value2){ /* ... */ });
Get any-tag-start
Start-tag with a single value : '<TAG=value>'
parser.on('+', function(tagName, value){ /* ... */ });
Start-tag with array values, separated via ',' : '<TAG=value0,value1,value2>'
parser.on('+', function(tagName, value0, value1, value2){ /* ... */ });
Get a specific tag-end
parser.on('-' + TagName, function(){ /* ... */ });
Get a content
parser.on('content', function(content){ /* ... */ });
Previous tag-start : parser.lastTagStart
Get any-tag-end
parser.on('-', function(tagName){ /* ... */ });
Previous tag-start : parser.lastTagStart
Previous Content : parser.lastContent
Control flow¶
Parsing start
parser.on('start', function(){ /* ... */ });
Parsing end
parser.on('complete', function(){ /* ... */ });
On pause
parser.on('pause', function(){ /* ... */ });
On resume
parser.on('resume', function(){ /* ... */ });