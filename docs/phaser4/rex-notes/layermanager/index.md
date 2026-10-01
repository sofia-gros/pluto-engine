Layer manager
Introduction¶
A dictionary to store Layer game objects. Each layer can have a dedicate camera.
Author: Rex
Container of game objects
Relationship diagram¶
Camera - layer - game object
graph RL
subgraph Cameras
cameraBG[BG]
cameraGO[GO]
cameraUI[UI]
end
subgraph Layers
subgraph BG
layerBGBottom[BG-bottom]
layerBG[BG]
layerBGTop[BG-top]
end
subgraph GO
layerGOBottom[GO-bottom]
layerGO[GO]
layerGOTop[GO-top]
end
subgraph UI
layerUIBottom[UI-bottom]
layerUI[UI]
layerUITop[UI-top]
end
end
layerBGBottom --> cameraBG
layerBG --> cameraBG
layerBGTop --> cameraBG
layerGOBottom --> cameraGO
layerGO --> cameraGO
layerGOTop --> cameraGO
layerUIBottom --> cameraUI
layerUI --> cameraUI
layerUITop --> cameraUI
subgraph GameObjects
goBG0["Background"] --> layerBG
goBG1["Background"] --> layerBG
go0[GameObject] --> layerGO
go1[GameObject] --> layerGO
go2[GameObject] --> layerGO
go3[GameObject] --> layerGO
goUI0[Panel] --> layerUI
goUI1[Panel] --> layerUI
goSYSUI[System dialog] --> layerUITop
end
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexlayermanagerplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexlayermanagerplugin.min.js', true);
Add layer manager
var layerManager = scene.plugins.get('rexlayermanagerplugin').add(scene, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import LayerManagerPlugin from 'phaser4-rex-plugins/plugins/layermanager-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexLayerManager',
plugin: LayerManagerPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add layer manager
var layerManager = scene.plugins.get('rexLayerManager').add(scene, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import LayerManager from 'phaser4-rex-plugins/plugins/layermanager.js';
Add move-to behavior
var layerManager = new LayerManager(scene, config);
Create instance¶
var layerManager = scene.plugins.get('rexLayerManager').add(scene, {
// layers: ['layer0', 'layer1', ...]
// layers: [{name, cameraName, scrollFactor}, ...]
// depth: undefined,
// rootLayer: undefined,
});
or
var layerManager = scene.plugins.get('rexLayerManager').add(scene,
['layer0', 'layer1', ...]
// [{name, cameraName, scrollFactor}, ...]
);
layers : Add some initial layers
A string array : Add layers by string name
A array of plain object { name, cameraName, scrollFactor }
Add layer by string name
Apply scroll factor to all children of this layer.
Bind this layer to dedicate camera (indexed by cameraName), ignore other cameras
Add a new camera if this target camera is not existing
depth : Set depth to each layer game object.
undefined : Keep default depth value (0)
rootLayer : Add all layer game objects created by this layer-manager into this root layer.
Destroy¶
layerManager.destroy()
Also destroy all layers in this layer manager.
Add layer¶
layerManager.add(name);
// layerManager.add(name, depth);
Add game object to layer¶
layerManager.addToLayer(name, gameObject);
name : Name of layer
gameObject : Any kind of game object, include containerLite and related game objects.
Note
Print a warn message if specific layer is not existed.
Get layer¶
Get layer by name
var layer = layerManager.getLayer(name);
Get all layers in this layer manager
var layers = layerManager.getLayers();
// var out = layerManager.getLayers(out);
Has layer¶
var hasLayer = layerManager.has(name);
// var hasLayer = layerManager.exists(name);
Clear layer¶
Destroy all children at layer
layerManager.clearLayer(name);
Move all children from layer to scene's display list
layerManager.clearLayer(name, false);
Change depth¶
Bring a layer (layerName) to top of displayList
layerManager.bringLayerToTop(layerName);
Send a layer (layerName) to bottom of displayList
layerManager.sendLayerToBack(layerName);
Move a layer (layerName) above another layer (baseLayerName)
layerManager.moveLayerAbove(layerName, baseLayerName)
Move a layer (layerName) below another layer (baseLayerName)
layerManager.moveLayerBelow(layerName, baseLayerName)
Set scroll factor¶
layerManager.setScrollFactor(scrollFactor);
// layerManager.setScrollFactor(scrollFactorX, scrollFactorY);
Apply scroll factor to all children of this layer.
Bind camera¶
Set camera
layerManager.setCamera(layerName, cameraName);
Bind this layer to dedicate camera (indexed by cameraName), ignore other cameras
Add a new camera if this target camera is not existing
Get camera
var camera = layerManager.getCamera(layerName);