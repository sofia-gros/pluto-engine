State manager
Introduction¶
Another version of Finite state machine.
Author: Rex
Object
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexstatemanagerplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexstatemanagerplugin.min.js', true);
Add StateManager object
var states = scene.plugins.get('rexstatemanagerplugin').add(config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import StateManagerPlugin from 'phaser4-rex-plugins/plugins/statemanager-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexStateManager',
plugin: StateManagerPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add StateManager object
var states = scene.plugins.get('rexStateManager').add(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import StateManager from 'phaser4-rex-plugins/plugins/statemanager.js';
Add StateManager object
var states = new StateManager(config);
Create instance¶
var states = scene.plugins.get('rexStateManager').add({
eventEmitter: undefined
});
eventEmitter
undefined : Create a private event emitter, default value.
false : Don't add any event emitter, i.e. no event will be fired.
Event emitter object : Fire event through this event emitter.
Custom class¶
Define class
class MyStates extends StateManager {
constructor(config) {
super(config);
this.addStates({
A: {
next: 'B',  // function() { return 'B'; }
enter: function() {},
exit: function() {}
},
// ...
});
}
}
Create instance
var states = new MyStates(config);
Add new state¶
states.addState(name, {
next: 'B',  // function() { return 'B'; }
enter: function() {},
exit: function() {}
})
states.addState({
name: 'A',
next: 'B',  // function() { return 'B'; }
enter: function() {},
exit: function() {}
})
or
states.addStates({
'A' : {
next: 'B',  // function() { return 'B'; }
enter: function() {},
exit: function() {}
},
// ...
})
states.addStates([
{
name: 'A',
next: 'B',  // function() { return 'B'; }
enter: function() {},
exit: function() {}
},
// ...
]);
Read state¶
Current state
var curState = state.state;
Previous state
var preState = state.prevState;
Start at state¶
Set new state without triggering any state-changing callbacks or events.
state.start(newState);
Next state¶
graph TB
next["states.next()"] --> next_A["stateA.next()<br>return 'B'"]
next_A --> eventStateChange["states.emit('statechange', states)<br>states.prevState -> states.state"]
subgraph State changing
eventStateChange --> exit_A["stateA.exit()"]
exit_A --> eventExitA["states.emit('exit_A', states)"]
eventExitA --> enter_B["stateB.enter()"]
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
states.next();    // nextState = stateA.next()
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
callback stateA.exit
event exit_A
states.on('exit_A', function(states) {
/*...*/
});
callback stateB.enter
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
Get scene
var scene = states.getScene();
// var scene = states._scene;
Remove state¶
Remve a state
states.removeState(stateName);
Remve all states
states.removeAllStates();