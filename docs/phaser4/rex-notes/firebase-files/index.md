Files
Introduction¶
Save JSON data, using firebase-firestore.
Each owner has several files, each file contains header and content indexed by fileID.
Author: Rex
Usage¶
Sample code
Install plugin¶
Load minify file¶
Add Firebase SDKs
<body>
<!-- Insert these scripts at the bottom of the HTML, but before you use any Firebase services -->
<!-- Firebase App (the core Firebase SDK) is always required and must be listed first -->
<script src="/__/firebase/10.13/firebase-app-compat.js"></script>
<!-- Add Firebase products that you want to use -->
<script src="/__/firebase/10.13/firebase-firestore-compat.js"></script>
</body>
Load plugin (minify file) in preload stage
scene.load.plugin('rexfirebaseplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexfirebaseplugin.min.js', true);
Initialize firebase application.
firebase.initializeApp({
apiKey: '...',
authDomain: '...',
databaseURL: '...',
projectId: '...',
storageBucket: '...',
messagingSenderId: '...'
})
Add file-manager object
var fileManager = scene.plugins.get('rexfirebaseplugin').add.files(config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Add Firebase SDKs
<body>
<!-- Insert these scripts at the bottom of the HTML, but before you use any Firebase services -->
<!-- Firebase App (the core Firebase SDK) is always required and must be listed first -->
<script src="/__/firebase/10.13/firebase-app-compat.js"></script>
<!-- Add Firebase products that you want to use -->
<script src="/__/firebase/10.13/firebase-firestore-compat.js"></script>
</body>
Install plugin in configuration of game
import FirebasePlugin from 'phaser4-rex-plugins/plugins/firebase-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexFirebase',
plugin: FirebasePlugin,
start: true
}]
}
// ...
};
var game = new Phaser.Game(config);
Initialize firebase application.
firebase.initializeApp({
apiKey: '...',
authDomain: '...',
databaseURL: '...',
projectId: '...',
storageBucket: '...',
messagingSenderId: '...'
})
Add file-manager object
var fileManager = scene.plugins.get('rexFirebase').add.files(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Add Firebase SDKs
<body>
<!-- Insert these scripts at the bottom of the HTML, but before you use any Firebase services -->
<!-- Firebase App (the core Firebase SDK) is always required and must be listed first -->
<script src="/__/firebase/10.13/firebase-app-compat.js"></script>
<!-- Add Firebase products that you want to use -->
<script src="/__/firebase/10.13/firebase-database-compat.js"></script>
</body>
Initialize firebase application.
firebase.initializeApp({
apiKey: '...',
authDomain: '...',
databaseURL: '...',
projectId: '...',
storageBucket: '...',
messagingSenderId: '...'
})
Import class
import { Files } from 'phaser4-rex-plugins/plugins/firebase-components.js';
Add file-manager object
var fileManager = new Files(config);
Create instance¶
var fileManager = scene.plugins.get('rexFirebase').add.files({
root: ''
});
root : Collection name of these files.
Save file¶
Set file owner.
fileManager.setOwner(userID);
or
fileManager.setOwner({
userID: userID
});
userID : User ID of file owner.
Save header and content data.
Overwrite
fileManager.save(fileID, header, content);
fileID : Unique ID of this file.
header : Header data for indexing, a JSON object.
Reserve keys : userID, fileID, type, contentDocID. (i.e. don't use these keys)
content : Content/body, a JSON object.
Reserve keys : userID, fileID, type. (i.e. don't use these keys)
Update
fileManager.save(fileID, header, content, true);
Load headers¶
Set file owner.
fileManager.setOwner(userID);
Load all headers of this file owner.
fileManager.loadHeaders()
.then(function(result) {
// var headers = result.headers;
// var userID = result.userID;
})
.catch(function(result) {
// var error = result.error;
// var userID = result.userID;
})
headers : Get header by headers[fileID], each header contains
header.fileID : Unique ID of this file.
header.userID : User ID of file owner.
Load file¶
Set file owner.
fileManager.setOwner(userID);
Load file.
fileManager.load(fileID)
.then(function(result) {
// var header = result.header;
// var content = result.content;
// var fileID = result.fileID;
// var userID = result.userID;
})
.catch(function(result) {
// var error = result.error;
// var fileID = result.fileID;
// var userID = result.userID;
})
header, content : Header/content of this file.
fileID : Unique ID of this file.
userID : User ID of file owner.