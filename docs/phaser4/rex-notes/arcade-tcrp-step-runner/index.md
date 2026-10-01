Step runner
Introduction¶
Execute command in next WORLD_STEP(worldstep) event, to synchronize command execution with step-counter of Recorder of Arcade-TCRP.
Author: Rex
Member of scene
Command might be executed before or after WORLD_STEP(worldstep) event, which is emitted in scene's update event.
Before: Command is executed in any input(touch/keyboard) event, or in scene's preupdate event.
After: Command is executed in scene.updat() method.
Live demos¶
Player
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexarcadetcrpplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexarcadetcrpplugin.min.js', true);
Create instance
var stepRunner = scene.plugins.get('rexarcadetcrpplugin').addStepRunner(scene);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import TCRPPlugin from 'phaser4-rex-plugins/plugins/arcadetcrp-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexTCRP',
plugin: TCRPPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Create instance
var stepRunner = scene.plugins.get('rexTCRP').addStepRunner(scene);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import TCRP from 'phaser4-rex-plugins/plugins/arcadetcrp.js';
Create instance
var stepRunner = new TCRP.StepRunner(scene);
Create instance¶
var stepRunner = scene.plugins.get('rexTCRP').addStepRunner(scene);
Push commands¶
stepRunner.add(commands, scope);
See also Run commands
Offset recorder¶
Since commands will be executed in next WORLD_STEP(worldstep) event, recorder have to add 1 step-count offset.
Offset at recording start
recorder.start(1);
Add offset when pushing commands
recorder.addCommand([fnName, param0, param1, ...], 1);