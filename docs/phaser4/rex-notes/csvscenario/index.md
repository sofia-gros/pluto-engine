CSV scenario
Introduction¶
Run script in csv format. Csv could be edited by excel or google document.
Author: Rex
Member of scene
Live demos¶
CSV-scenario
With TextPlayer
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexcsvscenarioplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcsvscenarioplugin.min.js', true);
Add csv-scenario object
var scenario = scene.plugins.get('rexcsvscenarioplugin').add(scene);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import CsvScenarioPlugin from 'phaser4-rex-plugins/plugins/csvscenario-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexCsvScenario',
plugin: CsvScenarioPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add csv-scenario object
var scenario = scene.plugins.get('rexCsvScenario').add(scene);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import CsvScenario from 'phaser4-rex-plugins/plugins/csvscenario.js';
Add csv-scenario object
var scenario = new CsvScenario(scene);
Create instance¶
var scenario = scene.plugins.get('rexCSVScenario').add(scene, {
// timeUnit: 0,        // 'ms'|0|'s'|'sec'|1
// prefix: /^#([a-zA-Z]+)/
// argsConvert: true,
// argsConvertScope: undefined,
// delimiter: ','
// translateCommandNameCallback: undefined,
});
csvString : Commands in csv-string.
scope : Running commands via methods in this scope object.
Get scope : var scope = scenario.scope
timeUnit: time-unit of dt, for delay-execution
'ms', or 0 : dt in millisecond
's', 'sec', or 1 : dt in second
prefix: regex of picking control instructions
argsConvert: A callback to convert parameters of run-custom-function
true : Use defaule value converter. Values will be converted to number (include hex number string like '0xFF'), boolean, null, or string.
Function object:
function(s) {
return s;
}
argsConvertScope: scope of argsConvert
delimiter : Delimiter of CSV string.
translateCommandNameCallback : Callback to translate custom command name
undefined : Use original custom command name. Default behavior.
A function, return new custom command name.
function(commandName) {
return newCommandName;
}
Load csv script¶
scenario.load(csvString, scope, {
// timeUnit: 0,        // 'ms'|0|'s'|'sec'|1
// prefix: /^#([a-zA-Z]+)/
// argsConvert: true,
// argsConvertScope: undefined,
// delimiter: ',',
// translateCommandNameCallback: undefined,
})
csvString : Commands in csv-string.
scope : Running commands via methods in this scope object.
Get scope : var scope = scenario.scope
timeUnit: time-unit of dt, for delay-execution
'ms', or 0 : dt in millisecond
's', 'sec', or 1 : dt in second
prefix: regex of picking control instructions
argsConvert: A callback to convert parameters of run-custom-function
true : Use defaule value converter. Values will be converted to number (include hex number string like '0xFF'), boolean, null, or string.
Function object:
function(s) {
return s;
}
argsConvertScope: scope of argsConvert
delimiter : Delimiter of CSV string.
Append csv script¶
scenario.append(csvString);
Start running instructions¶
scenario.start({
// label: '',
// offset: 0
})
scenario.play({
// label: '',
// offset: 0
})
label : Go to the label and execute. '' label is starting from 1st instruction
offset : Offset time
or
scenario.playPromise({
// label: '',
// offset: 0
})
.then(function(){
// On complete
})
Events¶
Complete
scenario.on('complete', function(scope, scenario){
});
Wait event
scenario.on('wait.' + eventName, function(scenario){
});
scenario.on('wait', function(eventName, scenario){
});
Label has changed
scenario.on('labelchange', function(lastLabel, prevLabel, scope, scenario){
});
Dump execution log
scenario.on('log', function(msg, scope, scenario){
});
Notify error
scenario.on('error', function(msg, scope, scenario){
});
Types of instructions¶
Each row in csv table is an instruction.
Run custom function¶
Run custom function of scope, which passed from scenario.load(...)
Format:
-,fnName,param0,param1,...
1st column of instruction: -
Parameters will be converted to number, boolean, null, or string by default.
Method name of last custom command :
var methodName = scenario.lastCustomCommandName;
An error event will be fired if fnName is invalid in scope.
Delay execution¶
Run custom function after a delay.
Format:
time,fnName,param0,param1,...
1st column of instruction: a number
time-unit of delay is set from scenario.load(...)
Parameters will be converted to number, boolean, null, or string by default.
Wait then execution¶
Run custom function until scenario.continue(eventName)
Format:
eventName,fnName,param0,param1,...
1st column of instruction: not a number, not a string start from #
Execution will be hang until scenario.continue(eventName) is called
Parameters will be converted to number, boolean, null, or string by default.
Skip waiting¶
scenario.continue(true);
Task¶
Sample code
Scenario will be paused if custom function return an event emitter, resumed when that evnt emitter fires complete event.
See also: Sequence
Label¶
Sample code
A label for #GOTO or #IF instructions.
Format:
#LABEL,label
1st column of instruction: #LABEL, case insensitive.
Label '' is reserved, don't use '' for label name.
Example: A label named 'AA'
#LABEL,AA
Last label :
var label = scenario.lastLabel;
Previous label :
var previousLabel = scenario.previousLabel;
Exit¶
Exit current execution.
Format:
#EXIT
1st column of instruction: #EXIT, case insensitive.
Goto¶
Sample code
Go to label and execute.
Format:
#GOTO,label
1st column of instruction: #GOTO, case insensitive.
An error event will be fired if label is not found.
Example: Goto label 'AA'
#GOTO,AA
If-goto¶
Sample code
Go to trueLabel if condition is true, otherwise go to falseLabel.
Format:
#IF,condition,trueLabel,falseLabel
1st column of instruction: #IF, case insensitive.
conditon: boolean equation
this is the scope passed from scenario.load(...)
trueLabel/falseLabel: go to this label if condition is true/false
run next instruction if label is ''
An error event will be fired if label is not found.
Example: Goto label 'AA' if (this.coin > 100), else run next instruction
#IF,this.coin > 100,AA
Wait¶
Run next instruction after a delay time, or scenario.continue(eventName).
Format:
#WAIT,time
#WAIT,eventName
1st column of instruction: #WAIT, case insensitive.
2nd colume of instruction:
a number: a delay time
time-unit of delay is set from scenario.load(...)
a string: an event name for scenario.continue(eventName)
Example:
Wait 1 time-unit
#WAIT,1
Wait until 'click'
#WAIT,click
scenario.continue('click');
Pause¶
scenario.pause();
Resume¶
scenario.resume();
Time-scale¶
Get
var timeScale = scenario.timeScale;
Set
scenario.setTimeScale(timeScale);
// scenario.timeScale = timeScale;
Clear¶
Stop running and clear instructions.
scenario.clear();
States¶
Is running
var isRunning = scenario.isRunning;
Is paused
var isPaused = scenario.isPaused;