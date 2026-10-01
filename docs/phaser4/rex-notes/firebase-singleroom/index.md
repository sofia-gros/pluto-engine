Single room
Introduction¶
Chat room, using firebase-database.
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
Add single-room object
var room = scene.plugins.get('rexfirebaseplugin').add.singleRoom(config);
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
Add single-room object
var room = scene.plugins.get('rexFirebase').add.singleRoom(config);
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
import { SingleRoom } from 'phaser4-rex-plugins/plugins/firebase-components.js';
Add single-room object
var room = new SingleRoom(config);
Create instance¶
var room = scene.plugins.get('rexFirebase').add.singleRoom({
root: '',
// maxUsers: 0,
// userID: '',
// userName: '',
// broadcast: true,
// tables: undefined,
});
root : Path of this room.
maxUsers: Maximum users in this list. Set to 0 to have infinity users.
userID : ID of user.
userName : Name of user.
broadcast : Broadcast chat messages.
true : Enable broadcasting, without storing received (history) messages. Default behavior.
false : Disable broadcasting.
A JSON object :
{
history: 0
}
history : Stored received (history) messages in client side.
0, or false : No history message stored.
-1, or true : Infinity history message stored. i.e. store all messages from starting updating.
A number larger then 0 : Length of stored history message.
tables : Configuration of tables.
undefined : No table.
Array of table-config JSON object for each table.
[
{
key: tableKey,
type: '1d'
},
{
...
}
]
key : Unique name of this table.
type : Table type.
1, or '1d' : 1d table, indexing by (key0)
2, or '2d' : 2d table, indexing by (key0, key1)
3, or '3d' : 3d table, indexing by (key0, key1, key2)
Current user infomation¶
User name
Get
var userName = room.userInfo.userName;
Set
room.changeUserName(newUserName);
User ID
Get
var userID = room.userInfo.userID;
Join room¶
Set userID and user name.
room.setUser(userID, userName);
userID : User ID.
userName : Display name.
Join room.
room.joinRoom();
Leave room¶
room.leaveRoom();
Kick user¶
room.kickUser(userID);
User list¶
Get users in room(user list)
var users = room.getUsers();
users : Array of user {userID, userName}
Is first user in room(user list)?
var isFirstUser = room.isFirstUser(userID);
// var isFirstUser = room.isFirstUser();  // Current user is first user
Room(user list) is full
var isFull = room.isFull();
Maximun users setting value
var maxUsers = room.maxUsers;
Current user is in room(user list)
var isInRoom = room.isInRoom();
Send message¶
room.broadcast.send(message);
message : A string message, or a JSON data.
Receive messages¶
Register receive event
room.on('broadcast.receive', function(data){
// var senderID = data.senderID;
// var senderName = data.senderName;
// var message = data.message;
})
Only receive messages after joined room. Previous messages won't be got anymore.
Received messages¶
Received messages will be saved in client side.
Get received (history) messages.
var messages = room.broadcast.getHistory();
Clear history messages.
room.broadcast.clearHistory();
Tables¶
Get table
var table = room.getTable(key);
key : Unique name of this table.
Write¶
See here
Read¶
See here
Events¶
User list events¶
Any user join
room.on('userlist.join', user);
user : {userID, userName}
Any user leave
room.on('userlist.leave', user);
user : {userID, userName}
User list updated, includes user join, user leave, and user name changed
room.on('userlist.update', users);
users : Array of user {userID, userName}
User name is changed
room.on('userlist.changename', userID, userName, prevUserName);
Broadcast events¶
Receive message
room.on('broadcast.receive', function(data){
// var senderID = data.senderID;
// var senderName = data.senderName;
// var message = data.message;
})
Table events¶
Event names of each table indexed by key
init : tables.${key}.init
update : tables.${key}.update
addkey0 : tables.${key}.addkey0
removekey0 : tables.${key}.removekey0
changekey0 : tables.${key}.changekey0
addkey1 : tables.${key}.addkey1
removekey1 : tables.${key}.removekey1
changekey1 : tables.${key}.changekey1
addkey2 : tables.${key}.addkey2
removekey2 : tables.${key}.removekey2
changekey2 : tables.${key}.changekey2