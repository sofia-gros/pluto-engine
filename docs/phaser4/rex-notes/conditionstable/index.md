CSV Conditions table
Introduction¶
Check conditions to find passed tests listed in a csv table.
Author: Rex
Member of scene
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexconditionstableplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexconditionstableplugin.min.js', true);
Add conditions-table object
var conditionstable = scene.plugins.get('rexconditionstableplugin').add();
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import ConditionsTablePlugin from 'phaser4-rex-plugins/plugins/conditionstable-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexConditionsTable',
plugin: ConditionsTablePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add conditions-table object
var conditionstable = scene.plugins.get('rexConditionsTable').add();
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import ConditionsTable from 'phaser4-rex-plugins/plugins/conditionstable.js';
Add conditions-table object
var conditionstable = new ConditionsTable();
Create instance¶
var table = scene.plugins.get('rexConditionsTable').add();
Load table from csv string¶
table.loadCSV(csvString, {
// delimiter: ','
});
For exameple, csv string
name
A
A
B
Test1
>= 10
<= 20
Test2
3
,A,A,B
Test1,>= 10,<= 20,
Test2,,,3
means that:
Test1: (A>=10) && (A<=20)
Test2: (B==3)
Equations will be evaled by new Function.
Test¶
Get test results¶
var results = table.getTestResults(context);
context : Inputs in Key-value pairs
results : {name: boolean}, use OR operation to combine result of tests with the same name.
Get first pass test name¶
var testName = table.anyPassTest(context);
context : Inputs in Key-value pairs