FSM
Introduction¶
Finite state machine.
Author: Rex
Object
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexfsmplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexfsmplugin.min.js', true);
Add FSM object
var states = scene.plugins.get('rexfsmplugin').add(config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import FSMPlugin from 'phaser4-rex-plugins/plugins/fsm-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexFSM',
plugin: FSMPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add FSM object
var states = scene.plugins.get('rexFSM').add(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import FSM from 'phaser4-rex-plugins/plugins/fsm.js';
Add FSM object
var states = new FSM(config);
Create instance¶
Create by config¶
var states = scene.plugins.get('rexFSM').add({
start: 'A',   // default: undefined
states: {
A: {
next: 'B',  // function() { return 'B'; }
enter: function() {},                 // this: this fsm instance
exit: function() {},                  // this: this fsm instance
update: function(time, delta) {},     // this: this fsm instance
preupdate: function(time, delta) {},  // this: this fsm instance
postupdate: function(time, delta) {}, // this: this fsm instance
},
// ...
},
init: function() {},   // this: this fsm instance
extend: {
i: 0,        // Add member `i` into this fsm instance
name: 'abc'
// ...
},
enable: true,
scene: undefined,
eventEmitter: undefined
});
start: Initial state.
states: Define states.
stateName
next: String of next state, or a callback to get next state.
enter: Callback when enter state.
function() {
// this : this fsm instance
}
exit: Callback when exit state.
javascript
function() {
// this : this fsm instance
}
update, preupdate, postupdate : Callback invoked by scene's 'update', 'preupdate', 'postupdate' events.
function(time, delta) {
// this : this fsm instance
}
init: Initial callback when creating instance.
function() {
// this : this fsm instance
}
extend: Inject key-value pairs into this fsm instance.
enable: Set false to block any state changing.
scene : Scene object for startUpdate, startPreUpdate, startPostUpdate method. Optional.
eventEmitter
undefined : Create a private event emitter, default value.
false : Don't add any event emitter, i.e. no event will be fired.
Event emitter object : Fire event through this event emitter.
Inheritance¶
Create new class
class State extends FSM {
constructor() {
super();
}
next_A() { return 'B' }
enter_A() { }
exit_A() { }
update_A(time, delta) { }
preupdate_A(time, delta) { }
postupdate_A(time, delta) { }
}
Members:
- next_ + stateName : Callback to get next state.
- enter_ + stateName : Callback when enter state.
- exit_ + stateName : Callback when exit state.
- update_ + stateName, preupdate_ + stateName, postupdate_ + stateName : Callback invoked by scene's 'update', 'preupdate', 'postupdate' events.
Create instance
var states = new State();
Read state¶
Current state
var curState = states.state;
Previous state
var preState = states.prevState;
Start at state¶
states.start(newState);
Note
Set new state without triggering any state-changing callbacks or events.
Next state¶
graph TB
next["states.next()"] --> next_A["states.next_A()<br>return 'B'"]
next_A --> eventStateChange["states.emit('statechange', states)<br>states.prevState -> states.state"]
subgraph State changing
eventStateChange --> exit_A["states.exit_A()"]
exit_A --> eventExitA["states.emit('exit_A', states)"]
eventExitA --> enter_B["states.enter_B()"]
enter_B --> eventEnterB["states.emit('enter_B', states)"]
subgraph Exit
exit_A
eventExitA
end
subgraph Enter
enter_B
eventEnterB
end
end
goto["states.goto('B')"] --> eventStateChange
subgraph Request
subgraph Next
next
next_A
end
subgraph Goto
goto
end
end
Request¶
Get next state by callback
states.next();    // nextState = states.next_A()
Goto state
states.goto(nextState);
// states.state = nextState;
State-changing¶
These callbacks or events will be triggered if state is changing.
For example, state is changing from 'A' to 'B'.
event statechange
states.on('statechange', function(states) {
console.log( states.prevState + '->' + states.state );
});
callback states.exit_A
event exit_A
states.on('exit_A', function(states) {
/*...*/
});
callback states.enter_B
event enter_B
states.on('enter_B', function(states) {
/*...*/
});
Enable¶
states.setEnable();
// states.setEnable(false); // disable
or
states.toggleEnable();
states.next() and states.goto() will be ignored if disabled.
Update¶
Start
states.startUpdate();
states.startPreUpdate();
states.startPostUpdate();
// Assume that `scene` is assigned in config of constructor
or
states.startUpdate(scene);
states.startPreUpdate(scene);
states.startPostUpdate(scene);
scene : Scene object
Stop
states.stopUpdate();
states.stopPreUpdate();
states.stopPostUpdate();
Add new state¶
states.addState(name, {
next: 'B',  // function() { return 'B'; }
enter: function() {},
exit: function() {},
update: function(time, delta) {},
preupdate: function(time, delta) {},
postupdate: function(time, delta) {},
})
states.addState({
name: 'A',
next: 'B',  // function() { return 'B'; }
enter: function() {},
exit: function() {},
update: function(time, delta) {},
preupdate: function(time, delta) {},
postupdate: function(time, delta) {},
})
or
states.addStates({
'A' : {
next: 'B',  // function() { return 'B'; }
enter: function() {},
exit: function() {},
update: function(time, delta) {},
preupdate: function(time, delta) {},
postupdate: function(time, delta) {},
},
// ...
})
states.addStates([
{
name: 'A',
next: 'B',  // function() { return 'B'; }
enter: function() {},
exit: function() {},
update: function(time, delta) {},
preupdate: function(time, delta) {},
postupdate: function(time, delta) {},
},
// ...
]);