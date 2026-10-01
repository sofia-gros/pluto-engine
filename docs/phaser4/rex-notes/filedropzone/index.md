File drop zone
Introduction¶
Create a div element for dropping file(s).
Author: Rex
DOM Game object
Live demos¶
Drop text file
Drop image file
Interactve with other game objects
Usage¶
Sample code
Install plugin¶
Load minify file¶
Enable dom element in configuration of game
var config = {
parent: divId,
// fullscreenTarget: divId, // For fullscreen
dom: {
createContainer: true
},
input: {
mouse: {
target: divId
},
touch: {
target: divId
},
},
// ...
};
var game = new Phaser.Game(config);
Set parent to divId
Set dom.createContainer to true.
Load plugin (minify file) in preload stage
scene.load.plugin('rexfiledropzoneplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexfiledropzoneplugin.min.js', true);
Add file-drop-zone object
var fileDropZone = scene.add.rexFileDropZone(config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import FileDropZonePlugin from 'phaser4-rex-plugins/plugins/filedropzone-plugin.js';
var config = {
parent: divId,
// fullscreenTarget: divId, // For fullscreen
dom: {
createContainer: true
},
input: {
mouse: {
target: divId
},
touch: {
target: divId
},
},
// ...
plugins: {
global: [{
key: 'rexFileDropZone',
plugin: FileDropZonePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add file-drop-zone object
var fileDropZone = scene.add.rexFileDropZone(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Enable dom element in configuration of game
var config = {
parent: divId,
// fullscreenTarget: divId, // For fullscreen
dom: {
createContainer: true
},
input: {
mouse: {
target: divId
},
touch: {
target: divId
},
},
// ...
};
var game = new Phaser.Game(config);
Set parent to divId
Set dom.createContainer to true.
Import class
import { FileDropZone } from 'phaser4-rex-plugins/plugins/filedropzone.js';
Add file-drop-zone object
var fileDropZone = new FileDropZone(config);
scene.add.existing(fileDropZone);
Add file-drop-zone object¶
var fileDropZone = scene.add.rexFileDropZone({
// style: { },
// dropEnable: true,
// filters: { filterType: (file, files) => boolean }
});
// var fileDropZone = scene.add.rexFileDropZone(x, y, width, height, config);
style : CSS style of div element.
dropEnable :
true : Fire drop events when dropping files. Default behavior.
false : Won't fire drop events.
filters : Filter methods, optional. For example, image files filter, will fire 'drop.image' event
{
image: function(file, files) {
return file.name.match(/\.(jpg|jpeg|png|gif)$/i)
}
}
Custom class¶
Define class
class MyFileDropZone extends FileDropZone {
constructor(scene, x, y, width, height, config) {
super(scene, x, y, width, height, config) {
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
var fileDropZone = new MyFileDropZone(scene, x, y, width, height, config);
Sync¶
Sync position, size and origin to another game object.
fileDropZone.syncTo(gameObject);
Dropped files¶
var files = fileDropZone.files;
files : Array of file object.
Events¶
Drop files
fileDropZone.on('drop', function(fileDropZone) {
var files = fileDropZone.files;
})
Drop filtered files
fileDropZone.on('drop.' + filterType, function(files) {
})
Drag-enter/drag-leave/drag-over file(s)
fileDropZone.on('dragenter', function(fileDropZone) {
})
fileDropZone.on('dragleave', function(fileDropZone) {
})
fileDropZone.on('dragover', function(fileDropZone) {
})
Warning
Game objects under this file drop zone can't receive touch input events.
Enable drop events¶
Enable
fileDropZone.setDropEnable();
// fileDropZone.setDropEnable(true);
Disable
fileDropZone.setDropEnable(false);
Toggle
fileDropZone.toggleDropEnable();
Load file to cache¶
fileDropZone.loadFile(file, loaderType, key);
// fileDropZone.loadFile(file, loaderType, key, cahceType, onComplete);
or
fileDropZone.loadFilePromise(file, loaderType, key, cahceType)
.then(function(content) {
})
file : File object, see Events
loaderType : image, text, binary, ... See Loader
key : Unique string key.
cahceType :
undefined : Use default value.
onComplete : Callback invoked when file loaded to cache.
content : Content of file.
Create object URL¶
Create object url
var objectURL = URL.createObjectURL(file);
Release object url
URL.revokeObjectURL(objectURL);
Other properties¶
See dom game object, game object
Interactive with other game objects¶
See dom-element's Interactive with other game objects