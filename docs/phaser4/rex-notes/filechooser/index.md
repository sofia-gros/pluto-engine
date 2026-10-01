File chooser
Introduction¶
Create a transparent file chooser button (<input type="file">).
Author: Rex
DOM Game object
Live demos¶
File chooser button
Open file chooser dialog
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
scene.load.plugin('rexfilechooserplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexfilechooserplugin.min.js', true);
Add file chooser object
var fileChooser = scene.add.rexFileChooser(config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import FileChooserPlugin from 'phaser4-rex-plugins/plugins/filechooser-plugin.js';
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
key: 'rexFileChooser',
plugin: FileChooserPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add file chooser object
var fileChooser = scene.add.rexFileChooser(config);
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
import { FileChooser } from 'phaser4-rex-plugins/plugins/filechooser.js';
Add file chooser object
var fileChooser = new FileChooser(config);
scene.add.existing(fileChooser);
Add file chooser object¶
var fileChooser = scene.add.rexFileChooser({
accept: '',
multiple: false
});
// var fileChooser = scene.add.rexFileChooser(x, y, width, height, config);
accept : A filter for what file types the user can pick from the file input dialog box.
'image/*' : The user can pick all image files.
'audio/*' : The user can pick all sound files.
'video/*' : The user can pick all video files.
file_extension : Specify the file extension(s) (e.g: .gif, .jpg, .png, .doc) the user can pick from.
multiple : Set true to select multiple files.
Custom class¶
Define class
class MyFlieChooser extends FileChooser {
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
var fileChooser = new MyFlieChooser(scene, x, y, width, height, config);
Sync¶
Sync position, size and origin to another game object.
fileChooser.syncTo(gameObject);
Selected files¶
var files = fileChooser.files;
files : Array of file object.
Set accept filter¶
fileChooser.setAccept(accept);
accept : A filter for what file types the user can pick from the file input dialog box.
'image/*' : The user can pick all image files.
'audio/*' : The user can pick all sound files.
'video/*' : The user can pick all video files.
file_extension : Specify the file extension(s) (e.g: .gif, .jpg, .png, .doc) the user can pick from.
Multiple files¶
Enable
fileChooser.setMultiple();
Disable
fileChooser.setMultiple(false);
Events¶
Selected file(s) changed
fileChooser.on('change', function(fileChooser) {
var files = fileChooser.files;
if (files.length === 0) { // No selected file
return;
}
var file = files[0];
var url = URL.createObjectURL(file);
// ...
})
Load file to cache¶
fileChooser.loadFile(file, loaderType, key);
// fileChooser.loadFile(file, loaderType, key, cahceType);
or
fileChooser.loadFilePromise(file, loaderType, key, cahceType)
.then(function(content) {
})
file : File object, see Events
loaderType : image, text, binary, ... See Loader
key : Unique string key.
cahceType :
undefined : Use default value.
content : Content of file.
Create object URL¶
Create object url
var objectURL = URL.createObjectURL(file);
Release object url
URL.revokeObjectURL(objectURL);
Open file chooser¶
Failure
This method won't work at ios.
Note
Open a file chooser dialog under any touch event. i.e. User can't open file chooser dialog directly.
scene.plugins.get('rexFileChooser').open({
// accept: '',
// multiple: false,
// closeDelay: 200
})
.then(function(result) {
// var files = result.files;
})
accept : A filter for what file types the user can pick from the file input dialog box.
'image/*' : The user can pick all image files.
'audio/*' : The user can pick all sound files.
'video/*' : The user can pick all video files.
file_extension : Specify the file extension(s) (e.g: .gif, .jpg, .png, .doc) the user can pick from.
multiple : Set true to select multiple files.
closeDelay : Add a small delay to detect dialog canceled after game focus.
File chooser dialog dose not have cancel event.
files : Array of selected files.
Each file object (files[i]) has properties
file.name : File name with file extension.
file.type : File type. (ex. 'image/jpeg')
file.size : File size in bytes.
file.lastModified : Timestamp of last-modified time.
file.lastModifiedDate : Date object of last-modified time. Equal to new Data(lastModified).
Get object url :
var objectURL = URL.createObjectURL(file);
Length files is 0 : User cancels file chooser dialog.
Enable clicking-open¶
Enable
fileChooser.setOpenEnable();
// fileChooser.setOpenEnable(true);
Disable
fileChooser.setOpenEnable(false)
Other properties¶
See dom game object, game object
Interactive with other game objects¶
See dom-element's Interactive with other game objects