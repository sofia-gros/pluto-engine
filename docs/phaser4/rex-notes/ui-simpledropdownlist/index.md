Simple drop down list
Introduction¶
Using plain object to create drop down list.
Author: Rex
Game object
Live demos¶
Drop-down list
Drop-down scrollable-list
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
Add drop-down list object
var dropDownList = scene.rexUI.add.simpleDropDownList(config);
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
Add drop-down list object
var dropDownList = scene.rexUI.add.simpleDropDownList(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { DropDownList } from 'phaser4-rex-plugins/templates/ui/ui-components.js';
Add dropDownList object
var dropDownList = new SimpleDropDownList(scene, config);
scene.add.existing(dropDownList);
Add drop-down list object¶
var dropDownList = scene.rexUI.add.simpleDropDownList({
label: labelStyle,
button: buttonStyle,
track: backgroundStyle,
thumb: backgroundStyle,
list: {
// easeIn: 500,
// transitIn: undefined,
// transitIn: function(listPanel, duration) {  },
// easeOut: 100,
// transitOut: undefined,
// transitOut: function(listPanel, duration) {  },
// wrap: false,
// maxHeight: undefined,
// width: undefined,
// height: undefined,
// alignParent: 'text',
// alignSide: '',
// expandDirection: 0,
// bounds: undefined,
// space: {
//     left: 0, right: 0, top: 0, bottom: 0, item: 0,
//     line: 0
// },
// draggable: false
}
}, creators);
label :
Styles of simple-label
button : Use label parameter if button parameter is not given.
Styles of simple-label
track, thumb :
Styles of background
list : Configuration of list panel.
list.easeIn : Pop-up duration in ms. Default value is 500.
list.transitIn : Tween behavior of opening list panel.
undefined : Expand list panel by pop-up, default behavior.
Custom callback
function(listPanel, duration) {
}
list.easeOut : Scale-down duration in ms. Default value is 100.
list.transitOut : Tween behavior of closing list panel.
undefined : Closing list panel by scale-down, default behavior.
Custom callback
function(listPanel, duration) {
}
list.wrap :
true : fixwidth-sizer layout, a row within buttons.
false : sizer layout, a row within a button. Default behavior.
list.maxHeight : If height of button list is larger than this maxHeight, put this button list into scrollable panel.
undefined, or 0 : Ignore this behavior.
> 0 and list.createThumbCallback parameter is given : If height of button list is larger than this maxHeight, put this button list into scrollable panel.
list.width : Minimum width.
undefined : Minimum width of panel will equal to width of parent label. Default value.
A number : Width of panel. Required fields when list.wrap is true.
list.height : Minimum height.
undefined : Create button list or wrap button list. Default value.
> 0 and thumb parameter is given : Create scrollable button list or wrap button list.
list.alignParent : Align x position to label.
'icon' : Align x position to icon game object of parent label.
'text' : Align x position to text game object of parent label. Default behavior
'label', or null : Align x position to parent label.
list.alignSide : Align list to label's left or right side.
undefined, or 'left' : Align list's left side to label's left side. Default behavior.
'right : Align list's right side to label's right side. Default behavior.
list.expandDirection :
0, 'down' : Expand list down. i.e. list panel will put below parent label.
1, 'up' : Expand list up. i.e. list panel will put above parent label.
list.bounds : Put list panel below parent label if bottom of list panel is inside bounds (Rectangle)
undefined : Use viewport as bounds
Rectangle
list.space : space properties of list panel.
left, right, top, bottom, item : For sizer layout. (list.wrap is false)
left, right, top, bottom, item, line : For fixwidth-sizer layout. (list.wrap is true)
list.draggable : Set true to drag top-most object.
name : Set name of this game object.
draggable : Set true to drag top-most object.
sizerEvents : Set true to fire sizer events. Default value is false.
enableLayer :
false : Add child game objects into scene's display list. Default behavior.
true : Add child game objects into an internal layer game object. See also.
Custom class¶
Define class
class MyDropDownList extends RexPlugins.UI.SimpleDropDownList {
constructor(scene, config) {
super(scene, config);
// ...
scene.add.existing(this);
}
// ...
}
Create instance
var dropDownList = new MyDropDownList(scene, config);
Options¶
Set
dropDownList.setOptions(options);
or
dropDownList.options = options;
options : Array of strings, or objects contains these properties.
{
text: string,
value: any
}
Get
var options = dropDownList.options;
Other properties¶
See drop-down list, label, sizer object, base sizer object, container-lite.
Events¶
See Events section of drop-down list