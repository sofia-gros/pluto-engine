Simple label
Introduction¶
Using plain object to create label.
Author: Rex
Game object
Live demos¶
Style
Bitmaptext
Nine-slice background
Bar-rectangle background
Wrap text
TextArea
Buttons
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
Add label object
var label = scene.rexUI.add.simpleLabel(style).resetDisplayContent(config);
//var label = scene.rexUI.add.simpleLabel(style, creators).resetDisplayContent(config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import UIPlugin from 'phaser4-rex-plugins/templates/ui/ui-plugin.js';
var config = {
// ...
plugins: {
scene: [{
key: 'rexUI',
plugin: UIPlugin,
mapping: 'rexUI'
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add label object
var label = scene.rexUI.add.simpleLabel(style).resetDisplayContent(config);
//var label = scene.rexUI.add.simpleLabel(style, creators).resetDisplayContent(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { SimpleLabel } from 'phaser4-rex-plugins/templates/ui/ui-components.js';
Add label object
var label = new SimpleLabel(scene, style);
// var label = new SimpleLabel(scene, style, creators);
scene.add.existing(label);
label.resetDisplayContent(config)
Add label object¶
var label = scene.rexUI.add.simpleLabel({
// x: 0,
// y: 0,
// anchor: undefined,
// width: undefined,
// height: undefined,
// origin: 0.5
// originX:
// originY:
orientation: 0,
// rtl: false,
background: backgroundStyle,
// background: null,
icon: iconStyle,
// icon: null,
// iconMask: false,
// squareFitIcon: false,
// iconSize: undefined, iconWidth: undefined, iconHeight: undefined,
text: textStyle,
// text: null,
// wrapText: false,
// adjustTextFontSize: false,
// expandTextWidth: false,
// expandTextHeight: false,
action: actionStyle,
// action: null,
// squareFitAction: false,
// actionMask: false,
// actionSize: undefined, actionWidth: undefined, actionHeight: undefined,
space: {
left: 0, right: 0, top: 0, bottom:0,
icon: 0, text: 0
}
align: undefined,  // 'left' | 'top' | 'right' | 'bottom' | 'center
// name: '',
// draggable: false,
// sizerEvents: false,
// enableLayer: false,
});
background :
Style of Background : Create Round-rectangle, Bar-rectangle, Nine-slice, or Image as background element.
null : Don't create any game object.
text :
Style of Text : Create Text, BBCodeText, BitmapText, SimpleLabel, or TextArea as text element.
null : Don't create any game object.
icon, action :
Style of Image : Create Image, Nine-slice, or Round-rectangle as image, action element.
null : Don't create any game object.
Custom class¶
Define class
class MyLabel extends RexPlugins.UI.SimpleLabel {
constructor(scene, config, creators) {
super(scene, config, creators);
// ...
scene.add.existing(this);
}
// ...
}
Create instance
var label = new MyLabel(scene, config, creators);
Reset display content¶
See label
Layout children¶
Arrange position of all elements.
label.layout();
See also - dirty
Set state¶
Override/restore properties of elements.
Active state¶
Enable active state
label.setActiveState();
// label.setActiveState(true);
Override properties of background declared in config with prefix 'active.' parameters.
Disable active state
label.setActiveState(false);
Restore properties of background.
Hover state¶
Enable active state
label.setHoverState();
// label.setHoverState(true);
Override properties of background declared in config with prefix 'hover.' parameters
Disable active state
label.setHoverState(false);
Restore properties of background.
Disable state¶
Enable disable state
label.setDisableState();
// label.setDisableState(true);
Override properties of background declared in config with prefix 'disable.' parameters
Disable disable state
label.setDisableState(false);
Restore properties of background.
Get element¶
See label
Other properties¶
See label, sizer object, base sizer object, container-lite.