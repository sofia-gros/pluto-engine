Group navigator
Introduction¶
Navigate between existing game objects, focus on next/previous/next-row/previous row game object.
Author: Rex
Member of scene
Live demos¶
1D targets
2D targets
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexgroupnavigatorplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgroupnavigatorplugin.min.js', true);
Create navigator
var navigator = scene.plugins.get('rexgroupnavigatorplugin').add(config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import GroupNavigatorPlugin from 'phaser4-rex-plugins/plugins/groupnavigator-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexGroupNavigator',
plugin: GroupNavigatorPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Create navigator
var navigator = scene.plugins.get('rexGroupNavigator').add(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import GroupNavigator from 'phaser4-rex-plugins/plugins/groupnavigator.js';
Create navigator
var navigator = new GroupNavigator(config);
Create navigator¶
var navigator = scene.plugins.get('rexGroupNavigator').add({
// enable: true,
targets: gameObjects,
// columns: undefined,
// getFocusEnableCallback(gameObject) {
//     return focusEnable;
// }
// focusEnableDataKey: undefined,
// focusEnableKey: undefined
});
enable :
true : Can navigate between game objects. Default behavior.
false : Ignore navigation actions (navigator.next(), navigator.previous(), navigator.nextRow(), navigator.previousRow())
targe1ts :
1D array of game objects for navigator.next(), or navigator.previous()
2D array of game objects for navigator.next(), navigator.previous(), navigator.nextRow(), navigator.previousRow()
columns : A number : Convert 1D targets array to 2D array, each row has columns game objects.
undefined : Ignore this parameter. Default behavior.
Focus enable : Get focus enable of game object by one of these parameter.
getFocusEnableCallback : A callback to return focus enable of this game object.
function(gameObject) {
return focusEnable;
}
focusEnableDataKey : Get focus enable from private data of this game object.
focusEnableKey : Get focus enable from property of this game object.
Focus enable is always true if none of these parameter is given. Default behavior.
Enable¶
Get
var enable = navigator.enable;
Set
navigator.setEnable(enable);
Navigate¶
Focus on next/previous game object, for 1D and 2D array of targets
navigator.next();
navigator.previous();
Will fire blur and focus events
Focus on next row/previous row game object, for 2D array of targets
navigator.nextRow();
navigator.previousRow();
Will fire blur and focus events
Focus on first/last game object
navigator.first();
navigator.last();
Will fire blur and focus events
Current focused game object¶
Get current focused game object
var gameObject = navigator.getFocusedTarget();
// var gameObject = navigator.focusedTarget;
Focus on game object. Do nothing if that game object is not focus-enable.
navigator.focus(gameObject);
Will fire blur and focus events.
Blur
navigator.blur();
Will fire blur event.
Target game objects¶
Get
var gameObjects = navigator.targets;
gameObjects : 1D/2D array of game objects
Set
navigator.setTargets(targets);
// navigator.setTargets(targets, columns);
Modify
navigator.targets.push(newGameObject);
Phaser.Utils.Array.AddAt(navigator.targets, newGameObject, index);
Phaser.Utils.Array.Remove(navigator.targets, gameObject);
Events¶
On focus
navigator.on('focus', function(gameObject){
})
On blur
navigator.on('blur', function(gameObject){
})