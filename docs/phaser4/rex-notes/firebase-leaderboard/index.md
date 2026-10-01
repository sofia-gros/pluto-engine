Leaderboard
Introduction¶
Descending sort scores, using firebase-firestore.
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
var leaderBoard = scene.plugins.get('rexfirebaseplugin').add.leaderBoard(config);
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
var leaderBoard = scene.plugins.get('rexFirebase').add.leaderBoard(config);
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
import { LeaderBoard } from 'phaser4-rex-plugins/plugins/firebase-components.js';
Add leader-board object
var leaderBoard = new LeaderBoard(config);
Create instance¶
var leaderBoard = scene.plugins.get('rexFirebase').add.leaderBoard({
root: '',
// timeFilters: false,
// timeFilterType: 'year',
// pageItemCount: 100,
// userID: '',
// userName: '',
// boardID: undefined,
// tag: undefined
});
root : Collection name of this leaderboard.
timeFilters : Time filter of day/week/month/year.
false : Don't use any time filter.
true : Enable all time filters.
JSON object, enable some time filters.
{
day: true,
week: true,
month: true,
year: true,
all: true
}
timeFilterType : Type of time filter.
'day', or 'd' : Filter scores by current day.
'week', or 'w' : Filter scores by current week.
'month', 'm' : Filter scores by current month.
'year', 'y' : Filter scores by current year. Default value.
'all', 'a' : No time filter to track all scores.
pageItemCount : Item count of a page, default value is 100
userID : ID of user.
userName : Name of user.
boardID : Board ID, optional.
tag : Custom tag, optional.
Time filter enabled
Add indexes if time filter is enabled.
- tagD(ascending), scoreD(descending), boardID(ascending), tag(ascending)
- tagW(ascending), scoreW(descending), boardID(ascending), tag(ascending)
- tagM(ascending), scoreM(descending), boardID(ascending), tag(ascending)
- tagY(ascending), scoreY(descending), boardID(ascending), tag(ascending)
- tagA(ascending), scoreA(descending), boardID(ascending), tag(ascending)
Post score¶
Set user.
leaderBoard.setUser(userID, userName);
or
leaderBoard.setUser({
userID: userID,
userName: userName
});
userID : User ID.
userName : Display name of user, optional.
Set board property, optional.
Board ID
leaderBoard.setBoardID(boardID);
Custom tag
leaderBoard.setTag(tag);
Post score
leaderBoard.post(score)
// leaderBoard.post(score, extraData)
// leaderBoard.post(score, extraData, timestamp)
.then(function(record) { })
.catch(function(error) { })
score : A number, scores will be sorted descend.
extraData : Extra data in JSON format.
timestamp : Timestamp of posting.
undefined : Current time.
A number : For debug usage.
Get my score¶
leaderBoard.getScore()
// leaderBoard.getScore(userID)
.then(function(score) { })
.catch(function(error) { })
userID : User ID, optional.
undefined : Current user ID.
score : Score object.
Time filter enabled :  {userID, scoreD, scoreW, scoreM, scoreY, tagD, tagW, tagM, tagY, tagA}
scoreD, scoreW, scoreM, scoreY, scoreA : Score of day/week/month/year/all-time.
tagD, tagW, tagM, tagY, tagA : Time tag of day/week/month/year/all-time.
Time filter disabled : {userID, score}
Get my rank¶
leaderBoard.getRank()
// leaderBoard.getRank(userID)
.then(function(rank) { })
.catch(function(error) { })
userID : User ID, optional.
undefined : Current user ID.
rank : Rank object. {userID, rank}
Get scores¶
Set board property, optional.
Board ID
leaderBoard.setBoardID(boardID);
Custom tag
leaderBoard.setTag(tag);
Set time filter, optional.
leaderBoard.setTimeFilterType(type);
type :
'day', or 'd' : Filter scores by current day.
'week', or 'w' : Filter scores by current week.
'month', 'm' : Filter scores by current month.
'year', 'y' : Filter scores by current year.
'all', 'a' : No time filter to track all scores.
Load scores page by page.
Load first page.
leaderBoard.loadFirstPage()
.then(function(scores) { })
.catch(function(error) { })
scores : An array of score object. Each score object is {userID, userName, socre}
Load next page.
leaderBoard.loadNextPage()
.then(function(scores) { })
.catch(function(error) { })
scores : An array of score object. Each score object is {userID, userName, socre}
Load previous page.
leaderBoard.loadPreviousPage()
.then(function(scores) { })
.catch(function(error) { })
scores : An array of score object. Each score object is {userID, userName, socre}
Reload current page.
leaderBoard.loadCurrentPage()
.then(function(scores) { })
.catch(function(error) { })
scores : An array of score object. Each score object is {userID, userName, socre}
Page index¶
Current page index
var pageIndex = leaderBoard.pageIndex;
Is first page
var isFirstPage = leaderBoard.isFirstPage;
Is last page
var isLastPage = leaderBoard.isLastPage;
Delete¶
Delete user
leaderBoard.deleteUserScore(userID)
.then(function(){ })
.catch(function(){ })
Delete board
leaderBoard.deleteBoard(boardID, tag)
.then(function(){ })
.catch(function(){ })