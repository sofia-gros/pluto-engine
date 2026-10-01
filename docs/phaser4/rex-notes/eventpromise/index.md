Event promise
Introduction¶
Return a promise of an event.
Author: Rex
Method only
Live demos¶
Wait complete
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexeventpromiseplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexeventpromiseplugin.min.js', true);
Get event promise
var promoise = scene.plugins.get('rexeventpromiseplugin').waitEvent(eventEmitter, eventName);
// var promoise = scene.plugins.get('rexeventpromiseplugin').waitComplete(eventEmitter);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import EventPromisePlugin from 'phaser4-rex-plugins/plugins/eventpromise-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexEventPromise',
plugin: EventPromisePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Get event promise
var promoise = scene.plugins.get('rexEventPromise').waitEvent(eventEmitter, eventName);
// var promoise = scene.plugins.get('rexEventPromise').waitComplete(eventEmitter);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { WaitEvent, WaitComplete } from 'phaser4-rex-plugins/plugins/eventpromise.js';
Get event promise
var promoise = WaitEvent(eventEmitter, eventName);
// var promoise = WaitComplete(eventEmitter);
Get event promise¶
var promoise = scene.plugins.get('rexEventPromise').waitEvent(eventEmitter, eventName)
.then(function() {
})
eventEmitter : Any kind of event emitter. for example, game object, or tween task, or scene event
Get complete event promise¶
var promoise = scene.plugins.get('rexEventPromise').waitComplete(eventEmitter)
.then(function() {
})
eventEmitter : Event emitter which will fire 'complete' event, for example, tween task.