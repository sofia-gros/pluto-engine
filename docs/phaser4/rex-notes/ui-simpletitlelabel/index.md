Simple title label
Introduction¶
Using plain object to create title-label.
Author: Rex
Game object
Live demos¶
Style
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
import { SimpleTitleLabel } from 'phaser4-rex-plugins/templates/ui/ui-components.js';
Add label object
var label = new SimpleTitleLabel(scene, style);
// var label = new SimpleTitleLabel(scene, style, creators);
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
layoutMode: 0,
// rtl: false,
background: backgroundStyle,
// background: null,
innerBackground: backgroundStyle,
// innerBackground: null,
icon: iconStyle,
// icon: null,
// iconMask: false,
// squareFitIcon: false,
// iconSize: undefined, iconWidth: undefined, iconHeight: undefined,
title: textStyle,
// title: null,
// wrapTitle: false,
// adjustTitleFontSize: false,
// expandTitleWidth: false,
// expandTitleHeight: false,
text: testStyle,
// text: null,
// wrapText: false,
// adjustTextFontSize: false,
// expandTextWidth: false,
// expandTextHeight: false,
separator: separatorStyle,
// separator: null,
action: actionStyle,
// action: null,
// squareFitAction: false,
// actionMask: false,
// actionSize: undefined, actionWidth: undefined, actionHeight: undefined,
space: {
left: 0, right: 0, top: 0, bottom:0,
icon: 0, text: 0
}
align: {
title: 'left',
text: 'left',
},
space: {
left: 0, right: 0, top: 0, bottom: 0,
innerLeft: 0, innerRight: 0, innerTop: 0, innerBottom: 0,
title: 0, titleLeft: 0, titleRight: 0,
icon: 0, iconTop: 0, iconBottom: 0,
text: 0, textLeft: 0, textRight: 0,
separator: 0, separatorLeft: 0, separatorRight: 0,
actionTop: 0, actionBottom: 0,
},
// name: '',
// draggable: false,
// sizerEvents: false,
// enableLayer: false,
});
background, innerBackground :
Style of Background : Create Round-rectangle, Nine-slice, or Image as background element.
null : Don't create any game object.
title :
Style of Text : Create Text, BBCodeText, BitmapText, SimpleLabel, or TextArea as title element.
null : Don't create any game object.
text :
Style of Text : Create Text, BBCodeText, BitmapText, SimpleLabel, or TextArea as text element.
null : Don't create any game object.
separator :
Style of Background : Create Round-rectangle, Nine-slice, or Image as separator element.
null : Don't create any game object.
icon, action :
Style of Image : Create Image, Nine-slice, or Round-rectangle as image, action element.
null : Don't create any game object.
Custom class¶
Define class
class MyLabel extends RexPlugins.UI.SimpleTitleLabel {
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
See title-label
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
See title-label
Other properties¶
See title-label, sizer object, base sizer object, container-lite.