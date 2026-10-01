Sequence
Introduction¶
Run sequence commands in array.
Author: Rex
Object
Live demos¶
Sequence
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexsequenceplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexsequenceplugin.min.js', true);
Create sequence instance
var seq = this.plugins.get('rexsequenceplugin').add(config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import SequencePlugin from 'phaser4-rex-plugins/plugins/sequence-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexSequence',
plugin: SequencePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Create sequence instance
var seq = this.plugins.get('rexSequence').add(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import Sequence from 'phaser4-rex-plugins/plugins/sequence.js';
Create sequence instance
var seq = new Sequence(config);
Create sequence instance¶
var seq = this.plugins.get('rexSequence').add({
// yoyo: false,
// repeat: 0,
// loop: false
});
yoyo : Reverse sequence when it reaches the end
repeat : Repeat count
loop : Repeat forever
Load commands¶
seq.load(commands, actionScope);
Format of command :
[fnName, param0, param1, ...]
Commands in nested array :
[
command0,
command1
[
command2,
command3
]
]
ActionScope
Format of command is the same as run-command.
Run commands¶
seq.start();
Run command :
var eventEmitter = actionScope[fnName].call(actionScope, param0, param1 ...);
Return an event emitter to pause the sequence, otherwise run next command
Sequence will continue when that event emitter fires complete event
Stop¶
seq.stop();
Events¶
On sequence completed :
seq.on('complete', function(actionScope, seq){
});
Action of commands¶
Action of commands, extended from Phaser.Events.EventEmitter.
class ActionKlass extends Phaser.Events.EventEmitter {
constructor(scene) {
super();
this.scene = scene;
this.myConsole = scene.add.text(100, 100, '');
this['wait-click'] = this.waitClick;
this['wait-time'] = this.waitTime;
}
// callbacks
print(msg) {
this.myConsole.setText(msg);
// return undefined to run next command
}
waitClick() {
this.scene.input.once('pointerup', this.complete, this);
return this;  // return eventEmitter to pause the sequence
}
waitTime(delay) {
this.scene.time.delayedCall(delay * 1000, this.complete, [], this);
return this;  // return eventEmitter to pause the sequence
}
complete() {
this.emit('complete');  // resume sequence
}
}
var actionScope = new ActionKlass(scene);
Now this scope supports 3 commands
print(msg): ['print', msg]
waitClick(): ['wait-click']
waitTime(delay): ['wait-time', delay]
State¶
var state = seq.state;
0 : Idle
1 : Run
2 : Last command
3 : Completed
var completed = seq.completed; // seq.state === 3
Other properties¶
Yoyo
Get
var yoyo = seq.yoyo;
Set
seq.setYoyo();
seq.setYoyo(fals);
// seq.yoyo = yoyo;
Repeat
Get
var repeat = seq.repeat;
Set
seq.setRepeat(count);
Loop
Get
var loop = seq.loop;
Set
seq.setLoop();
seq.setLoop(fals);
// seq.loop = loop;