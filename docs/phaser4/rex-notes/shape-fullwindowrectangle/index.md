Full window rectangle
Introduction¶
Rectangle shape covered full window.
Author: Rex
Game object
Live demos¶
Cover
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexfullwindowrectangleplugin', 'https://raw.githubusercontent.com/rexrainbow/    phaser3-rex-notes/master/dist/rexfullwindowrectangleplugin.min.js', true);
Add shape object
var rect = scene.add.rexFullWindowRectangle(fillColor, fillAlpha);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import FullWindowRectanglePlugin from 'phaser4-rex-plugins/plugins/fullwindowrectangle-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexFullWindowRectanglePlugin',
plugin: FullWindowRectanglePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add shape object
var rect = scene.add.rexFullWindowRectangle(fillColor, fillAlpha);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import FullWindowRectangle from 'phaser4-rex-plugins/plugins/fullwindowrectangle.js';
Add shape object
var rect = new FullWindowRectangle(scene, fillColor, fillAlpha);
scene.add.existing(rect);
Create shape object¶
var rect = scene.add.rexFullWindowRectangle(fillColor, fillAlpha);
Custom class¶
Define class
class MyFullWindowRectangle extends RexPlugins.GameObjects.FullWindowRectangle {
constructor(scene, fillColor, fillAlpha) {
super(scene, fillColor, fillAlpha);
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
var rect = new MyFullWindowRectangle(scene, fillColor, fillAlpha);
Color¶
Tint
Get
var tint = rect.tint;
Set
rect.tint = tint;
Alpha
Get
var alpha = rect.alpha;
Set
rect.alpha = alpha;
Fill color
Get
var color = rect.fillColor;
var alpha = rect.fillAlpha;
Set
rect.setFillStyle(color, alpha);
Clear
rect.setFillStyle();
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters