Split panels
Introduction¶
A container with left(top) panel, right(bottom) panel, splitter, and background. Drag splitter to resize with left(top) panel, right(bottom) panel.
Author: Rex
Game object
Live demos¶
Split-panels
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
Add split-panels object
var splitPanels = scene.rexUI.add.splitPanels(config);
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
Add split-panels object
var splitPanels = scene.rexUI.add.splitPanels(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { SplitPanels } from 'phaser4-rex-plugins/templates/ui/ui-components.js';
Add split-panels object
var splitPanels = new SplitPanels(scene, config);
scene.add.existing(splitPanels);
Add split-panels object¶
var splitPanels = scene.rexUI.add.splitPanels({
// x: 0,
// y: 0,
// anchor: undefined,
// width: undefined,
// height: undefined,
// origin: 0.5
// originX:
// originY:
background: backgroundGameObject,
leftPanel: leftPanelGameObject,
// topPanel: topPanelGameObject,
rightPanel: rightPanelGameObject,
// bottomPanel: topPanelGameObject,
splitter: splitterGameObject,
// minLeftPanelWidth: 0,
// minTopPanelHeight: 0,
// minRightPanelWidth: 0,
// minBottomPanelHeight: 0,
// splitRatio: 0.5
space: {
left: 0, right: 0, top: 0, bottom: 0, item: 0,
leftPanelTop: 0, leftPanelBottom: 0, leftPanelLeft: 0, leftPanelRight: 0,
// topPanelTop: 0, topPanelBottom: 0, topPanelLeft: 0, topPanelRight: 0,
rightPanelTop: 0, rightPanelBottom: 0, rightPanelLeft: 0, rightPanelRight: 0,
// bottomPanelTop: 0, bottomPanelBottom: 0, bottomPanelLeft: 0, bottomPanelRight: 0,
splitterPanelTop: 0, splitterPanelBottom: 0, splitterPanelLeft: 0, splitterPanelRight: 0,
},
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
background : Game object of background, optional. This background game object will be resized to fit the size of label.
leftPanel(topPanel), rightPanel(bottomPanel) : First and second panel children.
splitter : Game object of splitter.
minLeftPanelWidth(minTopPanelHeight), minRightPanelWidth(minBottomPanelHeight) : Minimum width/height of first and second children.
0 : Width/height does not have constraint. Default behavior.
splitRatio : Position of splitter. 0~1. Default value is 0.5.
space : Pads spaces.
space.left, space.right, space.top, space.bottom : Space of bounds.
space.item : Space between first child and splitter, splitter and second child.
space.leftPanelTop(space.topPanelTop), space.leftPanelBottom(space.topPanelBottom), space.leftPanelLeft(space.topPanelLeft), space.leftPanelRight(space.topPanelRight) : Space around first game object.
space.rightPanelTop(space.bottomPanelTop), space.rightPanelBottom(space.bottomPanelBottom), space.rightPanelLeft(space.bottomPanelLeft), space.rightPanelRight(space.bottomPanelRight) : Space around second game object.
space.splitterTop, space.splitterBottom, space.splitterLeft, space.splitterRight : Space around splitter game object.
name : Set name of this game object.
draggable : Set true to drag top-most object.
sizerEvents : Set true to fire sizer events. Default value is false.
enableLayer :
false : Add child game objects into scene's display list. Default behavior.
true : Add child game objects into an internal layer game object. See also.
Custom class¶
Define class
class MySplitPanels extends RexPlugins.UI.SplitPanels {
constructor(scene, config) {
super(scene, config);
// ...
scene.add.existing(this);
}
// ...
}
Create instance
var splitPanels = new MySplitPanels(scene, config);
Layout children¶
Arrange position of all elements.
splitPanels.layout();
See also - dirty
Get element¶
Get element
Background game object
var background = splitPanels.getElement('background');
First game object
var leftPanel = splitPanels.getElement('leftPanel');
// var topPanel = splitPanels.getElement('topPanel');
Second game object
var rightPanel = splitPanels.getElement('rightPanel');
// var bottomPanel = splitPanels.getElement('bottomPanel');
Splitter game object
var splitter = splitPanels.getElement('splitter');
Get by name
var gameObject = splitPanels.getElement('#' + name);
// var gameObject = splitPanels.getElement('#' + name, recursive);
or
var gameObject = splitPanels.getByName(name);
// var gameObject = splitPanels.getByName(name, recursive);
recursive : Set true to search all children recursively.
Split ratio¶
Get
var splitRatio = splitPanels.splitRatio;
Set
splitPanels.setSplitRatio(value);
or
splitPanels.splitRatio = value;
Minimum child size¶
Get
var minLeftPanelWidth = splitPanels.minLeftPanelWidth;
// var minTopPanelHeight = splitPanels.minTopPanelHeight;
var minRightPanelWidth = splitPanels.minRightPanelWidth;
// var minBottomPanelHeight = splitPanels.minBottomPanelHeight;
Set
splitPanels.setMinLeftPanelWidth(value);
// splitPanels.setMinTopPanelHeight(value);
splitPanels.setMinRightPanelWidth(value);
// splitPanels.setMinBottomPanelHeight(value);
or
splitPanels.minLeftPanelWidth = value;
// splitPanels.minTopPanelHeight = value;
splitPanels.minRightPanelWidth = value;
// splitPanels.minBottomPanelHeight = value;
Enable¶
Get
var enable = splitPanels.splitterEnable;
Set
slider.setSplitterEnable(enable);
or
slider.splitterEnable = enable;
Events¶
On drag splitter start
splitPanels.on('splitter.dragstart', function(splitter, splitRatio){
//
}, scope);
On drag splitter end
splitPanels.on('splitter.dragend', function(splitter, splitRatio){
//
}, scope);
On dragging splitter
splitPanels.on('splitter.drag', function(splitter, splitRatio){
//
}, scope);
On pointer-over splitter
splitPanels.on('splitter.over', function(splitter, splitRatio){
//
}, scope);
On pointer-out splitter
splitPanels.on('splitter.out', function(splitter, splitRatio){
//
}, scope);
Other properties¶
See sizer object, base sizer object, container-lite.