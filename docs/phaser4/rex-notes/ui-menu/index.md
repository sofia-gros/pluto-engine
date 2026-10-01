Menu
Introduction¶
A container with buttons and sub-menu.
Author: Rex
Game object
Live demos¶
Pop-up menu
Static menu
Drop-down list
Expand, collapse
Custom transit
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
Add menu object
var menu = scene.rexUI.add.menu(config);
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
Add menu object
var menu = scene.rexUI.add.menu(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { Menu } from 'phaser4-rex-plugins/templates/ui/ui-components.js';
Add menu object
var menu = new Menu(scene, config);
scene.add.existing(menu);
Add menu object¶
var menu = scene.rexUI.add.menu({
// x: 0,
// y: 0,
// anchor: undefined,
// popup: true,
// orientation: 1,
// subMenuSide: undefined,
items: [],
createBackgroundCallback: function(items) {
var scene = items.scene;
// background = ...
return background;
},
createBackgroundCallbackScope: undefined,
createButtonCallback: function(item, index, items) {
var scene = item.scene;
// var isFirstButton = (index === 0);
// var isLastButton = (index === (items.length - 1));
// container = ...
return container;
},
createButtonCallbackScope: undefined,
easeIn: 0,
// easeIn: {
//     duration: 500,
//     orientation: undefined,
//     ease: 'Cubic'
// },
transitIn: undefined,
// transitIn: function(menu, duration) {  },
easeOut: 0,
// easeOut: {
//     duration: 100,
//     orientation: undefined,
//     ease: 'Linear'
// },
transitOut: undefined,
// transitOut: function(menu, duration) {  },
// expandEvent: 'button.click',
// pointerDownOutsideCollapsing: true,
// childrenKey: 'children',
name: '',
// draggable: false,
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
popup :
true : Pop-up menu, will layout automatically, push inside viewport. Default behavior.
false : Static menu, can put into another sizer, won't layout automatically.
orientation : Main orientation of the menu, default is 1 (top to bottom)
'left-to-right', 'horizontal','h', 'x', or 0 : Arrange buttons from left ot right.
'top-to-bottom', 'vertical','v', 'y', or 1 : Arrange buttons from top to bottom.
items : Array of item data for each button. Each item has
children : An array of items for sub-menu, optional. Can change by childrenKey parameter.
Other custom properties
createBackgroundCallback : Callback to return container object of menu's bckground.
Properties of items parameter
items.scene : Scene of this menu object.
createButtonCallback : Callback to return container object of each item.
Properties of item parameter
item.scene : Scene of this menu object.
Other custom properties
easeIn : Duration of expanding menu.
A number : Duration of ease, in milliseconds.
An object :
easeIn.duration : Duration of ease, in milliseconds.
easeIn.ease : Ease function, default is 'Cubic'
easeIn.orientation : Orientation of ease.
undefined : The same orientation with menu's orientation.
'h', 'x', or 0 : Pop-up menu horizontally.
'v', 'y', or 1 : Pop-up menu vertically.
transitIn : Tween behavior of expanding menu.
undefined : Expand menu by pop-up, default behavior.
Custom callback
function(menu, duration) {
}
easeOut : Duration of collapsing menu
A number : Duration of ease, in milliseconds.
An object :
easeOut.duration : Duration of ease, in milliseconds.
easeOut.ease : Ease function, default is 'Linear'
easeOut.orientation : Orientation of ease.
undefined : The same orientation with menu's orientation.
'h', 'x', or 0 : Scale-down menu horizontally.
'v', 'y', or 1 : Scale-down menu vertically.
transitOut : Tween behavior of collapsing menu.
undefined : Collapse menu by scale-down, default behavior.
Custom callback
function(menu, duration) {
}
expandEvent : Event name of expanding sub-menu.
'button.click' : Default value
'button.over'
pointerDownOutsideCollapsing :
true : Collapse all menus (popup:true), or sub-menus (popup:false) when pointer-down outside of all menus. Default behavior.
false : Ignore pointer-down outside detection.
childrenKey : Key of sub-menu in element of items.
children : Default value.
subMenuSide : Side of sub-menu
undefined : Determine side of sub-menu automatically.
'right', or 0 : Put sub-menu at right side. Used with orientation is set to y.
'left', or 2 : Put sub-menu at left side. Used with orientation is set to y.
'up', or 3 : Put sub-menu at up side. Used with orientation is set to x.
'down', or 1 : Put sub-menu at down side. Used with orientation is set to x.
name : Set name of this game object.
draggable : Set true to drag top-most object.
sizerEvents : Set true to fire sizer events. Default value is false.
Custom class¶
Define class
class MyMenu extends RexPlugins.UI.Menu {
constructor(scene, config) {
super(scene, config);
// ...
scene.add.existing(this);
}
// ...
}
Create instance
var menu = new MyMenu(scene, config);
Collapse¶
Collapse menu
menu.collapse();
Collapse sub-menu
menu.collapseSubMenu();
Other properties¶
See sizer object, base sizer object, container-lite.
Events¶
Click button
menu.on('button.click', function(button, index, pointer, event) {
// ...
}, scope);
button : Game object of triggered button.
index : Index of triggered button.
pointer : Pointer object.
Cancel remaining touched events : event.stopPropagation()
Pointer-over button
menu.on('button.over', function(button, index, pointer, event) {
// ...
}, scope);
button : Game object of triggered button.
index : Index of triggered button.
pointer : Pointer object.
Cancel remaining touched events : event.stopPropagation()
Pointer-out button
menu.on('button.out', function(button, index, pointer, event) {
// ...
}, scope);
button : Game object of triggered button.
index : Index of triggered button.
pointer : Pointer object.
Cancel remaining touched events : event.stopPropagation()
Expand(Pop-up start) sub-menu
menu.on('expand', function(subMenu, parentButton) {
// ....
}, scope)
subMenu : Sub-menu.
parentButton : Game object of triggered button.
rootMenu : Root-menu
Pop-up root-menu, or sub-menu completely
menu.on('popup.complete', function(menu) {
// ....
}, scope)
menu : Root-menu, or sub-menu
Collapse(Scale-down starting) root-menu, or sub-menu
menu.on('collapse', function(subMenu, parentButton, rootMenu) {
// ....
}, scope)
subMenu : Sub-menu.
parentButton : Game object of triggered button.
rootMenu : Root-menu
Scale-down root-menu completely
menu.on('scaledown.complete', function(rootMenu) {
// ....
}, scope)
rootMenu : Root-menu