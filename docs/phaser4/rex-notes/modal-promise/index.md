Modal promise
Introduction¶
Modal behavior wrapped into promise.
Author: Rex
Promise
Live demos¶
Manual
Timeout
Modal dialog
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexmodalplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexmodalplugin.min.js', true);
Add modal behavior
scene.plugins.get('rexmodalplugin').promise(gameObject, config)
.then(function(closeEventData) {
})
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Add modal behavior
scene.plugins.get('rexModal').promise(gameObject, config)
.then(function(closeEventData) {
})
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { ModalPromise } from 'phaser4-rex-plugins/plugins/modal.js';
Add modal behavior
ModalPromise(gameObject, config)
.then(function(closeEventData) {
})
Promise¶
scene.plugins.get('rexModal').promise(gameObject, config)
.then(function(closeEventData) {
})
config : See Modal behavior
Close¶
scene.plugins.get('rexModal').close(gameObject);
// scene.plugins.get('rexModal').close(gameObject, closeEventData);
or
gameObject.emit('modal.requestClose');
// gameObject.emit('modal.requestClose', closeEventData);
Fire 'modal.requestClose' event on game object, which will invoke modal.requestClose() method. After closing dialog, resolve part of promise will be triggered.
graph TB
Promise["promose('gameObject, config)"]
OnOpen["gameObject.on('modal.open')"]
RequestCloseEvent["gameObject.emit('modal.requestClose', closeEventData)"]
TimeOut["Timeout<br>Any touch"]
OnClose["gameObject.on('modal.close')"]
Resolve["then(function(closeEventData) { })"]
Promise --> |Transition-in| OnOpen
OnOpen --> |manualClose| RequestCloseEvent
OnOpen --> |Not manualClose| TimeOut
RequestCloseEvent --> |Transition-out| OnClose
TimeOut --> |Transition-out| OnClose
OnClose --> Resolve
Events¶
To invoke modal.requestClose() method
gameObject.emit('modal.requestClose', closeEventData);
On opened dialog
gameObject.on('modal.open', function(modalBehavior) {
})
On closed dialog
gameObject.on('modal.close', function(closeEventData, modalBehavior) {
})