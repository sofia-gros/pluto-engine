Folder
Introduction¶
A container with a title, foldable child, and background.
Author: Rex
Game object
Live demos¶
Scrollable folders
Draggable folder
Nested folders
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
Add folder object
var folder = scene.rexUI.add.folder(config);
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
Add folder object
var folder = scene.rexUI.add.folder(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { Folder } from 'phaser4-rex-plugins/templates/ui/ui-components.js';
Add folder object
var folder = new Folder(scene, config);
scene.add.existing(folder);
Add folder object¶
var folder = scene.rexUI.add.folder({
// x: 0,
// y: 0,
// anchor: undefined,
// width: undefined,
// height: undefined,
// origin: 0.5
// originX:
// originY:
orientation: 0,
// rtl: false,
background: backgroundGameObject,
title: titleGameObject,
child: childGameObject,
// customChildOrigin: false,
toggleByTarget: undefined,
toggleClickConfig: {
mode:'pointerup',
clickInterval: 100,
threshold: undefined,
},
align: {
title: 'left',
child: 'left',
},
expand: {
title: true,
child: true,
},
space: {
left: 0, right:0, top:0, bottom:0, item:0,
titleLeft: 0, titleRight: 0, titleTop: 0, titleBottom: 0,
childLeft: 0, childRight: 0, childTop: 0, childBottom: 0,
},
transition: {
duration: 200,
expandCallback: undefined,
collapseCallback: undefined,
},
reLayoutTarget: undefined,
onExpandStart: undefined,
onExpandComplete: undefined,
onCollapseStart: undefined,
onCollapseComplete: undefined,
space: {
left: 0,
right: 0,
top: 0,
bottom: 0,
item: 0,
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
orientation :
'left-to-right', 'horizontal','h', 'x', or 0 : Put icon at left side, and text at right side.
'top-to-bottom', 'vertical','v', 'y', or 1 : Put icon at top side, and text at bottom side.
rtl :
true : Layout children from right to left.
false : Layout children from left to right. Default behavior.
background : Game object of background, optional. This background game object will be resized to fit the size of folder.
title : Game object of title, required.
child : Game object of child, required.
customChildOrigin :
false : Set origin of child to 0, or 1 (if rtl is set to true). Default behavior.
true : Don't change origin of child.
toggleByTarget : Toggle expanding/collapsing by clicking this target game object
undefined : Toggle by clicking title game object.
toggleClickConfig : Configuration of clicking behavior
undefined : Use default configuration.
align.title, align.child : Alignment of title, child game objects.
undefined, or 'left', or 'top' : Align game objects at left, or top. Default behavior.
'center' : Align game objects at center.
'right', or 'bottom' : Align game objects at right, or bottom.
expand.title, expand.child : Expand width/height of title, child game objects.
true : Expand width/heigh. Default behavior.
false : Use origin width/height.
transition : Configuration of expanding/collapsing transition.
transition.duration : Duration of expanding/collapsing transition.
transition.expandCallback : Callback invoked when expading child. Default behavior is scale-up.
transition.collapseCallback : Callback invoked when collapsing child. Default behavior is scale-down.
reLayoutTarget : Layout topmost sizer when expanding/collapsing start.
undefined : Topmost sizer will be layouted again. Default behavior.
A sizer : Layout this sizer.
onExpandStart : Callback invoked when expanding start. Register this callback on 'expand.start' event.
function(folder) {  }
onExpandComplete : Callback invoked when expanding complete. Register this callback on 'expand.complete' event.
function(folder) {  }
onCollapseStart : Callback invoked when collapsing start. Register this callback on 'collapse.start' event.
function(folder) {  }
onCollapseComplete : Callback invoked when collapsing complete. Register this callback on 'collapse.complete' event.
function(folder) {  }
space : Pads spaces.
space.left, space.right, space.top, space.bottom : Space of bounds.
space.icon : Space between icon game object and text game object.
space.text : Space between text game object and action icon game object.
name : Set name of this game object.
draggable : Set true to drag top-most object.
sizerEvents : Set true to fire sizer events. Default value is false.
enableLayer :
false : Add child game objects into scene's display list. Default behavior.
true : Add child game objects into an internal layer game object. See also.
Custom class¶
Define class
class MyFolder extends RexPlugins.UI.Folder {
constructor(scene, config) {
super(scene, config);
// ...
scene.add.existing(this);
}
// ...
}
Create instance
var folder = new MyFolder(scene, config);
Layout children¶
Arrange position of all elements.
folder.layout();
See also - dirty
Note
Layout topmost sizer when expanding/collapsing start.
Get element¶
Get element
Background game object
var background = folder.getElement('background');
Title game object
var title = folder.getElement('title');
Child game object
var child = folder.getElement('child');
Get by name
var gameObject = folder.getElement('#' + name);
// var gameObject = folder.getElement('#' + name, recursive);
or
var gameObject = folder.getByName(name);
// var gameObject = folder.getByName(name, recursive);
recursive : Set true to search all children recursively.
Expand/collapse¶
Expand, will re-layout from topmost sizer
folder.expand();
// folder.expand(duration);
folder.expand(0);  // Immediately, won't invoke expandCallback
Collapse, will re-layout from topmost sizer
folder.collapse();
// folder.collapse(duration);
folder.collapse(0);  // Immediately, won't invoke collapseCallback
Toggle, will re-layout from topmost sizer
folder.toggle();
// folder.toggle(duration);
folder.toggle(0);  // Immediately, won't invoke expandCallback/collapseCallback
Set expanded state without re-layouting
folder.setExpandedState(expanded);  // true, or false
Get expanded state
var expanded = folder.expanded;
expanded : Initial value is undefined
Transition callbacks¶
Set transition callbacks
folder.setExpandCallback(callback);
folder.setCollapseCallback(callback);
callback :
function(gameObject, duration) {
}
gameObject : Child game object
Transition duration
Set
folder.setTransitionDuration(duration);
Get
var duration = folder.transitionDuration;
Other properties¶
See sizer object, base sizer object, container-lite.
Events¶
On expand-start
folder.on('expand.start', function(folder){
})
title.on('folder.expand', function(folder){
})
child.on('folder.expand', function(folder){
})
On expand-complete
folder.on('expand.complete', function(folder){
})
On collapse-start
folder.on('collapse.start', function(folder){
})
title.on('folder.collapse', function(folder){
})
child.on('folder.collapse', function(folder){
})
On collapse-complete
folder.on('collapse.complete', function(folder){
})