Broadcast
Introduction¶
Broadcast real-time messages, using firebase-database.
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
<script src="/__/firebase/10.13/firebase-database-compat.js"></script>
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
Add messager object
var messager = scene.plugins.get('rexfirebaseplugin').add.broadcast(config);
Import plugin¶
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
Add messager object
var messager = scene.plugins.get('rexFirebase').add.broadcast(config);
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
import { Broadcast } from 'phaser4-rex-plugins/plugins/firebase-components.js';
Add messager object
var messager = new Broadcast(config);
Create instance¶
var messager = scene.plugins.get('rexFirebase').add.broadcast({
root: '',
// senderID: '',
// senderName: '',
// receiverID: '',
// history: 0
});
root : Path of this messager.
senderID : ID of sender.
senderName : Name of sender.
receiverID : ID of receiver/channel.
history : Stored received (history)  messages in client side.
0, or false : No history message stored.
-1, or true : Infinity history message stored. i.e. store all messages from starting updating.
A number larger then 0 : Length of stored history message.
Send message¶
Set sender in config, or setSender method.
messager.setSender(userID, userName);
or
messager.setSender({
userID: userID,
userName: userName
});
userID : User ID of sender.
userName : Display name of sender.
Set receiver in config, or setReceiver method.
messager.setReceiver(receiverID);
receiverID : ID of receiver/channel.
Send message to receiverID.
messager.send(message)
// .then(function() { })
// .catch(function() { })
message : A string message, or a JSON data.
Receive messages¶
Register receive event
messager.on('receive', function(data){
// var senderID = data.senderID;
// var senderName = data.senderName;
// var message = data.message;
})
Set receiver in config, or setReceiver method
messager.setReceiver(receiverID);
receiverID : ID of receiver/channel.
Start receiving
messager.startReceiving();
Stop receive
messager.stopReceiving();
Only receive messages after invoking startReceiving method. Previous messages won't be got anymore.
Received messages¶
Received messages will be saved in client side.
Get received (history) messages.
var messages = messager.getHistory();
Clear history messages.
messager.clearHistory();