Static bitmap text
Introduction¶
Drawing text by texture, built-in game object of phaser.
Author: Phaser Team
Usage¶
Load bitmap font¶
Load bitmap font from texture and xml configuration
scene.load.bitmapFont(key, textureURL, xmlURL);
Reference: load bitmap font
Loaded texture also can be used for Image, Sprite, or Arcade Image, Arcade Sprite
scene.add.image(x, y, key, char);
Load retro bitmap font from texture and JSON configuration
Load texture in preload stage
scene.load.image(key, url);
Reference: load image
Add retro bitmap font
var config = {
// image
image: '',
offset: {
x: 0,
y: 0
},
// characters
width: 32,
height: 32,
chars: '',
charsPerRow: 10,
// spacing
spacing: {
x: 0,
y: 0
},
lineSpacing: 0
}
scene.cache.bitmapFont.add(key, Phaser.GameObjects.RetroFont.Parse(scene, config));
Image :
image : The key of the image containing the font.
offset : If the font set doesn't start at the top left of the given image, specify the X/Y coordinate offset here.
Characters :
width : The width of each character in the font set.
height : The height of each character in the font set.
chars : The characters used in the font set, in display order.
Default characters set
charsPerRow : The number of characters per row in the font set. If not given charsPerRow will be the image width / characterWidth.
Spacing :
spacing : If the characters in the font set have horizontal/vertical spacing between them set the required amount here.
lineSpacing : The amount of vertical space to add to the line height of the font.
Add bitmap text object¶
var txt = scene.add.bitmapText(x, y, key, text);
// var txt = scene.add.bitmapText(x, y, key, text, size, align);
size : The size of the font
align : The alignment of the text in a multi-line BitmapText object.
0 : Left aligned (default)
1 : Middle aligned
2 : Right aligned
Add text from JSON
var txt = scene.make.bitmapText({
x: 0,
y: 0,
text: 'Text\nGame Object\nCreated from config',
font: '',
size: false,
align: 0,
// origin: {x: 0.5, y: 0.5},
add: true
});
Custom class¶
Define class
class MyText extends Phaser.GameObjects.BitmapText {
constructor(scene, x, y, key, text, size, align) {
super(scene, x, y, key, text, size, align);
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
var txt = new MyText(scene, x, y, key, text);
Set text¶
txt.setText('...');
or
txt.text = '...';
Set align¶
Left aligned
txt.setLeftAlign();
Middle aligned
txt.setCenterAlign();
Right aligned
txt.setRightAlign();
or
txt.align = align;
align :
0 : Left aligned (default)
1 : Middle aligned
2 : Right aligned
Set letter spacing¶
txt.setLetterSpacing(spacing);
or
txt.letterSpacing = spacing;
Can be a positive value to increase the space, or negative to reduce it.
Set line spacing¶
txt.setLineSpacing(spacing);
or
txt.lineSpacing = spacing;
Can be a positive value to increase the space, or negative to reduce it.
Set font size¶
txt.setFontSize(size);
or
txt.fontSize = size;
Set font¶
txt.setFont(key);
// txt.setFont(key, size, align);
Tint¶
See Tint.
Color of characters¶
By character
txt.setCharacterTint(start, length, tintMode, color);
// txt.setCharacterTint(start, length, tintMode, topLeft, topRight, bottomLeft, bottomRight);
start : Index starting character.
< 0 : Counts back from the end of the text.
length : Number of characters to tint.
-1 : All characters from start
tintMode :
true : Fill-based tint
false : Additive tint
color, or topLeft, topRight, bottomLeft, bottomRight : Color integer.
By word
txt.setWordTint(word, count, tintMode, color);
// txt.setWordTint(word, count, tintMode, topLeft, topRight, bottomLeft, bottomRight);
word : The word to search for.
A string
An index of the word in the words array.
count : Number of matching words to tint.
-1 : All matching words
tintMode :
true : Fill-based tint
false : Additive tint
color, or topLeft, topRight, bottomLeft, bottomRight : Color integer.
Drop shadow effect¶
txt.setDropShadow(x, y, color, alpha);
or
txt.dropShadowX = x;
txt.dropShadowY = y;
txt.dropShadowColor = color;
txt.dropShadowAlpha = alpha;
x, y : The horizontal/vertical offset of the drop shadow.
color : The color of the drop shadow.
alpha : The alpha of the drop shadow.
Note
WebGL only
Wrap¶
Wrap
txt.setMaxWidth(width);
// txt.setMaxWidth(width, wordWrapCharCode);
width : Line width in pixels.
wordWrapCharCode : The character code to check for when word wrapping. Defaults to 32 (the space character)
Disable wrapping
txt.setMaxWidth(0);
Get bounds¶
var width = txt.width;
var height = txt.height;
or
var bounds = txt.getTextBounds(round);
// bounds = {
//     local: {
//         x: 0,
//         y: 0,
//         width: 0,
//         height: 0
//     },
//     global: {
//         x: 0,
//         y: 0,
//         width: 0,
//         height: 0
//     },
//     lines: {
//         shortest: 0,
//         longest: 0,
//         lengths: null,
//         height: 0
//     },
//     wrappedText: '',
//     words: [],
//     characters: [],
//     scaleX: 0,
//     scaleY: 0
// };
round : Set true to round the results to the nearest integer.
local : The BitmapText based on fontSize and 0x0 coords.
global : The BitmapText, taking into account scale and world position.
lines : The BitmapText line data.
wrappedText : Wrapped content joined with '\n'.
characters : Information of each character.
{
char, code, i, idx, x, y, w, h, t, b, r, line
}
char : Character (string).
code: Character code (number)
i : Index of character
x , y : World position of this character
w, h : Width/height of this character
t, b : The top/bottom of the line this character is on.
r : The right-most point of this character, including xAdvance.
line : The line number the character appears on.
words : Information of each word.
{
word, i, x, y, w, h, cr
}
word : Word string.
i : Index of start character
x, y : World position of start character
w , h : Width/height of word
cr : Is last word of current line
scaleX, scaleY : Scale of width and height.
Get information of character¶
var data = txt.getCharacterAt(x, y);
// var data = txt.getCharacterAt(x, y, camera);
x, y : World position.
camera : The Camera which is being tested against.
data : Information of character at world position.
{
char, code, i, x, y, w, h, t, b, r, line
}
char : Character (string).
code: Character code (number)
i : Index of character
x , y : World position of this character
w, h : Width/height of this character
t, b : The top/bottom of the line this character is on.
r : The right-most point of this character, including xAdvance.
line : The line number the character appears on.
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters
Appendix¶
Default characters set of retro font¶
Phaser.GameObjects.RetroFont.TEXT_SET1 :
' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'
Phaser.GameObjects.RetroFont.TEXT_SET2 :
' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ'
Phaser.GameObjects.RetroFont.TEXT_SET3 :
'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 '
Phaser.GameObjects.RetroFont.TEXT_SET4 :
'ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789'
Phaser.GameObjects.RetroFont.TEXT_SET5 :
'ABCDEFGHIJKLMNOPQRSTUVWXYZ.,/() \'!?-*:0123456789'
Phaser.GameObjects.RetroFont.TEXT_SET6 :
'ABCDEFGHIJKLMNOPQRSTUVWXYZ!?:;0123456789"(),-.\' '
Phaser.GameObjects.RetroFont.TEXT_SET7 :
'AGMSY+:4BHNTZ!;5CIOU.?06DJPV,(17EKQW")28FLRX-\'39'
Phaser.GameObjects.RetroFont.TEXT_SET8 :
'0123456789 .ABCDEFGHIJKLMNOPQRSTUVWXYZ'
Phaser.GameObjects.RetroFont.TEXT_SET9 :
'ABCDEFGHIJKLMNOPQRSTUVWXYZ()-0123456789.:,\'"?!'
Phaser.GameObjects.RetroFont.TEXT_SET10 :
'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
Phaser.GameObjects.RetroFont.TEXT_SET11 :
'ABCDEFGHIJKLMNOPQRSTUVWXYZ.,"-+!?()\':;0123456789'