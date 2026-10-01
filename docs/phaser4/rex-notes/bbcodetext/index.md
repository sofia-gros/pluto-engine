BBCode Text
Introduction¶
Drawing text with BBCode protocol.
Author: Rex
Game object
Live demos¶
BBCode text
Hit area
Hit area of words
Get hit area by world position
Align
Escape
Page, typing
Wrap
Mix wrap
Font family
Measure margin of text
Generate texture
Image
Image height
Altas image
RTL
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexbbcodetextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js', true);
Add text object
var txt = scene.add.rexBBCodeText(x, y, content, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import BBCodeTextPlugin from 'phaser4-rex-plugins/plugins/bbcodetext-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexBBCodeTextPlugin',
plugin: BBCodeTextPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add text object
var txt = scene.add.rexBBCodeText(x, y, content, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import BBCodeText from 'phaser4-rex-plugins/plugins/bbcodetext.js';
Add text object
var txt = new BBCodeText(scene, x, y, content, config);
scene.add.existing(txt);
BBCode¶
Bold : [b]text[/b]
Weight : [weight=900]text[/weight]
Valid when text does not have bold tag.
Italic : [i]text[/i]
Color :
[color=red]text[/color]
[color=#FF0000]text[/color]
[color=rgb(255,0,0)]text[/color]
[color=rgba(255,0,0,1)]text[/color]
Size : [size=18]text[/size]
Family : [family=papyrus]text[/family]
Stroke : [stroke]text[/stroke]
Stroke with color setting : [stroke=red]text[/stroke]
Shadow : [shadow]text[/shadow]
Shadow with color setting : [shadow=red]text[/shadow]
Underline : [u]text[/u]
Underline with color setting : [u=red]text[/u]
Strikethrough : [s]text[/s]
Strikethrough with color setting : [s=red]text[/s]
Background color :
[bgcolor=red]text[/bgcolor]
[bgcolor=#FF0000]text[/bgcolor]
[bgcolor=rgb(255,0,0)]text[/bgcolor]
[bgcolor=rgba(255,0,0,1)]text[/bgcolor]
Superscript, subscript : [y=-12]text[y]
Letter spacing : [spacing=10]text[/spacing]
Image : [img=imgKey]
Hit area of words : [area=key]text[/area]
Url link : [url=http...]text[/url]
Click this area to open web page on a new tab (window.open(url, '_blank'))
Will register hit area with key url:http...
Line alignment :
[align=left]text[/align],
[align=center]text[/align],
[align=right]text[/align]
Escape : Tags between [esc] ... [/esc] or [raw] ... [/raw] will be treated as content.
[esc][color=yellow]Text[/color][/esc]
[esc][raw]Text[/raw][/esc]
[raw][esc]Text[/esc][/raw]
[raw][b]Text[/b][/raw]
Do nothing, just a marker :
[id=0][color=red]Text[/id]TextText[/color]
Note
Can set delimiter [] to another custom value in style of constructor.
Add text object¶
var txt = scene.add.rexBBCodeText(x, y, '[b]h[/b]ello');
// var txt = scene.add.rexBBCodeText(x, y, '[b]h[/b]ello', { fontFamily: 'Arial', fontSize: 64, color: '#00ff00' });
Default style
{
fontFamily: 'Courier',
fontSize: '16px',
backgroundColor: null,  // null, css string, or number
backgroundColor2: null,  // null, css string, or number
backgroundHorizontalGradient: true,
backgroundStrokeColor: null,  // null, css string, or number
backgroundStrokeLineWidth: 2,
backgroundCornerRadius: 0,
// 0   : no round corner,
// > 0 : convex round corner
// < 0 : concave round corner
backgroundCornerIteration: null,
color: '#fff',  // null, css string, or number
stroke: '#fff',  // null, css string, or number
strokeThickness: 0,
shadow: {
offsetX: 0,
offsetY: 0,
color: '#000',  // css string, or number
blur: 0,
stroke: false,
fill: false
},
underline: {
color: '#000',  // css string, or number
thickness: 0,
offset: 0
},
strikethrough: {
color: '#000',  // css string, or number
thickness: 0,
offset: 0
},
// align: 'left',  // Equal to halign
halign: 'left', // 'left'|'center'|'right'
valign: 'top',  // 'top'|'center'|'bottom'
padding: {
left: 0,
right: 0,
top: 0,
bottom: 0,
},
maxLines: 0,
lineSpacing: 0,
letterSpacing: 0,
fixedWidth: 0,
fixedHeight: 0,
fixedLineHeightMode: true,
testString: '|MÉqgy',
wrap: {
mode: 'none',     // 0|'none'|1|'word'|2|'char'|'character'|3|'mix'
width: null
},
// wordWrap: { width: 0 },   // Compatible with Text game object
// rtl: false,
metrics: false,
// metrics: {
//     ascent: 0,
//     descent: 0,
//     fontSize: 0
// },
// images: {
//     imgKey: {y: -8}
// },
// delimiters: '[]',
// sharedPool: true,
// urlTagCursorStyle: 'pointer',
// interactive: false
}
or
var txt = scene.add.rexBBCodeText({
x: 0,
y: 0,
text: '',
style: {
fontSize: '64px',
fontFamily: 'Arial',
color: '#ffffff',
align: 'center',
backgroundColor: '#ff00ff',
// ...
},
})
or
var txt = scene.make.rexBBCodeText({
x: 0,
y: 0,
padding: {
left: 0,
right: 0,
top: 0,
bottom: 0
//x: 32,    // 32px padding on the left/right
//y: 16     // 16px padding on the top/bottom
},
text: 'Text\nGame Object\nCreated from config',
style: {
fontSize: '64px',
fontFamily: 'Arial',
color: '#ffffff',
align: 'center',
backgroundColor: '#ff00ff',
// ...
},
// origin: {x: 0.5, y: 0.5},
add: true
});
Alignment
halign, or align : Horizontal alignment.
'left', 'center', 'right'
valign : Vertical alignment.
'top', 'center', 'bottom'
images : See Image
delimiters : Delimiters of tags, default value is [].
Don't use () as delimiters, which is preserved for color value.
sharedPool :
true : Use shared resouce pools during game. Default behavior.
false : Use local resource pools, will be free when game object destroying.
urlTagCursorStyle : Cursor style when cursor moving over a url tag. Default value is 'pointer'.
interactive :
true : Invoke txt.setInteractive() for hit-area tag, or url tag.
false : Do nothing. Default behavior.
Custom class¶
Define class
class MyText extends BBCodeText {
constructor(scene, x, y, text, style) {
super(scene, x, y, text, style);
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
var txt = new MyText(scene, x, y, '[b]h[/b]ello');
Wrap¶
Wrap by word or character.
var txt = scene.make.rexBBCodeText({
x: 400,
y: 100,
text: 'The sky above the port was the color of television, tuned to a dead channel.',
origin: { x: 0.5, y: 0.5 },
style: {
font: 'bold 25px Arial',
fill: 'white',
wrap: {
mode: 'none',    // 0|'none'|1|'word'|2|'char'|'character'|3|'mix'
width: 0
}
}
});
wrap.mode :
0, or 'none' : No wrapping, default behavior.
1, or 'word' : Word wrapping.
2, or 'char', or 'character' : Character wrapping.
3, or 'mix' : Word wrapping for ASCII word, Character wrapping for other (unicode) word.
wrap.width : Maximun wrapping width of a line.
Wrap-fit : Set wrapping width to fixedWidth - padding.left - padding.right if fixedWidth > 0
Wrap mode
Get
var mode = txt.style.wrapMode;
Set
txt.setWrapMode(mode);
0, or 'none' : No wrapping.
1, or 'word' : Word wrapping.
2, or 'char', or 'character' : Character wrapping.
3, or 'mix' : Word wrapping for ASCII word, Character wrapping for other (unicode) word.
Wrap width
Get
var width = txt.style.wrapWidth;
Set
txt.setWrapWidth(width);
// txt.setWordWrapWidth(width);
width : Maximun wrapping width of a line.
Wrap-fit : Set wrapping width to fixedWidth - padding.left - padding.right if fixedWidth > 0
Content¶
Get source text
var curContent = txt.text;
Get plain text
var plainText = txt.getPlainText();
var plainText = txt.getPlainText(content);
Get sub-string
var text = txt.getText(start, end);
Get wrapped lines
var linesArray = txt.getWrappedText();
var linesArray = txt.getWrappedText(content);
Set
txt.setText('[b]h[/b]ello');
// txt.text = '[b]h[/b]ello';
Append
txt.appendText(text);
// txt.text += '\n' + text;
or
txt.appendText(text, false);
// txt.text += text;
Set style¶
txt.setStyle(style);
txt.setFont(font);  // font: {fontFamily, fontSize}
txt.setFontFamily(family);
txt.setFontSize(size);
txt.setFontStyle(style);
Color¶
Text color
Get
var color = txt.style.color;
Set
txt.setColor(color);
or
txt.setFill(color);
color : null, css string, or number.
Stroke color, thickness
Get
var color = txt.style.stroke;
var thickness = txt.style.strokeThickness;
Set
txt.setStroke(color, thickness);
color : null, css string, or number.
Clear
txt.setStroke();
Underline color, thickness
Get
var color = txt.style.underlineColor;
var thickness = txt.style.underlineThickness;
var offset = txt.style.underlineOffset;
Set
txt.setUnderline(color, thickness, ofset);
txt.setUnderlineColor(color);
txt.setUnderlineThinkness(thickness);
txt.setUnderlineOffset(ofset);
color : null, css string, or number.
Strikethrough color, thickness
Get
var color = txt.style.strikethroughColor;
var thickness = txt.style.strikethroughThickness;
var offset = txt.style.strikethroughOffset;
Set
txt.setStrikethrough(color, thickness, ofset);
txt.setStrikethroughColor(color);
txt.setStrikethroughThinkness(thickness);
txt.setStrikethroughOffset(ofset);
color : null, css string, or number.
Background
Color, or gradient color
Get
var color = txt.style.backgroundColor;
var color2 = txt.style.backgroundColor2;
var isHorizontalGradient = txt.style.backgroundHorizontalGradient;
Set
txt.setBackgroundColor(color);
// txt.setBackgroundColor(color, color2, isHorizontalGradient);
color, color2 : null, css string, or number.
Stroke color
Get
var color = txt.style.backgroundStrokeColor;
var lineWidth = txt.style.backgroundStrokeLineWidth;
Set
txt.setBackgroundStrokeColor(color, lineWidth);
color : null, css string, or number.
Round rectangle
Get
var radius = txt.style.backgroundCornerRadius;
var iteration = txt.style.backgroundCornerIteration;
radius :
0  : No round corner
> 0 : Convex round corner
< 0 : Concave round corner
Set
txt.setBackgroundCornerRadius(radius);
// txt.setBackgroundCornerRadius(radius, iteration);
iteration :
undefined : Round rectangle
0 : Octagon
Shadow
Get
var color = txt.style.shadowColor;
var offsetX = txt.style.shadowOffsetX;
var offsetY = txt.style.shadowOffsetY;
var blur = txt.style.shadowBlur;
var stroke = txt.style.shadowStroke;
var enabled = txt.style.shadowFill;
Set
txt.setShadow(x, y, color, blur, shadowStroke, shadowFill);
txt.setShadowOffset(x, y);
txt.setShadowColor(color);
txt.setShadowBlur(blur);
txt.setShadowStroke(enabled);
txt.setShadowFill(enabled);
color : null, css string, or number.
Align¶
Horizontal align
Get
var align = txt.style.halign;
align : 'left', 'center', 'right'
Set
txt.setHAlign(align);
or
txt.setAlign(align);
align : 'left', 'center', 'right'
Vertical align
Get
var align = txt.style.valign;
align : 'top', 'center', 'bottom'
Set
txt.setVAlign(align);
align : 'top', 'center', 'bottom'
Image¶
Uses texture key as image key by default.
Add image render information
txt.addImage(imgKey, {
key: textureKey,
frame: frameName,
width: undefined,
height: undefined,
y: 0,
left: 0,
right: 0,
originX: 0,
originY: 0,
tintFill: false,
tintMode: undefined,
});
imgKey : Image key used in text content, i.e. [img=imgKey].
key : Texture key.
frame : Frame name.
width : Render width, set undefined to use the cut width of frame.
height : Render height, set undefined to use the cut height of frame.
y : Extra offset y.
left : Left padding space.
Right : Right padding space.
originX : Offset x via frame width * originX
originY : Offset y via frame height * originY
tintFill :
false : Keep original color. Default behavior.
true : Change fill-color by color tag. [color=...][img=...].
tintMode : Tint mode used when applying color tag to image. It replaces tintFill when set.
undefined : Keep original color. Default behavior.
true : Use Phaser.TintModes.FILL.
Phaser.TintModes.MULTIPLY
Phaser.TintModes.FILL
Phaser.TintModes.ADD
Phaser.TintModes.SCREEN
Phaser.TintModes.OVERLAY
Phaser.TintModes.HARD_LIGHT
Add some image render informations
txt.addImage(data);
data : {imgKey, config}
Hit area of words¶
Size of hit-area is word-width x line-height, or image-width x line-height.
Hitting events¶
Pointer down
txt.on('areadown', function(key, pointer, localX, localY, event){
}, scope)
or
txt.on('areadown-' + key, function(pointer, localX, localY, event){
}, scope)
Pointer click : pointer down then up, without pointer out
txt.on('areaclick', function(key, pointer, localX, localY, event){
}, scope)
or
txt.on('areaclick-' + key, function(pointer, localX, localY, event){
}, scope)
Pointer up
txt.on('areaup', function(key, pointer, localX, localY, event){
}, scope)
or
txt.on('areaup-' + key, function(pointer, localX, localY, event){
}, scope)
Pointer over
txt.on('areaover', function(key, pointer, localX, localY, event){
}, scope)
or
txt.on('areaover-' + key, function(pointer, localX, localY, event){
}, scope)
Pointer out
txt.on('areaout', function(key, pointer, localX, localY, event){
}, scope)
or
txt.on('areaout-' + key, function(pointer, localX, localY, event){
}, scope)
Draw hit-areas¶
txt.drawAreaBounds(graphics, color);
graphics : Graphics game object
color : Default value is 0xffffff
Get hit area by world position¶
var key = txt.getHitArea(worldX, worldY);
// var key = txt.getHitArea(worldX, worldY, camera);
camera : Camera of world position
undefined : Use default camera (scene.cameras.main)
Line spacing¶
This value is added to the height of the font when calculating the overall line height.
Get
var lineSpacing = txt.style.lineSpacing;
Set
txt.setLineSpacing(value);
Letter spacing¶
Spacing between characters.
Get
var letterSpacing = txt.style.letterSpacing;
Set
txt.setLetterSpacing(value);
Padding¶
Get
var left = txt.padding.left;
var top = txt.padding.top;
var right = txt.padding.right;
var bottom = txt.padding.bottom;
Set
txt.setPadding(left, top, right, bottom);
// txt.setPadding(padding); // padding: {left, top, right, bottom}
Max lines¶
Get
var maxLines = txt.style.maxLines;
Set
txt.setMaxLines(max);
Fixed size¶
Get
var width = txt.style.fixedWidth;
var height = txt.style.fixedHeight;
Set
txt.setFixedSize(width, height);
Scroll¶
Get
var t = txt.t;
var scrollY = txt.scrollY;
var top = txt.topScrollY;
var bottom = txt.bottomScrollY;
Set
txt.setT(0.5);        // normalized
txt.addT(0.1);
txt.setScrollY(-100); // pixels
txt.addScrollY(-20);
txt.scrollToTop();
txt.scrollToBottom();
Margin of text¶
var leftMargin = txt.measureTextMargins(testString).left;
testString : Measure left margin of this text.
Shift start position of text¶
txt.setXOffset(value);
Resolution¶
Get
var resolution = txt.style.resolution;
Set
txt.setResolution(resolution);
Test string¶
Set the test string to use when measuring the font.
txt.setTestString(text);
Save texture¶
txt.generateTexture(key);
// txt.generateTexture(key, x, y, width, height);
Delimiters¶
txt.setDelimiters(delimiters);  // '<>', or ['<', '>']
or
txt.setDelimiters(delimiterLeft, delimiterRight); // '<', '>'
Warning
Don't use () as delimiters, which is preserved for color value.
RTL¶
Set rtl in style config when creating this text game object
Change rtl during runtime
txt.setRTL(rtl).setText(newContent);
Invoke setRTL method before setting new content.
Cursor style¶
Set cursor of hit-area:
txt.setUrlTagCursor(cursorStyle)
txt.setHitAreaCursor(key, cursorStyle)
txt.setDefaultHitAreaCursor(cursorStyle)
Priority:
Check url cursor stle
Check hit area cursor style by tag
Use default cursor style
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters