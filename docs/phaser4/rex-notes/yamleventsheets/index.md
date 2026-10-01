YAML event sheets
Introduction¶
Event sheets contains main condition(s) and actions, in YAML format.
Author: Rex
Member of scene
Live demos¶
Command executor
Usage¶
Sample code
Event sheets
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexyamleventsheetsplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexyamleventsheetsplugin.min.js', true);
Add event-sheet-manager object
var eventSheetManager = scene.plugins.get('rexyamleventsheetsplugin').add(config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import YAMLEventSheetsPlugin from 'phaser4-rex-plugins/plugins/yamleventsheets-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexYAMLEventSheets',
plugin: YAMLEventSheetsPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add event-sheet-manager object
var eventSheetManager = scene.plugins.get('rexYAMLEventSheets').add(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import YAMLEventSheets from 'phaser4-rex-plugins/plugins/yamleventsheets.js';
Add event-sheet-manager object
var eventSheetManager = new YAMLEventSheets(config);
Create instance¶
var eventSheetManager = scene.plugins.get('rexYAMLEventSheets').add({
commandExecutor: Object,
parallel: false
});
commandExecutor : Command executor of actions.
This plugin provides a built-in command executor.
parallel :
false : Test condition then execute event sheet one by one. Default behavior.
true : Test all condition of event sheets then execute event sheets one by one.
Add event sheet¶
Each event sheet belong a group.
eventSheetManager.addEventSheet(content, {
parallel: undefined,
active: true,
once: false
})
or
eventSheetManager.addEventSheet(content, groupName, {
parallel: undefined,
active: true,
once: false
})
or
eventSheetManager.addEventSheet(content, {
groupName: '_',
parallel: undefined,
active: true,
once: false
})
content : See structure of event sheet
parallel :
undefined : Use default parallel property.
active :
true : Eval condition of this event sheet every round. Default behavior.
false : Skip this event sheet.
once :
true : Set active of this event sheet to false when exection of this event sheet is complete.
false : Do nothing when exection of this event sheet is complete. Default behavior.
groupName : Each event sheet belong a group. Ignore this parameter to use default group.
'_' : Default group name.
Remove event sheet¶
Remove an event sheet immediately in default group
eventSheetManager.removeEventSheet(title);
Remove an event sheet immediately in a specific group
eventSheetManager.removeEventSheet(title, groupName);
Remove an event sheet at the next safe point.
If the group is running, the event sheet is marked for removal and removed before the current round fires the 'complete' event.
If the group is not running, the event sheet is removed immediately.
eventSheetManager.removeEventSheetLater(title);
eventSheetManager.removeEventSheetLater(title, groupName);
Remove all event sheets immediately in default group
eventSheetManager.removeAllEventSheets();
Remove all event sheets immediately in a specific group
eventSheetManager.removeAllEventSheets(groupName);
Remove all event sheets at the next safe point.
If the group is running, all event sheets are marked for removal and removed before the current round fires the 'complete' event.
If the group is not running, all event sheets are removed immediately.
eventSheetManager.removeAllEventSheetsLater();
eventSheetManager.removeAllEventSheetsLater(groupName);
Start running¶
Starting command will be ignored if group is running.
Start running a group of event sheets¶
Start running default group
eventSheetManager.startGroup();
Start running a specific group of event sheets
eventSheetManager.startGroup(groupName);
Flow chart¶
graph TD
startGroup{{"startGroup()"}}  ------>  eventstart>Fire event\nstart]
eventstart --> foreacheventsheet((For each\nevent sheet))
foreacheventsheet --> |Next| activate{activate}
subgraph Event sheet
activate --> |True| condition{"Test\n[condition]"}
condition --> |True| enterevent>Fire event\neventsheet.enter]
condition --> |False| eventcatch>Fire event\neventsheet.catch]
subgraph Run
enterevent --> actions[Run\nactions\n...\n...]
actions --> exitevent>Fire event\neventsheet.exit]
end
subgraph Catch
eventcatch --> catch["Run\n[catch]"]
end
end
exitevent --> foreacheventsheet
catch --> foreacheventsheet
activate --> |False| foreacheventsheet
foreacheventsheet --> eventcomplete>Fire event\ncomplete]
eventcomplete --> endnode{{End}}
Start running a event sheet in a group¶
Start running default group
eventSheetManager.start();
Start running an event sheet (indexed by title) without condition testing, in default group.
eventSheetManager.start(title);
Start running an event sheet (indexed by title) without condition testing, in a specific group.
eventSheetManager.start(title, groupName);
Start running an event sheet (indexed by title) with condition testing, in default group.
eventSheetManager.start(title, false);
Start running an event sheet (indexed by title) with condition testing, in a specific group.
eventSheetManager.start(title, groupName, false);
Start running an event sheet (indexed by title) with scoped injected data, in a specific group.
eventSheetManager.start(title, groupName, ignoreCondition, injectData);
Injected data is available during this run, including after pauseEventSheet() and resume. It is restored when this run completes or stops.
Start running and wait for completion by promise.
await eventSheetManager.startPromise();
await eventSheetManager.startPromise(title);
await eventSheetManager.startPromise(title, groupName);
await eventSheetManager.startPromise(title, ignoreCondition);
await eventSheetManager.startPromise(title, groupName, ignoreCondition);
await eventSheetManager.startPromise(title, groupName, ignoreCondition, injectData);
Promise methods reject if the target group is already running.
Start running a group by event¶
eventSheetManager.startGroup({
eventName:
groupName:
once: false
});
or
Start running a group and wait for completion by promise.
await eventSheetManager.startGroupPromise();
await eventSheetManager.startGroupPromise(groupName);
Promise is resolved when this group completes, and rejects if this group is already running.
Running a event sheet once¶
Run an event sheet content immediately, then remove it after completion.
eventSheetManager.runEventSheetOnce(content);
or
eventSheetManager.runEventSheetOnce(content, {
title: undefined,
ignoreCondition: true,
injectData: undefined
});
or
eventSheetManager.runEventSheetOnce(content, config, injectData);
content : See structure of event sheet
title : Title of this temporary event sheet.
undefined : Generate an internal title.
ignoreCondition :
true : Run without condition testing. Default behavior.
false : Run with condition testing.
injectData : Scoped data injected during this run. It is restored when this
run completes or stops.
The event sheet is added to an internal temporary group. This group is removed
after the event sheet completes, so this event sheet will not remain in the
manager.
Run once and wait for completion by promise.
await eventSheetManager.runEventSheetOncePromise(content);
or
await eventSheetManager.runEventSheetOncePromise(content, {
title: undefined,
ignoreCondition: true,
injectData: undefined
});
or
await eventSheetManager.runEventSheetOncePromise(content, config, injectData);
Promise is resolved when this temporary event sheet completes.
Round counter¶
Round counter is started from 0.
Increase round counter
eventSheetManager.updateRoundCounter();
// eventSheetManager.$roundCounter += 1;
Set round counter
eventSheetManager.updateRoundCounter(value);
// eventSheetManager.$roundCounter = value;
Get round counter
var roundCounter = eventSheetManager.getRoundCounter();
// var roundCounter = eventSheetManager.$roundCounter;
Active¶
Activate state of event sheet (indexed by title)
eventSheetManager.setEventSheetActiveState(title);
// eventSheetManager.setEventSheetActiveState(title, true);
Inactivate state of event sheet (indexed by title)
eventSheetManager.setEventSheetActiveState(title, false);
Get active state of event sheet (indexed by title)
var active = eventSheetManager.getEventSheetActiveState(title);
Note
Event sheet which has once property will set active property to false
when exection of this event sheet is complete.
Stop running¶
Stop running a group of event sheet, also fires 'eventsheet.exit' event.
And game objects with 'autoClear' will be destroyed.
Stop running default group
eventSheetManager.stopGroup();
or
eventSheetManager.stop();
Stop running a specific group of event sheets
eventSheetManager.stopGroup(groupName);
or
eventSheetManager.stop(groupName);
Global memory¶
Global memory is shared for all event sheets.
Set value
eventSheetManager.setData(key, value);
or
eventSheetManager.setData(data);  // data : a plain json object
Toggle value
eventSheetManager.toggleData(key, value);
Increase value
eventSheetManager.incData(key, inc);
Get value
var value = eventSheetManager.getData(key);
Has key
var hasData = eventSheetManager.hasData(key);
Global memory as a dictionary
var data = eventSheetManager.memory;
Custom expression¶
Custom expression methods can be injected in 2 ways.
Add a function to event sheet global memory/context by eventSheetManager.addExpression().
Add a method to commandExecutor
Using commandExecutor.addExpressionMethod() for built-in command executor
They can be used in number expressions or string templates.
- name: setData
parameters: { coin: "#(randomInt(1, 10))" }
- name: print
parameters: { text: "coin = {{randomInt(1, 10)}}" }
Expression parser function¶
eventSheetManager.addExpression(name, callback);
name : A string value
callback : A function object returns a value
function(a, b, c, ...) { return x; }
For example :
eventSheetManager.addExpression('randomInt', function (a, b) {
return Math.floor(a + Math.random() * (b - a + 1));
});
These functions are stored in global memory.
Command executor expression method¶
commandExecutor.randomInt = function(args, context) {
var [param0, param1] = args;
return Math.floor(a + Math.random() * (b - a + 1));
}
or
commandExecutor.addExpressionMethod(name, callback, scope);
when using built-in command executor
name : A string value.
callback : A function object returns a value.
function(args, context) {
var [param0, param1] = args;
return Math.floor(a + Math.random() * (b - a + 1));
}
args : Evaluated arguments passed from expression calls.
context : Expression evaluation context.
scope : Callback scope.
For example :
commandExecutor.addExpressionMethod('randomInt', function (args) {
var [a, b] = args;
return Math.floor(a + Math.random() * (b - a + 1));
});
When an expression method is not found in the expression parser context,
event sheet manager tries to invoke the method with the same name on commandExecutor.
Parameter expression¶
A condition can also invoke a method of commandExecutor by using an object with name and parameters.
condition:
name: expressionName
parameters:
param0: value
param1: value
name : Method name of commandExecutor.
parameters : Parameters passed to this method.
Return value : A boolean or number value. The condition passes when this value is truthy.
The method callback has this signature.
expressionName(parameters) {
return value;
}
For example :
class CommandExecutor {
cmp({ opA, cmp, opB } = {}) {
switch (cmp) {
case '==': return opA == opB;
case '!=': return opA != opB;
case '>': return opA > opB;
case '>=': return opA >= opB;
case '<': return opA < opB;
case '<=': return opA <= opB;
default: return false;
}
}
}
condition:
name: cmp
parameters: { opA: "#(coin)", cmp: "<", opB: "#(5)" }
States¶
Dump state of event sheets of all groups
var states = eventSheetManager.dumpState();
Load state of event sheet of all groups
eventSheetManager.loadState(states);
Events¶
Event sheet group¶
Start running a group of event sheets
eventSheetManager.on('start', function(groupName, eventSheetManager, eventSheetGroup) {
});
Continue running a group of event sheets after a pause or between pending sheets
eventSheetManager.on('continue', function(groupName, eventSheetManager, eventSheetGroup) {
});
A group of event sheets has been executed completed
eventSheetManager.on('complete', function(groupName, eventSheetManager, eventSheetGroup) {
});
Stop a group of event sheets and abort pending event sheets
eventSheetManager.on('stop', function(groupName, eventSheetManager, eventSheetGroup) {
});
Event sheet¶
Open an event sheet for condition evaluation and execution
eventSheetManager.on('eventsheet.open', function(sheetTitle, groupName, eventSheetManager, eventSheet, eventSheetGroup) {
});
Finish event sheet condition evaluation
eventSheetManager.on('eventsheet.condition', function(sheetTitle, groupName, conditionPassed, eventSheetManager, eventSheet, eventSheetGroup) {
});
Enter an event sheet whose condition passed
eventSheetManager.on('eventsheet.enter', function(sheetTitle, groupName, eventSheetManager, eventSheet, eventSheetGroup) {
});
Catch an event sheet whose condition did not pass
eventSheetManager.on('eventsheet.catch', function(sheetTitle, groupName, eventSheetManager, eventSheet, eventSheetGroup) {
});
Tick an opened event sheet
eventSheetManager.on('eventsheet.tick', function(sheetTitle, groupName, eventSheetManager, eventSheet, eventSheetGroup) {
});
Finish ticking an event sheet and report behavior-tree status
eventSheetManager.on('eventsheet.status', function(sheetTitle, groupName, status, eventSheetManager, eventSheet, eventSheetGroup) {
});
Close an event sheet at the end of this round
eventSheetManager.on('eventsheet.close', function(sheetTitle, groupName, eventSheetManager, eventSheet, eventSheetGroup) {
});
Exit an event sheet whose condition passed
eventSheetManager.on('eventsheet.exit', function(sheetTitle, groupName, eventSheetManager, eventSheet, eventSheetGroup) {
});
Skip an event sheet before opening it
eventSheetManager.on('eventsheet.skip', function(sheetTitle, groupName, reason, eventSheetManager, eventSheet, eventSheetGroup) {
});
Abort a pending event sheet during group stop
eventSheetManager.on('eventsheet.abort', function(sheetTitle, groupName, eventSheetManager, eventSheet, eventSheetGroup) {
});
Break current event sheet round while keeping behavior-tree state running
eventSheetManager.on('eventsheet.roundbreak', function(sheetTitle, groupName, eventSheetManager, eventSheet, actionNode, eventSheetGroup) {
});
Label¶
Enter a label in an event sheet
eventSheetManager.on('label.enter', function(labelTitle, sheetTitle, groupName, eventSheetManager, eventSheet, labelNode, eventSheetGroup) {
});
Exit a label in an event sheet
eventSheetManager.on('label.exit', function(labelTitle, sheetTitle, groupName, eventSheetManager, eventSheet, labelNode, eventSheetGroup) {
});
Command¶
Start executing a command task
eventSheetManager.on('command.start', function(commandName, parameters, sheetTitle, groupName, eventSheetManager, eventSheet, taskNode, eventSheetGroup) {
});
Finish executing a command task
eventSheetManager.on('command.end', function(commandName, parameters, success, result, sheetTitle, groupName, eventSheetManager, eventSheet, taskNode, eventSheetGroup) {
});
Pause a command task and wait for resume
eventSheetManager.on('command.pause', function(commandName, parameters, sheetTitle, groupName, eventSheetManager, eventSheet, taskNode, eventSheetGroup) {
});
Resume a paused command task
eventSheetManager.on('command.resume', function(commandName, parameters, sheetTitle, groupName, eventSheetManager, eventSheet, taskNode, eventSheetGroup) {
});
Abort a command task
eventSheetManager.on('command.abort', function(commandName, parameters, sheetTitle, groupName, eventSheetManager, eventSheet, taskNode, eventSheetGroup) {
});
Condition¶
Evaluate a condition on the execution path
eventSheetManager.on('condition.eval', function(expression, result, sheetTitle, groupName, eventSheetManager, eventSheet, conditionNode, eventSheetGroup) {
});
expression : Serialized condition expression.
result : Boolean result of this condition.
Repeat¶
Complete one repeat iteration
eventSheetManager.on('repeat.iteration', function(iterationIndex, maxLoop, status, sheetTitle, groupName, eventSheetManager, eventSheet, repeatNode, eventSheetGroup) {
});
iterationIndex : Completed repeat iteration index, 1-based.
maxLoop : Maximum repeat loop count.
status : Behavior-tree status code returned from this iteration.
Input pause¶
Wait for pointer click
eventSheetManager.on('pause.click', function() {
});
Wait for a keyboard key
eventSheetManager.on('pause.key', function(key) {
});
Wait for pointer input
eventSheetManager.on('pause.input', function() {
});
Resume from pointer input
eventSheetManager.on('resume.input', function() {
});
Structure of event sheet¶
Sample
Main headings¶
title: Title
groupName:
parallel:
active: false
once: false
condition: expression
script:
fallback:
title : Title of this event sheet
groupName : Assign groupName in event sheet, put this event sheet in to that group.
parallel : Set parallel property of this event sheet to true.
active=false : Set active property of this event sheet to false.
once : Set once property of this event sheet to true.
condition : Main condition.
See Condition expression
script : Actions when main condition is true.
Flow control instructions
Actions : Custom command
fallback : Actions when main condition is false.
Condition expression¶
condition fields can be used in the main heading, branches of If, For loop, While loop, Label, flow-control actions, and Custom command.
A string : Single boolean expression.
condition: "hp > 0 && mp > 0"
Read data from global memory.
Boolean expression AND : &&.
Boolean expression OR : ||.
A logical expression object : Compose string expressions, parameter expression objects, or nested logical expression objects.
all, or and : All child expressions must be truthy.
any, or or : At least one child expression must be truthy.
not : Invert one child expression.
condition:
all:
- name: notBusy
parameters:
characterId: character_alice
- any:
- "coin > 10"
- name: characterStatus
parameters:
characterId: character_alice
field: stamina
operator: ">="
value: 30
- not:
name: hasTag
parameters:
characterId: character_alice
tag: sleeping
An array : Represents OR, elements can be
A string : Single expression
An array : Represents AND, e.g., ["a", "b"] -> (a) && (b)
A logical expression object, e.g. {and: [...]}, {or: [...]}, {not: ...}
condition:
- "score > 0"                    # (score > 0)
- ["hp > 0", "mp > 0"]           # OR ((hp > 0) && (mp > 0))
- and: ["stage == 1", "boss"]    # OR ((stage == 1) && (boss))
- not: "isBusy"
A parameter expression object : Invoke a method of commandExecutor and use its return value.
condition:
name: cmp
parameters: { opA: "#(coin)", cmp: "<", opB: "#(5)" }
See Parameter expression.
Priority order when parsing an object : and/all, or/any, not, then parameter expression object.
When omitted, defaults to true.
Flow control instructions¶
If, Else if, Else¶
- type: if
branches:
- condition: coin > 10  # IF
- actions:
# - name:
- condition: (coin > 5) && (coin <10)  # ELSE IF
- actions:
# - name:
- actions:  # ELSE
# - name:
type: if with branches:, each branch contains condition: expression, and actions:
condition: expression
See Condition expression.
No condition : ELSE part
And actions:, run actions when expression is true.
Note
Using Label with condition: expression for single if condition
Repeat loop¶
- type: repeat
times: 3
actions:
# - name:
or
- type: repeat
times: loopCount
actions:
# - name:
or
- times: 3
actions:
# - name:
For loop¶
- type: for
init:
# - name:
condition: expression
step:
# - name:
actions:
# - name:
type: for
init : Actions executed at the beginning
condition: expression : Evaluate the condition at the beginning of each loop.
See Condition expression.
step : Actions executed at the end of each loop
And actions:, the loop body.
While loop¶
- type: while
condition: loopCount > 0
actions:
# - name:
Label¶
- title: labelTitle
actions:
# - name:
or
- actions:
# - name:
or
- title: labelTitle
type: label
actions:
# - name:
or
- title: labelTitle
condition: expression
type: label
actions:
# - name:
or
- condition: expression
actions:
# - name:
title: labelTitle : Optional title name.
actions : Run commands sequentially
condition: expression : Run commands if expression return true, optional
See Condition expression.
Each custom command can have this condition property, including all command in Command executor
Break¶
- type: break
or
- type: break
condition: expression
Action type: break : Ignore remainder actions in current level.
Continue¶
- type: continue
or
- type: continue
condition: expression
Action type: continue : Simulate continue instruction of programming language.
Next round¶
- type: next-round
or
- type: next-round
condition: expression
Action type: next-round : Stop current event sheet execution in this round, keep behavior-tree state as RUNNING, then continue from the next action in the next round.
Exit¶
- type: exit
or
- type: exit
condition: expression
Action type: exit : Skip remainder instructions.
Deactivate¶
- type: deactivate
or
- type: deactivate
target: eventSheetTitle
or
- type: deactivate
condition: expression
target: eventSheetTitle
Action type: deactivate : Deactivate this event sheet, or deactivate event sheet by title in the same tree group. i.e. Set active property of this event shhet to false.
Activate¶
- type: activate
or
- type: activate
target: eventSheetTitle
or
- type: activate
condition: expression
target: eventSheetTitle
Action type: activate : Activate this event sheet, or activate event sheet by title in the same tree group. i.e. Set active property of this event shhet to true.
Custom command¶
- type: command
name: commandName
parameters:
param0: value
param1: value
or
- name: commandName
parameters:
param0: value,
param1: value
or
- condition: expression
name: commandName
parameters:
param0: value
param1: value
name: commandName :
Invoke commandExecutor.commandName method if this commandName method is existed.
commandName(config, eventSheetManager) {
// var resumeCallback = eventSheetManager.pauseEventSheet();
// ...
// resumeCallback()
}
config : Parameter and value in a dictionary.
eventSheetManager : This event mangager.
Pause running of current event sheet
var resumeCallback = eventSheetManager.pauseEventSheet();
//  resumeCallback();  // Resume running of current event sheet
Pause running of current event sheet until another eventName firing from eventEmitter
eventSheetManager.pauseEventSheetUnitlEvent(eventEmitter, eventName);
Return value
An event emitter : Current command returns RUNNING until the event emitter fires the complete event.
If command execution is paused by eventSheetManager.pauseEventSheet(), current command returns RUNNING until the resume callback is invoked.
undefined or any truthy value : Current command returns SUCCESS.
Explicit falsy value, such as false, null, or 0 : Current command returns FAILURE.
Otherwise, invoke commandExecutor.defaultHandler.
defaultHandler(commandName, config, eventSheetManager) {
// var resumeCallback = eventSheetManager.pauseEventSheet();
// ...
// resumeCallback()
}
commandName : Command name.
config : Parameter and value in a dictionary.
eventSheetManager : This event mangager.
Pause running of current event sheet
var resumeCallback = eventSheetManager.pauseEventSheet();
//  resumeCallback();  // Resume running of current event sheet
Pause running of current event sheet until another eventName firing from eventEmitter
eventSheetManager.pauseEventSheetUnitlEvent(eventEmitter, eventName);
Return value
undefined or any truthy value : Current command returns SUCCESS.
Explicit falsy value, such as false, null, or 0 : Current command returns FAILURE.
An event emitter : Current command returns RUNNING until the event emitter fires the complete event.
If command execution is paused by eventSheetManager.pauseEventSheet(), current command returns RUNNING until the resume callback is invoked.
condition: expression : Run command if expression return true, optional
See Condition expression.
Each custom command can have this condition property, including all command in Command executor
Command executor¶
A command executor for phaser3 engine.
Create command executor instance¶
var commandExecutor = scene.plugins.get('rexYAMLEventSheets').addCommandExecutor(scene, {
// layers: ['layer0', 'layer1', ...]
// layers: [{name, cameraName}, ...]
// layerDepth: undefined,
// rootLayer: undefined,
log: {
delimiters: '[]'
enable: true
}
});
// Add to event sheet manager
// var eventSheetManager = scene.plugins.get('rexYAMLEventSheets').add({
//     commandExecutor: commandExecutor
// });
or
// import YAMLEventSheets from 'phaser4-rex-plugins/plugins/yamleventsheets.js';
// import CommandExecutor from 'phaser4-rex-plugins/plugins/commandexecutor.js';
var commandExecutor = new CommandExecutor(scene, config);
// var eventSheetManager = new YAMLEventSheets({
//     commandExecutor: commandExecutor
// });
layers : Add some initial layers
A string array : Add layers by string name
A array of plain object { name, cameraName }
Add layer by string name
Bind this layer to dedicate camera (indexed by cameraName), ignore other cameras
Add a new camera if this target camera is not existing
layerDepth : Set depth to each layer game object.
undefined : Keep default depth value (0)
rootLayer : Add all layer game objects created by layer-manager into this root layer.
log : Configuration of BBCodeLog
log.delimiters : String of left-delimiter and right-delimiter.
A single string with 2 characters. Default value is '[]'.
A array with 2 strings
log.enable :
true : Can print message on console. Default behavior.
false : Don't print any message on console.
Global memory of event sheet manager¶
Set value by key
- name: setData
parameters: { key: value }
Increase value of key
- name: incData
parameters: { key: value }
or
- name: setData
parameters: { key: "#(key+value)" }
Toggle value of key
- name: toggleData
parameters: { key: true }
See global memory
BBCode Log¶
Print message on console¶
- name: log
parameters: { text: "..." }
or
- name: log
parameters:
logType: log
showTitle: true
titleL : "..."
titleColor: green
text: "..."
# condition: expression
text : Message with bbcode format.
[color=gold]...[/color]
[bgcolor=green]...[/bgcolor]
[b]...[/b]
[i]...[/i]
[u]...[/u]
logType :
'log' : console.log. Default value.
'warn': console.warn
showTitle
true : Show title before text message. Default behavior.
false : Don't show title.
title
undefined : Using title of current event sheet. Default behavior.
A string, custom string before text message.
titleColor : Background color of title block, default value is 'green'
Disable console message¶
- name: log.disable
Disable console message of current event sheet.
or
- name: log.disable
parameters: {title: "..." }
# condition: expression
title : Disable console message of event sheet by title.
Enable console message¶
- name: log.enable
Enable console message of current event sheet.
or
- name: log.enable
paramterers : { title: "..." }
# condition: expression
title : Enable console message of event sheet by title.
Dump memory¶
- name: log.memory
Dump all key in memory
or
- name: log.memory
parameters:
text: "..."
keys: "a,b,c"
# condition: expression
keys : Dump part of memory by keys.
text : Message with bbcode format.
Game object¶
Register custom game object¶
commandExecutor.addGameObjectManager({
name: GOTYPE,
viewportCoordinate: false,
// viewportCoordinate: { viewport: new Phaser.Geom.Rectangle() },
fade: 500,
// fade: {mode: 'tint', time: 500},
defaultLayer: layerName,
autoClear: true,
commands: {
commandName(gameObject, config, commandExecutor, eventSheetManager, eventSheet) {
// commandExecutor.waitEvent(eventEmitter, eventName);
}
}
})
name : A string name of game object's type. Will register command GOTYPE to this command executor.
createGameObject : A callback for creating game object
function(scene, config) {
return gameObject;
}
config : Parameters passed from event sheet.
id, layer, autoClear, eventSheetManager, eventsheet : These parameters are reserved.
eventSheetManager : This event sheet manager.
viewportCoordinate : Apply viewportCoordinate behavior to game object.
true : Attach vpx, vpy, vp to sprite game object.
vpx, vpy : Number between 0~1. Proportion of viewport.
vp : Viewport in rectangle
false : Do nothing, default behavior.
fade :
0 : No fade-in or fade-out when adding or removing a sprite.
A number : Duration of fading. Default value is 500.
A plain object contains mode, time
fade.mode : Fade mode
'tint', or 0 : Fade-in or fade-out via tint property.
'alpha', or 1 : Fade-in or fade-out via alpha property.
'revealUp', or 2 : Reveal up for fade-in.
'revealDown', or 3 : Reveal down for fade-in.
'revealLeft', or 4 : Reveal left for fade-in.
'revealRight', or 5 : Reveal right for fade-in.
fade.time : Duration of fading. Default value is 500.
defaultLayer : A layer name defined in layers parameter of addCommandExecutor method
autoClear :
true : Clear game objects when exiting current event sheet. Default behavior.
false : Ignore this behavior.
commands : Custom commands, each command is a callback indexed by command name
commandName: function(gameObject, config, commandExecutor, eventSheetManager) {
// commandExecutor.waitEvent(eventEmitter, eventName);
}
commandName : Command name. These command names are reserved : to, yoyo, destroy
gameObject : Game object instance.
config : Parameters passed from event sheet.
commandExecutor : This command executor instance. See also
eventSheetManager : This event sheet manager instance.
Store variable into blackboard of eventSheetManager : eventSheetManager.setData(key, value)
Create custom game object¶
- name: GOTYPE
parameters:
id: NAME
layer:
autoClear:
param0: value
param1: value
# condition: expression
Create custom game object GOTYPE with config {param0, param1}, indexed by id
layer : Put this game object at layer.
undefined : Put this game object at default layer
autoClear : Clear game objects when exiting current event sheet.
undefined : Use default value of autoClear
Reserved id : time, click, key, bgm, bgm2, se, se2, camera.
Will store reference of this game object into memory at key @NAME,
can see it by log.memory, or get property of game object via #(@NAME.x + 3).
Set properties of custom game object¶
Set properties of a game object indexing by NAME
- name: NAME.set
parameters:
x:
vpx:
y:
vpy:
alpha:
# condition: expression
vpx, vpy : viewportCoordinate properties injected if viewportCoordinate is true.
Add empty line above and below this command block.
Set properties of all game objects belong GOTYPE
- name: GOTYPE.set
parameters:
x:
vpx:
y:
vpy:
alpha:
# condition: expression
Set properties of all game objects belong GOTYPE excluding NAME
- name: "!NAME.set"
parameters:
x:
vpx:
y:
vpy:
alpha:
# condition: expression
Ease properties of custom game object¶
Ease properties of a game object indexing by NAME
- name: NAME.to
parameters:
x:
vpx:
y:
vpy:
alpha:
duration: 1000
delay: 0
ease: Linear
repeat: 0
wait:
# condition: expression
- name: NAME.from
parameters:
x:
vpx:
y:
vpy:
alpha:
duration: 1000
delay: 0
ease: Linear
repeat: 0
wait:
# condition: expression
- name: NAME.yoyo
parameters:
x:
vpx:
y:
vpy:
alpha:
duration: 1000
delay: 0
ease: Linear
repeat: 0
wait:
# condition: expression
These properties are reserved : id, duration, delay, ease, repeat, yoyo, wait
wait :
false : Run next command immediately. Default behavior.
true : Run next command after playing sound complete.
Add empty line above and below this command block.
Ease properties of all game objects belong GOTYPE
- name: GOTYPE.to
parameters:
x:
vpx:
y:
vpy:
alpha:
duration: 1000
delay: 0
ease: Linear
repeat: 0
wait:
# condition: expression
- name: GOTYPE.from
parameters:
x:
vpx:
y:
vpy:
alpha:
duration: 1000
delay: 0
ease: Linear
repeat: 0
wait:
# condition: expression
- name: GOTYPE.yoyo
parameters:
x:
vpx:
y:
vpy:
alpha:
duration: 1000
delay: 0
ease: Linear
repeat: 0
wait:
# condition: expression
Ease properties of all game objects belong GOTYPE excluding NAME
- name: "!NAME.to"
parameters:
x:
vpx:
y:
vpy:
alpha:
duration: 1000
delay: 0
ease: Linear
repeat: 0
wait:
# condition: expression
- name: "!NAME.from"
parameters:
x:
vpx:
y:
vpy:
alpha:
duration: 1000
delay: 0
ease: Linear
repeat: 0
wait:
# condition: expression
- name: "!NAME.yoyo"
parameters:
x:
vpx:
y:
vpy:
alpha:
duration: 1000
delay: 0
ease: Linear
repeat: 0
wait:
# condition: expression
Invoke custom command¶
Invoke custom command of a game object indexing by NAME
- name: NAME.commandName
parameters:
param0: value
param1: value
# condition: expression
Invoke custom command commandName method with these parameters
gameObject : Indexed by NAME
config : {param0, param1}
Add empty line above and below this command block.
value :
For string value, characters \n (2 characters) will be replaced by \n new line character (1 character)
Invoke custom command of all game objects belong GOTYPE
- name: GOTYPE.commandName
parameters:
param0: value
param1: value
# condition: expression
Invoke custom command of all game objects belong GOTYPE excluding NAME
- name: "!NAME.commandName"
parameters:
param0: value
param1: value
# condition: expression
Do nothing if gameObject or commandName is not found.
Destroy custom game object¶
Destroy game object indexing by NAME
- name: NAME.destroy
# condition: expression
Destroy all game objects belong GOTYPE
- name: GOTYPE.destroy
# condition: expression
Destroy all game objects belong GOTYPE excluding NAME
- name: "!NAME.destroy"
# condition: expression
Methods used in command¶
Hold command execution until eventEmitter emits eventName event.
commandExecutor.waitEvent(eventEmitter, eventName);
Apply value to property of
commandExecutor.setGOProperty({
goType, id,
property, ...
});
goType : GameObject type assigned by commandExecutor.addGameObjectManager({name...}).
id : NAME of game object, which will store in gameObject.name.
gameObject.name : Apply value to property of this game object.
'!' + gameObject.name : Apply value to property of all game objects exclude this game object.
undefined : All game objects.
propertyName: value : Assign value to property. Can assign one or many properties.
Ease value of game object(s)' property
if (wait) {
commandExecutor.setWaitEventFlag();
}
commandExecutor.easeGOProperty({
goType, id,
duration, ease, repeat, yoyo,
wait,
property, ...
});
goType : GameObject type assigned by commandExecutor.addGameObjectManager({name...}).
id : NAME of game object, which will store in gameObject.name.
gameObject.name : Apply value to property of this game object.
'!' + gameObject.name : Apply value to property of all game objects exclude this game object.
undefined : All game objects.
duration : Duration of easing task.
ease : Ease function
repeat : Repeat times.
yoyo : Yoyo flag.
wait : Wait until easing task complete.
Invoke commandExecutor.setWaitEventFlag().
propertyName: value : Ease value of property. Can assign one or many properties.
Wait¶
Wait click¶
- name: click
# condition: expression
Run next command after clicking.
Wait any¶
Run next command after...
- name: wait
parameters:
click: true
key: keyName
time:
GONAME.destroy: true
GONAME.PROPNAME: true
GONAME.DATAKEY: true
GONAME.EVTNAME: true
event: EVENTNAME
# condition: expression
click : Run next command after clicking.
key : Run next command after key down
time : Run next command after time-out.
GONAME.destroy : Run next command after game object has destroyed.
GONAME.PROPNAME (ex. GONAME.x) : Run next command after game object's property tween complete
GONAME.DATAKEY, GONAME.!DATAKEY (ex. GONAME.!hp) : Run next command after game object's data is true (or > 0) or false (or <= 0). Will check PROPNAME first.
GONAME.EVTNAME : Run next command after game object's EVTNAME firing. Will check PROPNAME and DATAKEY first.
event : Run next command after eventSheetManager firing EVENTNAME event.
Emit these events from eventSheetManager
Wait click or key down
eventSheetManager.on('pause.input', function(){
});
Resume (run next command)
eventSheetManager.on('resume.input', function(){
});
Wait click only
eventSheetManager.on('pause.click', function(){
});
Wait key down only
eventSheetManager.on('pause.key', function(keyName){
});
Sound¶
This command executor provides
2 background music tracks : bgm, bgm2
2 sound effects : se, se2.
Sound properties¶
- name: bgm.set
parameters:
volume:
mute:
unmute:
# condition: expression
Command name : bgm, bgm2, se, se2
Play sound¶
- name: bgm.play
parameters:
key:
# volume:
# detune:
# rate:
# fadeIn: 0
# loop: false
wait: false
# condition: expression
Command name : bgm.play, bgm2.play, se.play, se2.play
wait :
false : Run next command immediately. Default behavior.
true : Run next command after playing sound complete.
Cross fade in sound¶
- name: bgm.cross
parameters:
key:
duration: 500
wait: false
# condition: expression
Command name : bgm.cross, bgm2.cross
wait :
false : Run next command immediately. Default behavior.
true : Run next command after playing sound complete.
Stop sound¶
- name: bgm.stop
# condition: expression
Command name : bgm.stop, bgm2.stop, se.stop, se2.stop
Fade out sound¶
- name: bgm.fadeOut
parameters:
duration: 500
stop: true
wait: false
# condition: expression
Command name : bgm.fadeOut, bgm2.fadeOut, se.fadeOut, se2.fadeOut
wait :
false : Run next command immediately. Default behavior.
true : Run next command after playing sound complete.
Fade in sound¶
- name: bgm.fadeIn
parameters: { duration: 500 }
# condition: expression
Command name : bgm.fadeIn, bgm2.fadeIn
Pause sound¶
- name: bgm.pause
# condition: expression
Command name : bgm.pause, bgm2.pause
Resume sound¶
- name: bgm.resume
# condition: expression
Command name : bgm.resume, bgm2.resume
Mute sound¶
- name: bgm.mute
# condition: expression
Command name : bgm.mute, bgm2.mute, se.mute, se2.mute
Unmute sound¶
- name: bgm.unmute
# condition: expression
Command name : bgm.unmute, bgm2.unmute, se.unmute, se2.unmute
Camera¶
Camera properties¶
- name: camera.set
parameters:
x:
y:
rotate:
zoom:
name:
# condition: expression
x, y : Scroll
rotate : Rotate in degree
zoom : Zoom
name : Target camera indexed by name. Default is main camera.
Run next command immediately.
Fade in¶
- name: camera.fadeIn
parameters:
duration: 1000
red:
green:
blue:
name:
wait: false
# condition: expression
duration, red, green, blue : See fade effect
name : Target camera indexed by name. Default is main camera.
wait :
false : Run next command immediately. Default behavior.
true : Run next command after effect complete.
Fade out¶
- name: camera.fadeOut
parameters:
duration: 1000
red:
green:
blue:
name:
wait: false
# condition: expression
duration, red, green, blue : See fade effect
name : Target camera indexed by name. Default is main camera.
wait :
false : Run next command immediately. Default behavior.
true : Run next command after effect complete.
Flash¶
- name: camera.flash
parameters:
duration: 1000
red:
green:
blue:
name:
wait: false
# condition: expression
duration, red, green, blue : See flash effect
name : Target camera indexed by name. Default is main camera.
wait :
false : Run next command immediately. Default behavior.
true : Run next command after effect complete.
Shake¶
- name: camera.shake
parameters:
duration: 1000
intensity:
name:
wait: false
# condition: expression
duration, intensity : See shake effect
name : Target camera indexed by name. Default is main camera.
wait :
false : Run next command immediately. Default behavior.
true : Run next command after effect complete.
Zoom¶
- name: camera.zoomTo
parameters:
duration: 1000
zoom:
name:
wait: false
# condition: expression
duration, zoom : See zoom effect
name : Target camera indexed by name. Default is main camera.
wait :
false : Run next command immediately. Default behavior.
true : Run next command after effect complete.
Rotate to¶
- name: camera.rotateTo
parameters:
duration: 1000
rotate:
ease:
name:
wait: false
# condition: expression
duration, rotate, ease : See rotateTo effect
name : Target camera indexed by name. Default is main camera.
wait :
false : Run next command immediately. Default behavior.
true : Run next command after effect complete.
Scroll to¶
- name: camera.scrollTo
parameters:
duration: 1000
x:
y:
ease:
name:
wait: false
# condition: expression
duration, x, y, ease : Scroll to position.
name : Target camera indexed by name. Default is main camera.
wait :
false : Run next command immediately. Default behavior.
true : Run next command after effect complete.
Add custom command¶
commandExecutor.addCommand(commandName, function(config, eventSheetManager){
// var resumeCallback = eventSheetManager.pauseEventSheet();
// ...
// resumeCallback()
}, scope);
config : Parameters passed from event sheet.
eventSheetManager : This event mangager.
Pause running of current event sheet
var resumeCallback = eventSheetManager.pauseEventSheet();
//  resumeCallback();  // Resume running of current event sheet
Pause running of current event sheet until another eventName firing from eventEmitter
eventSheetManager.pauseEventSheetUnitlEvent(eventEmitter, eventName);
Return value
An event emitter : Current command returns RUNNING until the event emitter fires the complete event.
If command execution is paused by eventSheetManager.pauseEventSheet(), current command returns RUNNING until the resume callback is invoked.
undefined or any truthy value : Current command returns SUCCESS.
Explicit falsy value, such as false, null, or 0 : Current command returns FAILURE.
Returning FAILURE stops the remainder of the current sequence. It can be used as a guard command in behavior-tree style flows.
commandExecutor.addCommand('condition.staminaAtLeast', function(config, eventSheetManager) {
var stamina = eventSheetManager.getData('stamina');
return stamina >= config.value;
});
- name: condition.staminaAtLeast
parameters: { value: 30 }
Logger¶
Logs event sheet manager diagnostic events as text.
Create logger from plugin
var logger = scene.plugins.get('rexYAMLEventSheets').addLogger({
manager: eventSheetManager,
level: 'flow',
format: 'compact',
// formatter:
// sink:
// output:
// events:
// filter:
// includeTime: false,
// includeReferences: false,
// includeParameters: true,
// includeResult: true,
// autoStart: true
});
Create logger from class
import { Logger } from 'phaser4-rex-plugins/plugins/yamleventsheets.js';
var logger = new Logger({
manager: eventSheetManager,
level: 'flow',
format: 'compact',
// formatter:
// sink:
// output:
// events:
// filter:
// includeTime: false,
// includeReferences: false,
// includeParameters: true,
// includeResult: true,
// autoStart: true
});
Display logger with Colors
var logger = scene.plugins.get('rexYAMLEventSheets').addBBCodeLogger({
manager: eventSheetManager,
level: 'flow',
// formatter:
// sink:
// output:
// events:
// filter:
// includeTime: false,
// includeReferences: false,
// includeParameters: true,
// includeResult: true,
// autoStart: true
});
Parameters
manager : Event sheet manager to listen to.
managers : An array of event sheet managers to listen to.
level :
'error' : Stop, abort, failed command, and failed event sheet status events.
'flow' : Group, event sheet, label, condition, and command flow events. Default behavior.
'status' : Includes event sheet status events.
'verbose' : Includes all recorded events.
format :
'compact' : One line text per event. Default behavior.
'json' : JSON string per event.
'bbcode' : BBCode tagged text for colored console output.
formatter : Custom formatter callback.
function(event, record, recorder) {
return `${event.type} : ${event.groupName}`;
}
sink : Output target.
var logger = new Logger({
manager: eventSheetManager,
sink: {
write: function(text) {
textarea.value += text + '\n';
}
}
});
Colored console output with BBCode.
import { Logger, BBCodeSink } from 'phaser4-rex-plugins/plugins/yamleventsheets.js';
var logger = new Logger({
manager: eventSheetManager,
level: 'flow',
format: 'bbcode',
sink: new BBCodeSink()
});
output : Custom output callback.
events : Event names to record.
'all' : Record all diagnostic events. Default behavior.
A string event name, or an array of event names.
filter : Return false to skip an event.
function(event, record, recorder) {
// return true;
}
includeTime : Include timestamp in records. Default value is false
includeReferences : Include runtime object references in records. Default value is false.
includeParameters : Include command parameters in command events. Default value is true.
includeResult : Include command return value in command events. Default value is true.
autoStart : Start listening after construction. Default behavior is true.
Commands
Start or stop logger
logger.start();
logger.stop();
Destroy logger
logger.destroy();
Tracer¶
Stores event sheet manager diagnostic events as structured records. It is useful for building a custom trace view or inspector UI.
Create tracer from plugin
var tracer = scene.plugins.get('rexYAMLEventSheets').addTracer({
manager: eventSheetManager,
maxRecords: 32
});
Create tracer from class
import { Tracer } from 'phaser4-rex-plugins/plugins/yamleventsheets.js';
var tracer = new Tracer({
manager: eventSheetManager,
maxRecords: 32
});
Parameters
manager : Event sheet manager to listen to.
managers : An array of event sheet managers to listen to.
maxRecords : Maximum finalized group records to keep. Default behavior is 60.
events : Event names to record.
filter : Return false to skip an event.
function(event, record, recorder) {
// return true;
}
includeTime : Include timestamp in records. Default value is false
includeReferences : Include runtime object references in records. Default value is false.
includeParameters : Include command parameters in command events. Default value is true.
includeResult : Include command return value in command events. Default value is true.
autoStart : Start listening after construction. Default behavior is true.
Commands:
Get trace records
var records = tracer.getRecords();
var lastRecord = tracer.getLastRecord();
var runningRecord = tracer.getCurrentRecord(groupName);
Destroy Tracer
tracer.destroy();
Record structure:
A record contains one group execution round.
{
type: 'eventsheet.round',
managerID: 0,
groupName: 'task0',
roundID: 1,
statusName: 'COMPLETE',
events: [
{
type: 'condition.eval',
groupName: 'task0',
sheetTitle: 'Main',
conditionType: 'sheet',
expression: 'coin > 0',
result: true
},
{
type: 'command.start',
groupName: 'task0',
sheetTitle: 'Main',
commandName: 'print',
parameters: {
text: 'hello'
}
}
]
}
Show current running groups
var text = ['task0', 'task1'].map(function(groupName) {
var record = tracer.getCurrentRecord(groupName);
if (!record) {
return `${groupName}: IDLE`;
}
return `${groupName}: RUNNING, events=${record.events.length}`;
}).join('\n');