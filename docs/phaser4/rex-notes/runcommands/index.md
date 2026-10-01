Run commands
Introduction¶
Run commands in array.
Author: Rex
Method only
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexruncommandsplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexruncommandsplugin.min.js', true);
Run commands
scene.plugins.get('rexruncommandsplugin').run(commands, scope);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import RunCommandsPlugin from 'phaser4-rex-plugins/plugins/runcommands-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexRunCommands',
plugin: RunCommandsPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Run commands
scene.plugins.get('rexRunCommands').run(commands, scope);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import RunCommands from 'phaser4-rex-plugins/plugins/runcommands.js';
Run commands
RunCommands(commands, scope);
Run commands¶
scene.plugins.get('rexRunCommands').run(commands, scope);
Format of command :
[fnName, param0, param1, ...]
or
[callback, param0, param1, ...]
Commands in nested array :
[
command0,
command1
[
command2,
command3
]
]
Run command :
scope[fnName].call(scope, param0, param1 ...)
or
callback.call(scope, param0, param1 ...)