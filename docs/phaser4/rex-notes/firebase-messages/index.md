Messages
Introduction¶
Store messages in firebase-firestore.
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
Add leader-board object
var messages = scene.plugins.get('rexfirebaseplugin').add.messages(config);
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
Add leader-board object
var messages = scene.plugins.get('rexFirebase').add.messages(config);
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
import { Messages } from 'phaser4-rex-plugins/plugins/firebase-components.js';
Add leader-board object
var messages = new Messages(config);
Create instance¶
var messages = scene.plugins.get('rexFirebase').add.messages({
root: '',
// pageItemCount: 100,
// senderID: '',
// senderName: '',
// receiverID: undefined,
});
root : Collection name of this messages.
pageItemCount : Item count of a page, default value is 100
senderID : ID of sender.
senderName : Name of sender, optional.
receiverID : ID of receiver, optional.
Send message¶
Set sender.
messages.setSender(userID, userName);
or
messages.setSender({
userID: userID,
userName: userName
});
userID : User ID.
userName : Display name of user, optional.
Set receiver, optional.
messages.setReceiver(userID);
userID : User ID.
Send message
messages.send(message)
.then(function() { })
.catch(function(error) { })
message : String, number, or JSON object.
Receive messages¶
Set receiverID, optional.
messages.setReceiver(userID)
userID : User ID.
Load previous messages, optional.
messages.loadPreviousMessages()
.then(function(messageObjs) { })
.catch(function(error) { })
messageObjs : Array of Received message objects
messageObj.senderID, messageObj.senderName : Sernder ID and name.
messageObj.receiverID : Receiver ID, optional.
messageObj.message : Sent message, a string, number, or JSON object.
messageObj.timestamp : Server-timestamp.
Add 'receiver' event.
messages.on('receive', function(messageObj) {
// var senderID = messageObj.senderID;
// var senderName = messageObj.senderName;
// var receiverID = messageObj.receiverID;
// var message = messageObj.message;
// var timestamp = messageObj.timestamp;
})
messageObj : Received message object.
Start receiving
messages.startReceiving();
Stop receiving
messages.stopReceiving();
Received messages will be stored in messages.cacheMessages