Stencil containers
Introduction¶
A Container game object that builds an ordered sequence of Stencil, Container, and StencilReference game objects.
Use it when stencil ranges can overlap or interleave in a container coordinate space, for example:
add stencil A
render container0
add stencil B
render container1
remove stencil A
render container2
remove stencil B
render container3
Author: Rex
Game object
WebGL only
Only work in WebGL render mode.
Requires stencil buffer
Enable stencil buffer in game config. Default behavior is enabling stencil buffer.
var config = {
type: Phaser.WEBGL,
stencil: true,
// ...
};
Live demos¶
Mask
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexstencillayersplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexstencillayersplugin.min.js', true);
Add stencil-containers object
var mainContainer = scene.add.rexStencilContainers(x, y);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import StencilLayersPlugin from 'phaser4-rex-plugins/plugins/stencillayers-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexStencilLayersPlugin',
plugin: StencilLayersPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add stencil-containers object
var mainContainer = scene.add.rexStencilContainers(x, y);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import StencilContainers from 'phaser4-rex-plugins/plugins/stencilcontainers.js';
Add stencil-containers object
var mainContainer = new StencilContainers(scene, x, y, children);
scene.add.existing(mainContainer);
Create instance¶
var mainContainer = scene.add.rexStencilContainers(x, y);
// var mainContainer = scene.add.rexStencilContainers(x, y, children);
x, y : Position of this container.
children : Optional Game Object, or array of Game Objects, added as container children.
Add stencil-containers from JSON
var mainContainer = scene.make.rexStencilContainers({
x: 400,
y: 300,
add: true
});
Build stencil sequence¶
Create a stencil start operation and the container section rendered after it.
mainContainer.addStencil(stencilName, containerName, config);
or
mainContainer.addStencil({
stencilName: 'stencilA',
containerName: 'container0',
stencilInvert: true,
// stencilAlphaStrategy: 'dither',
// stencilCompositeCheck: 'auto',
// stencilClearValue: 0,
// stencilValueWrap: true
});
Create a stencil reference operation that removes an open stencil, and the container section rendered after it.
mainContainer.removeStencil(stencilName, containerName, config);
or
mainContainer.removeStencil({
stencilName: 'stencilA',
containerName: 'container1',
// stencilAlphaStrategy: 'dither',
// stencilCompositeCheck: 'auto',
// stencilClearValue: 0,
// stencilValueWrap: true
});
Verify that all stencils have matching remove operations.
Throws an error if any stencil has not been removed. A stencil can only be removed once.
mainContainer.end();
Example¶
var mainContainer = scene.add.rexStencilContainers(400, 300)
.addStencil({
stencilName: 'stencilA',
containerName: 'container0',
// layerName: 'container0',
stencilInvert: true
})
.addStencil({
stencilName: 'stencilB',
containerName: 'container1',
// layerName: 'container1',
stencilInvert: true
})
.removeStencil({
stencilName: 'stencilA',
containerName: 'container2',
// layerName: 'container2',
})
.removeStencil({
stencilName: 'stencilB',
containerName: 'container3',
// layerName: 'container3',
})
.end();
The generated display order is:
mainContainer
- stencilA            (Stencil)
- container0          (Container)
- stencilB            (Stencil)
- container1          (Container)
- stencilA reference  (Stencil reference)
- container2          (Container)
- stencilB reference  (Stencil reference)
- container3          (Container)
Add stencil source children.
mainContainer.getStencil('stencilA').add(
scene.add.circle(-150, 0, 200, 0xffffff)
);
mainContainer.getStencil('stencilB').add(
scene.add.circle(150, 0, 200, 0xffffff)
);
Add render content into generated containers.
mainContainer.getContainer('container0').add(gameObject);
mainContainer.getContainer('container1').add(gameObject);
mainContainer.getContainer('container2').add(gameObject);
mainContainer.getContainer('container3').add(gameObject);
Get generated objects¶
Get a generated Stencil.
var stencil = mainContainer.getStencil(stencilName);
Get a generated container section.
var container = mainContainer.getContainer(containerName);
// var container = mainContainer.getLayer(containerName);
Coordinate space¶
StencilContainers extends Container. Generated stencils and generated container sections are children of this main container.
Stencil source children use the main container coordinate space.
var mainContainer = scene.add.rexStencilContainers(400, 300);
mainContainer.getStencil('stencilA').add(
scene.add.circle(-150, 0, 200, 0xffffff)
);
mainContainer.getContainer('container0').add(
scene.add.image(0, 0, 'classroom')
);
Custom class¶
Define class
class MyStencilContainers extends StencilContainers {
constructor(scene, x, y, children) {
super(scene, x, y, children);
// ...
scene.add.existing(this);
}
// ...
}
scene.add.existing(gameObject) : Adds an existing Game Object to this Scene.
If the Game Object renders, it will be added to the Display List.
If it has a preUpdate method, it will be added to the Update List.
Create instance
var mainContainer = new MyStencilContainers(scene, x, y, children);
Difference from StencilLayers¶
StencilLayers is a Layer-based sequence. Generated sections are Layers by default, and can be Containers when useContainer: true.
StencilContainers is a Container-based sequence. Generated sections are Containers. Use StencilContainers when the stencil sequence should move, scale, rotate, or nest as one Container.
Other properties¶
See container and game object.