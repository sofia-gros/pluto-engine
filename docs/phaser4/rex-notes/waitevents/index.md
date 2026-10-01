Wait events
Introduction¶
Wait fired events or callbacks.
Author: Rex
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexwaiteventsplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexwaiteventsplugin.min.js', true);
Create instance
var waitEvents = scene.plugins.get('rexwaiteventsplugin').add(completeCallback, completeCallbackScope);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import WaitEventsPlugin from 'phaser4-rex-plugins/plugins/waitevents-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexWaitEvents',
plugin: WaitEventsPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Create instance
var waitEvents = scene.plugins.get('rexWaitEvents').add(completeCallback, completeCallbackScope);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import WaitEvents from 'phaser4-rex-plugins/plugins/waitevents.js';
Create instance
var waitEvents = new WaitEvents(completeCallback, completeCallbackScope);
Create instance¶
var waitEvents = scene.plugins.get('rexWaitEvents').add(completeCallback, completeCallbackScope);
completeCallback, completeCallbackScope : Callback when all waitting events are fired.
Set complete callback¶
waitEvents.setCompleteCallback(completeCallback, completeCallbackScope);
completeCallback, completeCallbackScope : Callback when all waitting events are fired.
Add waiting event¶
Callback¶
var callback = waitEvents.waitCallback();
callback : A function object which invoked when waitting event finished.
For example, invokes completeCallback when all timers are time-out.
scene.time.delayedCall(500, waitEvents.waitCallback());
scene.time.delayedCall(1000, waitEvents.waitCallback());
scene.time.delayedCall(1500, waitEvents.waitCallback());
Callback from event emitter¶
waitEvents.waitEvent(eventEmitter, eventName);
Remove waiting event¶
callback();
or
waitEvents.remove(callback);
callback : A function object created via waitEvents.waitCallback()
Clear all waiting events¶
waitEvents.clear();
No wait event¶
var noWaitEvent = waitEvents.noWaitEvent;