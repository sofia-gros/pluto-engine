Online user list
Introduction¶
Online user list, using firebase-database.
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
Add online-user-list object
var userList = scene.plugins.get('rexfirebaseplugin').add.onlineUserList(config);
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
Add online-user-list object
var userList = scene.plugins.get('rexFirebase').add.onlineUserList(config);
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
import { OnlineUserList } from 'phaser4-rex-plugins/plugins/firebase-components.js';
Add online-user-list object
var userList = new OnlineUserList(config);
Create instance¶
var userList = scene.plugins.get('rexFirebase').add.onlineUserList({
root: '',
// maxUsers: 0,
// userID: '',
// userName: '',
});
root : Path of this online user list.
maxUsers: Maximum users in this list. Set to 0 to have infinity users.
userID : ID of user.
userName : Name of user.
Join¶
Set userID and user name.
userList.setUser(userID, userName);
or
userList.setUser({
userID: userID,
userName: userName
});
userID : User ID.
userName : Display name.
Join list.
userList.join()
// .then(function() { })
// .catch(function() { })
Leave¶
userList.leave()
// .then(function() { })
// .catch(function() { })
Kick user¶
userList.leave(userID)
// .then(function() { })
// .catch(function() { })
Change user name¶
userList.changeUserName(newUserName)
// .then(function() { })
// .catch(function() { })
User list¶
Get users in user list
var users = userList.getUsers();
users : Array of user {userID, userName}
Is first user in user list?
var isFirstUser = userList.isFirstUser(userID);
// var isFirstUser = userList.isFirstUser();  // Current user is first user
User list is full
var isFull = userList.isFull();
Maximun users setting value
var maxUsers = userList.maxUsers;
Current user is in list
var isInList = userList.isInList;
Events¶
Any user join
userList.on('join', user);
user : {userID, userName}
Any user leave
userList.on('leave', user);
user : {userID, userName}
User list updated, includes user join, user leave, and user name changed
userList.on('update', users);
users : Array of user {userID, userName}
User name is changed
userList.on('changename', userID, userName, prevUserName);