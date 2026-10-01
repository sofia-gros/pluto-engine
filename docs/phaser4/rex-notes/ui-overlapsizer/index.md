Overlap sizer
Introduction¶
Layout children game objects overlapped.
Author: Rex
Game object
Live demos¶
Overlap
Aspect ratio
Fit viewport
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
Add sizer object
var sizer = scene.rexUI.add.overlapSizer(config);
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
Add sizer object
var sizer = scene.rexUI.add.overlapSizer(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { OverlapSizer } from 'phaser4-rex-plugins/templates/ui/ui-components.js';
Add sizer object
var sizer = new OverlapSizer(scene, config);
scene.add.existing(sizer);
Add sizer object¶
var sizer = scene.rexUI.add.overlapSizer({
// x: 0,
// y: 0,
// anchor: undefined,
// width: undefined,
// height: undefined,
// origin: 0.5
// originX:
// originY:
// space: { left: 0, right:0, top:0, bottom:0 },
// name: '',
// draggable: false,
// sizerEvents: false,
// enableLayer: false,
});
or
var sizer = scene.rexUI.add.overlapSizer(x, y, {
// width: undefined,
// height: undefined,
// anchor: undefined,
// origin: 0.5
// originX:
// originY:
// space: { left: 0, right:0, top:0, bottom:0 },
// name: '',
// draggable: false,
// sizerEvents: false,
// enableLayer: false,
});
or
var sizer = scene.rexUI.add.overlapSizer(x, y, width, height, {
// anchor: undefined,
// origin: 0.5
// originX:
// originY:
// space: { left: 0, right:0, top:0, bottom:0 },
// name: '',
// draggable: false,
// sizerEvents: false,
// enableLayer: false,
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
space : Pads spaces.
space.left, space.right, space.top, space.bottom : Space of bounds.
name : Set name of this game object.
draggable : Set true to drag top-most object.
sizerEvents : Set true to fire sizer events. Default value is false.
enableLayer :
false : Add child game objects into scene's display list. Default behavior.
true : Add child game objects into an internal layer game object. See also.
Custom class¶
Define class
class MySizer extends RexPlugins.UI.OverlapSizer {
constructor(scene, x, y, minWidth, minHeight, config) {
super(scene, x, y, minWidth, minHeight, config);
// ...
scene.add.existing(this);
}
// ...
}
Create instance
var sizer = new MySizer(scene, x, y, minWidth, minHeight, config);
Add background¶
sizer.addBackground(child);
or
sizer.addBackground(child, {left: 0, right: 0, top: 0, bottom: 0}, key);
left, right, top, bottom : Extra padded space. Default is 0.
key : Add this child into childMap, which could be read back by sizer.getElement(key).
undefined : Don't add this child. Default value.
items is a reserved key, which is used to store all children.
Add child¶
Add a game obejct to sizer
sizer.add(child);
or
sizer.add(child,
{
key: undefined,
align: 'center',
offsetX: 0,
offsetY: 0,
offsetOriginX: 0,
offsetOriginY: 0,
padding: {left: 0, right: 0, top: 0, bottom: 0},
expand: true,        // expand: {width, height}
minWidth: undefined,
minHeight: undefined,
aspectRatio: 0,
}
);
or
sizer.add(child, key, align, padding, expand, minWidth, minHeight, offsetX, offsetY);
child : A game object.
key : Add this child into childMap, which could be read back by sizer.getElement(key).
undefined : Use current timestamp as key.
items is a reserved key, which is used to store all children.
align :
'center', or Phaser.Display.Align.CENTER : Align game object at center. Default value.
'left', or Phaser.Display.Align.LEFT_CENTER : Align game object at left-center.
'right', or Phaser.Display.Align.RIGHT_CENTER : Align game object at right-center.
'top', or Phaser.Display.Align.RIGHT_CENTER : Align game object at top-center.
'bottom', or Phaser.Display.Align.BOTTOM_CENTER : Align game object at bottom-center.
'left-top' , or Phaser.Display.Align.TOP_LEFT : Align game object at left-top.
'left-center' , or Phaser.Display.Align.LEFT_CENTER : Align game object at left-center.
'left-bottom' , or Phaser.Display.Align.BOTTOM_LEFT : Align game object at left-bottom.
'center-top' , or Phaser.Display.Align.TOP_CENTER : Align game object at center-top.
'center-center' , or Phaser.Display.Align.CENTER : Align game object at center-center.
'center-bottom' , or Phaser.Display.Align.BOTTOM_CENTER : Align game object at center-bottom.
'right-top' , or Phaser.Display.Align.TOP_RIGHT : Align game object at right-top.
'right-center' , or Phaser.Display.Align.RIGHT_CENTER : Align game object at right-center.
'right-bottom' , or Phaser.Display.Align.BOTTOM_RIGHT : Align game object at right-bottom.
offsetX, offsetOriginX : Apply offset offsetX + offsetOriginY * width to x coordinate after alignment.
offsetY, offsetOriginY : Apply offset offsetY + offsetOriginY * height to y coordinate after alignment.
padding : Extra padded space. Default is 0.
A number for left/right/top/bottom bounds,
Or a plain object.
{
left: 0,
right: 0,
top: 0,
bottom: 0
}
expand :
true, or 1 : Expand width and height of child. Default value.
false, or 0 : Keep current width and height of child.
Other number value : Expand width and height of child via parent.width * expand and parent.height * expand
A plain object, to expand width or height separately
{
width: false,
height: false
}
width, height :
true, or 1 : Expand width and height of child.
false, or 0 : Keep current width and height of child. Default value.
Other number value : Expand width and height of child via parent.width * expand and parent.height * expand
minWidth : Minimum width of normal (non-sizer) game object, used when expand width mode. Default value is current display width.
minHeight : Minimum height of normal (non-sizer) game object, used when expand height mode. Default value is current display height.
aspectRatio : Keep aspect ratio after layout.
0 : Don't keep aspect ratio. Default behavior.
true : Keep aspect ratio via current size.
A number : Keep aspect ratio via given value.
Add multiple¶
sizer.add(gameObjects, config);
gameObjects : Array of child game objects
config : See config of add-child
Layout children¶
Arrange position of all children.
sizer.layout();
See also - dirty
Hide¶
Set invisible, won't layout it
sizer.hide();
or
sizer.hide(gameObject);
Set visible, will layout it
sizer.show();
or
sizer.show(gameObject);
Remove child¶
Remove a child
sizer.remove(child);
or
sizer.remove(key);
Remove and destroy a child
sizer.remove(child, true);
or
sizer.remove(key, true);
Remove all children
sizer.removeAll();
Remove and destroy all children
sizer.removeAll(true);
Remove all children and backgrounds
sizer.clear();
Remove and destroy all children and backgrounds
sizer.clear(true);
Remove from parent sizer
sizer.removeFromParentSizer();
Get element¶
Get element
A child
var item = sizer.getElement(key);
or
var item = sizer.getElement('items[' + key + ']');
All children items
var items = sizer.getElement('items');
Get by name
var gameObject = sizer.getElement('#' + name);
// var gameObject = sizer.getElement('#' + name, recursive);
or
var gameObject = sizer.getByName(name);
// var gameObject = sizer.getByName(name, recursive);
recursive : Set true to search all children recursively.
Get child index¶
var index = sizer.getChildIndex(child);
index : A number, string, or null.
Other properties¶
See base sizer object, container-lite.