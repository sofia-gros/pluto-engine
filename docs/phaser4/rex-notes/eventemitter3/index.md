Event emitter
Introduction¶
Event emitter.
Usage¶
Get event emitter¶
Scene:
var ee = scene.events;
Game object:
var ee = gameObject;
Attach listener¶
ee.on(eventName, callback, scope);
ee.once(eventName, callback, scope);  // only fire listeners one time
Alias
ee.addListener(eventName, callback, scope);
ee.addListener(eventName, callback, scope, true);  // only fire listeners one time
Fire event¶
ee.emit(eventName, parameter0, ...);
Remove listeners¶
Remove a linstener
ee.off(eventName, callback, scope);
ee.off(eventName, callback, scope, true);   // only remove one-time listeners
or
ee.removeListener(eventName, callback, scope);
ee.removeListener(eventName, callback, scope, true);  // only remove one-time listeners
Remove listeners of an event
ee.off(eventName);
or
ee.removeListener(eventName);
Remove listeners of all events
ee.removeAllListeners();
Get listeners count¶
var count = ee.listenerCount(eventName);
//var noListener = (ee.listenerCount(eventName) === 0);
Get listeners¶
var listeners = ee.listeners(eventName);
Get event names¶
var names = ee.eventNames();
Listener¶
{
fn: callback,
context: scope,
once: once
}
Custom event emitter class¶
class MyEventEmitter extends Phaser.Events.EventEmitter {
// construct() {
//     super();
// }
// destroy() {
//     super.destroy();
// }
}