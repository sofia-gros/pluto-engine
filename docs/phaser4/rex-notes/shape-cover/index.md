Cover
Introduction¶
Rectangle shape covered full window, and block all touch events.
Author: Rex
Game object
Live demos¶
Cover
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexcoverplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcoverplugin.min.js', true);
Add cover object
var cover = scene.add.rexCover(config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import CoverPlugin from 'phaser4-rex-plugins/plugins/cover-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexCoverPlugin',
plugin: CoverPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add cover object
var cover = scene.add.rexCover(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import Cover from 'phaser4-rex-plugins/plugins/cover.js';
Add cover object
var cover = new Cover(scene, config);
scene.add.existing(cover);
Create cover object¶
var cover = scene.add.rexCover({
// color: 0x0,
// alpha: 0.8
});
color : Color of cover.
alpha : Alpha value of cover.
Custom class¶
Define class
class MyCover extends RexPlugins.GameObjects.Cover {
constructor(scene, config) {
super(scene, config);
// ...
scene.add.existing(this);
}
// ...
// preUpdate(time, delta) {}
}
scene.add.existing(gameObject) : Adds an existing Game Object to this Scene.
If the Game Object renders, it will be added to the Display List.
If it has a preUpdate method, it will be added to the Update List.
Create instance
var cover = new MyCover(scene, config);
Color¶
Tint
Get
var tint = cover.tint;
Set
cover.tint = tint;
Alpha
Get
var alpha = cover.alpha;
Set
cover.alpha = alpha;
Fill color
Get
var color = cover.fillColor;
var alpha = cover.fillAlpha;
Set
cover.setFillStyle(color, alpha);
Clear
cover.setFillStyle();
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters