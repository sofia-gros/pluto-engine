Checkbox
Introduction¶
Checkbox input with drawing checker path animation.
Author: Rex
Game object
Live demos¶
Checkbox
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexcheckboxplugin', 'https://raw.githubusercontent.com/rexrainbow/    phaser3-rex-notes/master/dist/rexcheckboxplugin.min.js', true);
Add checkbox input
var checkbox = scene.add.rexCheckbox(x, y, width, height, color, config);
Add checkbox shape (without click input)
var checkbox = scene.add.rexCheckboxShape(x, y, width, height, color, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import CheckboxPlugin from 'phaser4-rex-plugins/plugins/checkbox-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexCheckboxPlugin',
plugin: CheckboxPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add checkbox input
var checkbox = scene.add.rexCheckbox(x, y, width, height, color, config);
Add checkbox shape (without click input)
var checkbox = scene.add.rexCheckboxShape(x, y, width, height, color, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import Checkbox from 'phaser4-rex-plugins/plugins/checkbox.js';
Add checkbox input
var checkbox = new Checkbox(scene, x, y, width, height, color, config);
scene.add.existing(checkbox);
Add checkbox shape (without click input)
// import CheckboxShape from 'phaser4-rex-plugins/plugins/checkboxshape.js';
var checkbox = new CheckboxShape(scene, x, y, width, height, color, config);
scene.add.existing(checkbox);
Create checkbox input¶
var checkbox = scene.add.rexCheckbox(x, y, width, height, color, config);
or
var checkbox = scene.add.rexCheckbox({
x: 0,
y: 0,
width: undefined,
height: undefined,
color: 0x005cb2,
boxFillAlpha: 1,
uncheckedColor: null,
uncheckedBoxFillAlpha: 1,
boxLineWidth: 4,
boxStrokeColor: 0x005cb2,
boxStrokeAlpha: 1,
uncheckedBoxStrokeColor: 0x005cb2,
uncheckedBoxStrokeAlpha: 1,
checkerColor: 0xffffff,
checkerAlpha: 1,
// boxSize: 1,
// checkerSize: 1,
circleBox: false,
animationDuration: 150,
checked: false, // or value: false,
click: undefined,
// click: {
//     mode: 1,            // 0|'press'|1|'release'
//     clickInterval: 100  // ms
//     threshold: undefined
// },
readOnly: false,
});
width, height : Size of checkbox.
Box fill style
color, boxFillAlpha : Box color and alpha of checked
uncheckedColor, uncheckedBoxFillAlpha : Box color and alpha of unchecked
Box stroke style
boxLineWidth, boxStrokeColor, boxStrokeAlpha : Box stroke color and alpha of checked.
uncheckedBoxStrokeColor, uncheckedBoxStrokeAlpha : Box stroke color and alpha of unchecked.
Checker style
checkerColor, checkerAlpha : Checker color and alpha
circleBox : Shape of box
false : Rectangle shape box. Default behavior.
true : Circle shape box
boxSize, checkerSize : Size ratio of box, and checker. Default value is 1.
animationDuration : Duration of drawing path of checker.
checked : Initial value of checked.
click : Configuration of click input
click.mode :
'pointerdown', 'press', or 0 : Fire 'click' event when touch pressed.
'pointerup', 'release', or 1 : Fire 'click' event when touch released after pressed.
click.clickInterval : Interval between 2 'click' events, in ms.
click.threshold : Cancel clicking detecting when dragging distance is larger then this threshold.
undefined : Ignore this feature. Default behavior.
readOnly : Set ture to disable input.
Custom class¶
Define class
class MyCheckbox extends RexPlugins.GameObjects.Checkbox {
constructor(scene, x, y, width, height, color, config) {
super(scene, x, y, width, height, color, config);
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
var checkbox = new MyCheckbox(scene, x, y, width, height, color, config);
Check¶
Get
var checked = checkbox.checked;
// var checked = checkbox.value;
Set
Check
checkbox.setChecked();
// checkbox.setChecked(true);
// checkbox.setValue(true);
or
checkbox.checked = true;
// checkbox.value = true;
Uncheck
checkbox.setChecked(false);
// checkbox.setValue(false);
or
checkbox.checked = false;
// checkbox.value = false;
Toggle
checkbox.toggleChecked();
// checkbox.setValue(!checkbox.checked);
or
checkbox.checked = !checkbox.checked;
// checkbox.value = !checkbox.value;
Read only¶
Get
var readOnly = checkbox.readOnly;
Set
checkbox.setReadOnly();
// checkbox.setReadOnly(true);
or
checkbox.readOnly = true;
Box fill style¶
Get
var color = checkbox.boxFillColor;
var alpha = checkbox.boxFillAlpha;
var color = checkbox.uncheckedBoxFillColor;
var alpha = checkbox.uncheckedBoxFillAlpha;
Set
checkbox.setBoxFillStyle(color, alpha);
// checkbox.boxFillColor = color;
// checkbox.boxFillAlpha = alpha;
checkbox.setUncheckedBoxFillStyle(color, alpha);
// checkbox.uncheckedBoxFillColor = color;
// checkbox.uncheckedBoxFillAlpha = alpha;
Box stroke style¶
Get
var lineWidth = checkbox.boxLineWidth;
var color = checkbox.boxStrokeColor;
var alpah = checkbox.boxStrokeAlpha;
var lineWidth = checkbox.uncheckedBoxLineWidth;
var color = checkbox.uncheckedBoxStrokeColor;
var alpah = checkbox.uncheckedBoxStrokeAlpha;
Set
checkbox.setBoxStrokeStyle(lineWidth, color, alpha);
// checkbox.boxLineWidth = lineWidth;
// checkbox.boxStrokeColor = color;
// checkbox.boxStrokeAlpha = alpha;
checkbox.setUncheckedBoxStrokeStyle(lineWidth, color, alpha);
// checkbox.uncheckedBoxLineWidth = lineWidth;
// checkbox.uncheckedBoxStrokeColor = color;
// checkbox.uncheckedBoxStrokeAlpha = alpha;
Checker style¶
Get
var color = checkbox.checkerColor;
var alpha = checkbox.checkAlpha;
Set
checkbox.setCheckerStyle(color, alpha);
// checkbox.checkerColor = color;
// checkbox.checkAlpha = alpha;
Checker animation¶
Duration
Get
var duration = checkbox.checkerAnimDuration;
Set
checkbox.setCheckerAnimDuration(duration);
checkbox.checkerAnimDuration = duration;
Size¶
Get
var width = checkbox.width;
var height = checkbox.height;
Set
checkbox.setSize(width, height);
or
checkbox.width = width;
checkbox.height = height;
Display size¶
Get
var width = checkbox.displayWidth;
var height = checkbox.displayHeight;
Set
checkbox.setDisplaySize(width, height);
or
checkbox.displayWidth = width;
checkbox.displayHeight = height;
Size ratio¶
Get
var boxSize = checkbox.boxSize;
var checkerSize =checkbox.checkerSize;
boxSize, checkerSize : Size ratio of box, and checker
Set
checkbox.setBoxSize(sizeRatio);
checkbox.setCheckerSize(sizeRatio);
Events¶
On value change
checkbox.on('valuechange', function(value) {
// value: checked
})
Other properties¶
See game object
Create mask¶
See mask
Shader effects¶
Support internal and external filters