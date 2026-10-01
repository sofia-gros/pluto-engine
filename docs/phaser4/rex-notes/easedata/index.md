Ease-data
Introduction¶
Easing data value of game object's data-manager.
Author: Rex
Method only
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexeasedataplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexeasedataplugin.min.js', true);
Add ease-data behavior
var easedata = scene.plugins.get('rexeasedataplugin').add(gameObject);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import EaseDataPlugin from 'phaser4-rex-plugins/plugins/easedata-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexEaseData',
plugin: EaseDataPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add ease-data behavior
var easedata = scene.plugins.get('rexEaseData').add(gameObject);
Import method¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import method
import { EaseData } from 'phaser4-rex-plugins/plugins/easedata.js';
EaseData-out-destroy
var easedata = new EaseData(gameObject);
Create instance¶
var easedata = scene.plugins.get('rexEaseData').add(gameObject);
Ease data¶
Start
easedata.easeTo(key, value, duration);
// easedata.easeTo(key, value, duration, ease);
or
easedata.easeTo({
key:key,
value:value,
duration:1000,
ease:'Linear'
});
or
easedata.easeTo({
key:key,
value:value,
speed: 10,    // value changing rate, per second
ease:'Linear'
});
Stop
easedata.stopEase(key);           // Set to end value
// easedata.stopEase(key, false); // Stop at current value
or
easedata.stopAll();           // Set to end value
// easedata.stopAll(false);   // Stop at current value
Events¶
Easing complete
easedata.on('complete-' + key, function(gameObject, easedata){
}, scope);
easedata.on('complete', function(key, gameObject, easedata){
}, scope);