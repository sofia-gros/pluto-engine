Buff data
Introduction¶
Data manager with buffs, extends from built-in data manager.
Author: Rex
Member of scene
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexbuffdataplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbuffdataplugin.min.js', true);
Add buff data manager object
var data = scene.plugins.get('rexbuffdataplugin').add(parent);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import BuffDataPlugin from 'phaser4-rex-plugins/plugins/buffdata-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexBuffData',
plugin: BuffDataPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add buff data manager object
var data = scene.plugins.get('rexBuffData').add(parent);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import BuffData from 'phaser4-rex-plugins/plugins/buffdata.js';
Add buff data manager object
var data = new BuffData(parent);
Create instance¶
var data = scene.plugins.get('rexBuffData').add(parent);
// var data = scene.plugins.get('rexBuffData').add(parent, eventEmitter);
data : Buff data manager
parent : The object (a scene, or a game object) that this DataManager belongs to.
eventEmitter : The DataManager's event emitter.
Extend existing data manager¶
var data = scene.plugins.get('rexBuffData').extend(data);
data : Existing data manager
Buff¶
A value is composed of baseValue, and some buffs, clamped by min, max values.
Base value
Set
data.setBaseValue(key, value);
Remove
data.removeBaseValue(key);
Get
var baseValue = data.getBaseValue(key);
Buffs, each value can have many buffs, or no buff.
Add/set a buff
data.setBuff(key, buffKey, value);
value :
A number
A string for percentage like '10%', which means that (baseValue * percentage)
Remove a buff of a key
data.removeBuff(key, buffKey);
Remove all buffs of a key
data.removeBuff(key);
Get a buff value
var buffValue = data.getBuffValue(key, buffKey);
Min, max bounds, optional.
Set
data.setMin(key, min);
data.setMax(key, max);
data.setBounds(key, min, max);
min, max : Clamp buffed result value between min and max value. Set undefined to ignore it.
Get
var min = data.getMinBound(key);
var max = data.getMaxBound(key);
Buffed result
Get
var result = data.get(key);
Events