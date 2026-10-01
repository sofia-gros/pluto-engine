Dialog-quest
Introduction¶
Flow control of question manager with a dialog.
Author: Rex
Template
Live demos¶
Branch
Shuffle
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
scene.load.script('rexdialogquest', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexdialogquest.min.js');
Add dialog and quest object
var dialog = scene.rexUI.add.dialog(config);
var quest = new rexdialogquest({
dialog: dialog,
// ...
});
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import UIPlugin from 'phaser4-rex-plugins/templates/ui/ui-plugin.js';
import DialogQuest from 'phaser4-rex-plugins/templates/dialog-quest/DialogQuest.js';
var config = {
// ...
plugins: {
scene: [{
key: 'rexUI',
plugin: UIPlugin,
mapping: 'rexUI'
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add dialog and quest object
var dialog = scene.rexUI.add.dialog(config);
var quest = new DialogQuest({
dialog: dialog,
// ...
});
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { Dialog } from 'phaser4-rex-plugins/templates/ui/ui-components.js';
import DialogQuest from 'phaser4-rex-plugins/templates/dialog-quest/DialogQuest.js';
Add dialog object
var dialog = new Dialog(scene, config);
scene.add.existing(dialog);
var quest = new DialogQuest({
dialog: dialog,
// ...
});
Create dialog-quest object¶
var quest = new DialogQuest({
dialog: dialog,
questions: undefined,
// format: undefined,
// delimiter: ',',
// types: {
//     question: 'q',
//     option: '',
// },
// convert: true,
quest: true,
// quest: {
//     shuffleQuestions: false,
//     shuffleOptions: false,
// }
});
dialog : A dialog game object.
UI plugin does not included in this template, install it before creating a dialog game object.
Reuse/update dialog game object for each question.
The number of choice buttons should be equal or larger than the maximun number of options.
Other parameters : See quest
Flow chart¶
graph TB
Start["quest.start()"] --> EventUpdateChoice["quest.emit('update-choice', choice, option, quest)<br>----<br>Update each choice button via question.option[i]"]
EventUpdateChoice --> EventUpdateDialog["quest.emit('update-dialog', dialog, question, quest)<br>----<br>Update dialog, action button via question"]
EventUpdateDialog --> EventClickChoice["quest.emit('click-choice', choice, dialog, quest)<br>----<br>Click any choice button"]
EventClickChoice --> EventClickAction["quest.emit('click-action', action, dialog, quest)<br>----<br>Click any action button"]
EventClickAction --> IsLast{"quest.isLast()"}
EventClickChoice --> IsLast
IsLast --> |No| Next["quest.next()"]
IsLast --> |Yes| Complete("Complete")
Next --> EventUpdateChoice
Events¶
Update dialog events
Update each choice button via question.option[i]
quest.on('update-choice', function(choice, option, quest){
}, scope);
choice : Choice button game object.
Unused choice button game object will be hideen.
option : Option object.
quest : Quest object.
Update dialog, action buttos via question
quest.on('update-dialog', function(dialog, question, quest){
}, scope);
dialog : Dialog game object.
Call dialog.layout() if needs.
question : Question object.
quest : Quest object.
Button clicking events
Click choice button
quest.on('click-choice', function(choice, dialog, quest) {
}, scope);
choice : Clicked choice button game object.
dialog : Dialog game object.
quest : Quest object.
Click choice button
quest.on('click-action', function(action, dialog, quest) {
}, scope);
choice : Clicked action button game object.
dialog : Dialog game object.
quest : Quest object.
Quest methods¶
Start quest
quest.start();
Next quest
quest.next();
or
quest.next(key);
Is last question
var isLast = quest.isLast();
Remove all questions
quest.removeAll();
Add questions
quest.add(questions, config);
questions : An array of question objects, or a csv string. See questions section in Create question manager instance section.
config :
delimiter : Delimiter of csv string. Default value is ','
types : Define value of row type.
types.question : Define value of question row. Default value is q.
types.option : Define value of option row. Default value is '' (empty string).
convert : Convert string values to other types.
Default type converting : Convert string to number, boolean, null, or string
'0', '1', ... (number string) -> number
'true', or 'false' -> true or false
'' (empty string) -> null
Others : string.
Set false to ignore types converting, i.e. all values are string.
A custom type converting function :
function(stringValue, key) {
// return value;
}
Private data methods¶
Get data
var value = quest.getData(key, defaultValue);
Get all data
var data = quest.getData();
Set value
quest.setData(key, value);
Increase value
quest.incData(key, inc, defaultValue);
Multiple value
quest.mulData(key, mul, defaultValue);
Clear all data
quest.clearData();