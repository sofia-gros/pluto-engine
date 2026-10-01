CSV Achievements
Introduction¶
Achievements in a csv table.
Author: Rex
Member of scene
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexachievementsplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexachievementsplugin.min.js', true);
Add conditions-table object
var achievements = scene.plugins.get('rexachievementsplugin').add();
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import AchievementsPlugin from 'phaser4-rex-plugins/plugins/achievements-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexAchievements',
plugin: AchievementsPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add conditions-table object
var achievements = scene.plugins.get('rexAchievements').add();
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import Achievements from 'phaser4-rex-plugins/plugins/achievements.js';
Add conditions-table object
var achievements = new Achievements();
Create instance¶
var achievements = scene.plugins.get('rexAchievements').add();
Load table from csv string¶
achievements.loadCSV(csvString, {
// delimiter: ','
});
For exameple, csv string
A
A
Lv1
Ach1
>= 10
< 20
Lv1
Ach2
>= 20
< 50
Lv1
Ach3
>= 50
,A,A
Lv1,Ach1,>= 10,<= 20,
Lv1,Ach2,>= 20,< 50,
Lv1,Ach3,>= 50,,
1st column : Level names
2nd column : Achievement names
Other columns : Condtions
1st row : Variable names of conditions.
means that:
Lv1, Ach1: (A>=10) && (A<20)
Lv1, Ach2: (A>=20) && (A<50)
Lv1, Ach3: (A>=50)
Test¶
Run test
var achievements.runTest(levelName, values);
levelName : Level name, in 1st column of achievements table.
values : Inputs in Key-value pairs
Get obtained states
var states = achievements.getObtainedState(levelName);
states : Obtained states of levelName
{
achievementName: {
wasObtained: boolean,
justObtained: boolean
}
}
wasObtained : Obtained this achievement achievementName before last testing.
justObtained : Obtained this achievement achievementName at last testing.
or
var states = achievements.getTestResults(levelName, values);
Get obtained states¶
Get obtained states of an achievement in a level
var state = achievements.getObtainedState(levelName, achievementName);
state : Obtained states of achievementName, in level levelName
{
wasObtained: boolean,
justObtained: boolean
}
wasObtained : Obtained this achievement achievementName before last testing.
justObtained : Obtained this achievement achievementName at last testing.
Get obtained states of a level
var state = achievements.getObtainedState(levelName);
states : Obtained states of levelName
{
achievementName: {
wasObtained: boolean,
justObtained: boolean
}
}
Get obtained states of all levels
var state = achievements.getObtainedState();
// var state = achievements.getObtainedStates();
states : Obtained states of all levels
{
levelName: {
achievementName: {
wasObtained: boolean,
justObtained: boolean
}
}
}
For each obtained state in a level
achievements.forEachObtainedState(levelName, function(levelName, achievementName, state) {
}, scope)
state : Obtained states of achievementName, in level levelName
{
wasObtained: boolean,
justObtained: boolean
}
Get name¶
Name of levels
var names = achievements.getLevelNames();
// var names = achievements.getLevelNames(out);
Name of achievements in a level
var names = achievements.getAchievementNames(levelName);
// var names = achievements.getAchievementNames(levelName, out);
Save & load obtained states¶
Get obtained states
var states = achievements.getObtainedStates();
Load obtained states
achievements.loadObtainedStates(states);
Set obtained state¶
Set wasObtained, justObtained properties to true.
achievements.setObtainedState(levelName, achievementName);
Set wasObtained, justObtained properties to false.
achievements.clearObtainedState(levelName, achievementName);
// achievements.setObtainedState(levelName, achievementName, false);