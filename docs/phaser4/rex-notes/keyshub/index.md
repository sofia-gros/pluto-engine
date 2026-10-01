Keys hub
Introduction¶
Key object interface mapping from multiple source of key objects.
Author: Rex
Member of scene
Live demos¶
Multiple mode
Single mode
Define key
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexkeyshubplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexkeyshubplugin.min.js', true);
Add keys-hub object
var keysHub = scene.plugins.get('rexkeyshubplugin').add(scene, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import KeysHubPlugin from 'phaser4-rex-plugins/plugins/keyshub-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexKeysHub',
plugin: KeysHubPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add keys-hub object
var keysHub = scene.plugins.get('rexKeysHub').add(scene, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import KeysHub from 'phaser4-rex-plugins/plugins/keyshub.js';
Add keys-hub object
var keysHub = new KeysHub(scene, config);
Create instance¶
var keysHub = scene.plugins.get('rexKeysHub').add(scene, {
// singleMode: false,
});
singleMode :
true : Unplug old key object then plug new key object.
false : Plug new key object without unplug previous key object. Default behavior.
Destroy¶
keysHub.destroy();
Plug key object¶
Plug a set of key objects
keysHub.plugKeyObject({
keyCode0: keyObject0,
keyCode1: keyObject1,
// ...
});
for example :
var keyObjects = scene.input.keyboard.addKeys({
up: 'W',
down: 'S',
left: 'A',
right: 'D'
});
keysHub.plugKeyObject(keyObjects);
var keyObjects = scene.input.keyboard.createCursorKeys();
keysHub.plugKeyObject(keyObjects);
or
var keyObjects = joystick.createCursorKeys();
keysHub.plugKeyObject(keyObjects);
keyObjects : {keyCode : keyObject}
joystick : Virtual joystick
Plug a key object
keysHub.plugKeyObject(keyObject, keyCode);
Unplug key object¶
Unplug a set of key objects
keysHubunplugKeyObjects(keyObjects);
keyObjects : {keyCode : keyObject}
Unplugin a key object
keysHub.unplugKeyObject(keyObject);
Key object interfacee¶
Get key object
var keyObject = keysHub.addKey('W');  // see `Key map` section
// var keyObject = keysHub.addKey(Phaser.Input.Keyboard.KeyCodes.W);
or
var keyObject = keysHub.addKey('W');
Get key objects
var keyObjects = keysHub.addKeys('W,S,A,D');  // keyObjects.W, keyObjects.S, keyObjects.A, keyObjects.D
or
var keyObjects = keysHub.addKeys({
up: 'W',
down: 'S',
left: 'A',
right: 'D'
});  // keyObjects.up, keyObjects.down, keyObjects.left, keyObjects.right
Get curor key objects
var cursorKeys = keysHub.createCursorKeys();
Get plugged key objects¶
var keyObject = keysHub.getKeyObjects(key);
key : Key string, or keyCode number.
keyObject :
A key object if singleMode is set to true
A list of key objects if if singleMode is set to false
Re-define key map¶
Set singleMode to ture when creating keysHub instance.
Start definition task¶
keysHub.defineKeyStart(key);  // key: key string
Fire 'definekey.start' event
Listen key input¶
From keyboard
keysHub.listenFromKeyboard();
Cancel definition task¶
keysHub.defineKeyCancel();
Fire 'definekey.complete' event.
Complete definition task¶
Complete when any key input
Fire 'definekey.complete' event.
Events¶
On key object plug
keysHub.on('plug', function(key, keyObject) {
})
On key object unplug
keysHub.on('unplug', function(key, keyObject) {
})
On define-key start
keysHub.on('definekey.start', function(key) {
})
On define-key complete
keysHub.on('definekey.complete', function(key, keyObject) {
})
key :
A string : Plug new key object to that Key object interface.
undefined : Cancel define-key task.
keyObject :
A key object : New plugged key object.
undefined : Remove current plugged key.