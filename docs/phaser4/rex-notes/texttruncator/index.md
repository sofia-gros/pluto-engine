Truncator
Introduction¶
Constraints text game object size by truncating text with padding symbol on text object, bbcode text object, or tag text object.
Author: Rex
Behavior of text object
Live demos¶
Truncate text
Truncate BBCodeText
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rextexttruncatorplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexttruncatorplugin.min.js', true);
Add text-truncator behavior
var truncator = scene.plugins.get('rextexttruncatorplugin').add(textGameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import TextTruncatorPlugin from 'phaser4-rex-plugins/plugins/texttruncator-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexTextTruncator',
plugin: TextTruncatorPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add text-truncator behavior
var truncator = scene.plugins.get('rexTextTruncator').add(textGameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import TextTruncator from 'phaser4-rex-plugins/plugins/texttruncator.js';
Add text-truncator behavior
var truncator = new TextTruncator(textGameObject, config);
Create instance¶
var truncator = scene.plugins.get('rexTextTruncator').add(textGameObject, {
// enable: true,
// symbol: '...',
// maxWidth: undefined,
// maxHeight: undefined,
// text: '',              // content in string or array
});
textObject : Text object, bbcode text object, tag text object, or bitmap text object
enable :
true : Truncate string with padding symbol. Default value.
false : Display all text.
symbol : Padding symbol. Default value is '...'
maxWidth : Maximum width of game object, for single-line mode.
undefined : Use fixedWidth as maximum width.
maxHeight : Maximum height of game object, for multiple-line mode.
undefined : Use fixedHeight as maximum height.
text : content in string or array, optional
Truncation modes¶
Single-line mode :
maxHeight or fixedHeight are not given, or 0
Have maxWidth or fixedWidth
Multiple-line mode
Have fixedWidth or wordWrap.width (wrap-width)
Have maxHeight or fixedHeight
Set content¶
Set content
truncator.setText(content);
content : String, number, or string array.
Append content
truncator.appendText(content);
content : String, number, or string array.
Will update displaying content.
Get content back
var text = truncator.text;
Update display content¶
truncator.updateText();
Set enable¶
truncator.setEnable(enable).updateText();
Set paddding symbol¶
truncator.setSymbol(symbol).updateText();
Set max size¶
Max width
Set
truncator.setMaxWidth(width).updateText();
Get
var width = truncator.maxWidth;
Max height
Set
truncator.setMaxHeight(height).updateText();
Get
var height = truncator.maxHeight;