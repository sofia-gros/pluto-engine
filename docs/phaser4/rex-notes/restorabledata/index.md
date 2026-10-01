Restorable data
Introduction¶
Restorable data manager, extends from built-in data manager.
Author: Rex
Member of scene
Live demos¶
Restorable canvas
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexrestorabledataplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexrestorabledataplugin.min.js', true);
Add restorable data object
var data = scene.plugins.get('rexrestorabledataplugin').add(parent);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import RestorableDataPlugin from 'phaser4-rex-plugins/plugins/restorabledata-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexRestorableData',
plugin: RestorableDataPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add restorable data object
var data = scene.plugins.get('rexRestorableData').add(parent);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import RestorableData from 'phaser4-rex-plugins/plugins/restorabledata.js';
Add restorable data object
var data = new RestorableData(parent);
Create instance¶
var data = scene.plugins.get('rexRData').add(parent);
// var data = scene.plugins.get('rexRData').add(parent, eventEmitter);
parent : The object (a scene, or a game object) that this DataManager belongs to.
eventEmitter : The DataManager's event emitter.
Get/set/remove value¶
See built-in data manager.
Commit¶
Commit current data status into repository, and increase current version number.
data.commit();
or
data.commit(alias);
alias : A version alias string.
Restore¶
Restore data status to a specific version.
data.restore(version);
or
data.version = version;
version : Version number or version alias string.
Rebuild data status from version 0 to a specific version.
data.restore(version, true);
version : Version number or version alias string.
Reverse data status to last version.
data.restore();
Version¶
Get current version alias string
var version = data.versionAlias;
Get all version alias strings
var aliases = data.versionAliases;
Get current version number
var version = data.version;
Get last version number
var version = data.lastVersion;
Version starts from 0 which has no data. Each data.commit() will increase this version number.
Save/load status¶
Get current status
var o = data.toJSON();
Load status
data.resetFromJSON(o);
or
Get current status via JSON string
var s = JSON.stringify(data);
Load status via JSON string
data.resetFromJSON(JSON.parse(s));