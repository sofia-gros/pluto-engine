Tab pages
Introduction¶
A container with tabs and pages, only current page is visible.
Author: Rex
Game object
Live demos¶
Tabpage
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
Add tab-pages object
var tabPages = scene.rexUI.add.tabPages(config);
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
Add tab-pages object
var tabPages = scene.rexUI.add.tabPages(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { TabPages } from 'phaser4-rex-plugins/templates/ui/ui-components.js';
Add tab-pages object
var tabPages = new TabPages(scene, config);
scene.add.existing(tabPages);
Add tab-pages object¶
var tabPages = scene.rexUI.add.tabPages({
// x: 0,
// y: 0,
// anchor: undefined,
// width: undefined,
// height: undefined,
// origin: 0.5
// originX:
// originY:
// background: backgroundGameObject,
tabsPosition: 'top',
// tabPosition: 'top',
wrapTabs: false,
tabs: {
// width:
// height:
// rtl:
// background: backgroundGameObject,
align:
click: {
mode: 'pointerup',
clickInterval: 100
},
space: { left: 0, right:0, top:0, bottom:0, item:0 }
},
pages: {
space: { left: 0, right:0, top:0, bottom:0 },
fadeIn: 0,
},
expand: {
tabs: false,
},
align: {
tabs: 'left',
},
// space: { left:0, right:0, top:0, bottom:0, item:0 },
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
tabsPosition (or tabPosition) : Put tabs at top, bottom, left, right of pages.
'top', 'bottom', 'left', 'right' : Default value is 'top'.
wrapTabs :
false : Uses Buttons as Tabs, default behavior.
true :
Using FixWidthButtons as Tabs, if tabPosition is 'top' or 'bottom'.
Using Buttons as Tabs, if tabPosition is 'left' or 'right'
tabs : Configuration of tabs, which is a buttons game object.
tabs.width, tabs.height : Minimum width, minimum height of tabs, to preserve space if tabs is empty, optional.
tabs.rtl :
true : Layout buttons from right to left.
false : Layout buttons from left to right. Default behavior.
tabs.background : Game object of background, optional. This background game object will be resized to fit the size of grid table.
tabs.space :
tabs.space.top, tabs.space.bottom, tabs.space.left, tabs.space.right : Padding around bottons.
tabs.space.item : Space between 2 button game objects.
tabs.click: Configuration of button clicking.
tabs.click.mode :
'pointerdown', 'press', or 0 : Fire 'click' event when touch pressed.
'pointerup', 'release', or 1 : Fire 'click' event when touch released after pressed.
tabs.click.clickInterval : Interval between 2 'click' events, in ms.
pages : Configuration of pages
pages.space : Pads spaces.
pages.space.left, pages.space.right, pages.space.top, pages.space.bottom : Space of bounds.
pages.fadeIn : Fade-in duration of current page.
0 : No fade-in effect. Default behavior.
expand :
expand.tabs : Set true to expand width/height of tabs. Default value is false.
align :
align.tabs :
'left'. 'right', 'center' : Align tabs to left/right/center side when tabPosition is 'top' or 'bottom'.
'top'. 'bottom', 'center' : Align tabs to top/bottom/center side when tabPosition is 'left' or 'right'.
space :
An object: Padding of button game objects.
space.top, space.bottom, space.left, space.right : Padding around bottons.
space.item : Space between tabs and pages.
name : Set name of this game object.
draggable : Set true to drag top-most object.
sizerEvents : Set true to fire sizer events. Default value is false.
enableLayer :
false : Add child game objects into scene's display list. Default behavior.
true : Add child game objects into an internal layer game object. See also.
Custom class¶
Define class
class MyTabPages extends RexPlugins.UI.TabPages {
constructor(scene, config) {
super(scene, config);
// ...
scene.add.existing(this);
}
// ...
}
Create instance
var tabPages = new MyTabPages(scene, config);
Add page¶
Add a tab/page to last of tabs/pages.
tabPages.addPage(key, tabGameObject, pageGameObject).layout();
or
tabPages.addPage({
// key: undefined,
tab: tabGameObject,
page: pageGameObject
}).layout();
key : Unique string name of this page.
undefined : Create an UUID for key.
tab : A game object, will put it into tabs.
page : A game object, will put it into pages.
Note
Invoke tabPages.layout() after adding pages.
Swap to page¶
Swap to related page when clicking tab.
Swap to page by key/index
tabPages.swapPage(key);
tabPages.swapPage(index);
key : Unique string name of the page.
index : Index number in tabs.
Swap to first page
tabPages.swapFirstPage();
Swap to last page
tabPages.swapLastPage();
Swap page without fade-in transition
tabPages.swapPage(key, 0);
tabPages.swapPage(index, 0);
tabPages.swapFirstPage(0);
tabPages.swapLastPage(0);
Remove page¶
Remove page
tabPages.removePage(key);
tabPages.removePage(index);
Remove and destroy page
tabPages.removePage(key, true);
tabPages.removePage(index, true);
Remove all pages
tabPages.removeAllPages();
Remove and destroy all pages
tabPages.removeAllPages(true);
Change tabs position¶
tabPages.setTabPosition(position);
position : 'top', 'bottom', 'left', 'right'
Padding of tabs¶
Change padding
tabPages.setTabsPadding(key, value).layout();
or
tabPages.setTabsPadding({
left: leftPadding,
right: rightPadding,
top: topPadding,
bottom: bottomPadding
}).layout();
key : 'left', 'right', 'top', 'bottom', 'item'
Get padding
var value = tabPages.getTabsPadding(key);
key : 'left', 'right', 'top', 'bottom', 'item'
Get element¶
Get element
Pages
var gameObject = tabPages.getElement('pages');
Tabs, a buttons
var gameObject = tabPages.getElement('tabs');
Page by key/index
var gameObject = tabPages.getPage(key);
var gameObject = tabPages.getPage(index);
key : Unique string name of the page.
index : Index number in tabs.
Tab by key/index
var gameObjects = tabPages.getTab(key);
var gameObjects = tabPages.getTab(index);
key : Unique string name of the page.
index : Index number in tabs.
Get by name
var gameObject = tabPages.getElement('#' + name);
// var gameObject = pages.getElement('#' + name, recursive);
or
var gameObject = tabPages.getByName(name);
// var gameObject = tabPages.getByName(name, recursive);
recursive : Set true to search all children recursively.
Other properties¶
See sizer, base sizer object, container-lite, Pages, Buttons
Events¶
When swapping to a page by clicking tab, or tabPages.swapPage(key)
pages.on('tab.focus', function(tab, key) {
// ...
}, scope);
pages.on('page.focus', function(page, key) {
// ...
}, scope);
pages.on('tab.blur', function(tab, key) {
// ...
}, scope);
pages.on('page.blur', function(page, key) {
// ...
}, scope);
tab : Game object of tab.
page : Game object of page.
key : Unique string name of the page.