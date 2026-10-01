Graph
Introduction¶
Core object of Graph system.
Author: Rex
Member of scene
Live demos¶
Random connection
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexgraphplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgraphplugin.min.js', 'rexGraph', 'rexGraph');
Add graph object
var graph = scene.rexGraph.add.graph(config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import GraphPlugin from 'phaser4-rex-plugins/plugins/graph-plugin.js';
var config = {
// ...
plugins: {
scene: [{
key: 'rexGraph',
plugin: GraphPlugin,
mapping: 'rexGraph'
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add graph object
var graph = scene.rexGraph.add.graph(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { Graph } from 'phaser4-rex-plugins/plugins/graph-components.js';
Add graph object
var graph = new Graph(scene, config);
Add graph object¶
var graph = scene.rexGraph.add.graph({
});
Custom class¶
Define class
class MyGraph extends RexPlugins.Graph.Graph {
constructor(scene) {
super(scene);
// ...
}
// ...
}
Create instance
var graph = new MyGraph(scene);
Add node or edge¶
Add node¶
graph.addNode(nodeGameObject);
Add edge¶
graph.addEdge(edgeGameObject, nodeAGameObject, nodeBGameObject)
Is node or edge¶
var isNode = grapg.isNode(gameObject);
var isEdge = grapg.isEdge(gameObject);
var isNodeOrEdge = graph.exists(gameObject);
Remove node or edge¶
Remove node or edge¶
graph.remove(gameObject);
// graph.remove(gameObject, destroy);
destroy : Default value is false
Remove node¶
graph.removeNode(nodeGameObject);
// graph.removeNode(nodeGameObject, destroy);
destroy : Default value is false
Remove all nodes¶
graph.removeNode();
// graph.removeNode(destroy);
destroy : Default value is false
Remove edge¶
graph.removeEdge(edgeGameObject);
// graph.removeEdge(edgeGameObject, destroy);
destroy : Default value is false
Remove all edges¶
graph.removeAllEdges();
// graph.removeAllEdges(destroy);
destroy : Default value is false
Remove all nodes and edges¶
graph.clear();
// graph.clear(destroy);
destroy : Default value is false
Get node or edge¶
Get all nodes¶
var nodeGameObjects = graph.getAllNodes();
// var nodeGameObjects = graph.getAllNodes(out);
Get all edges¶
var edgeGameObjects = graph.getAllEdges();
// var edgeGameObjects = graph.getAllEdges(out);
Get connected nodes of an edge¶
var nodeGameObjects = graph.getNodesOfEdge(edgeGameObject);
// var nodeGameObjects = graph.getNodesOfEdge(edgeGameObject, out);
Get opposite node¶
var nodeGameObject = graph.getOppositeNode(nodeGameObject, edgeGameObject);
Get all edges connected to a node¶
var edgeGameObjects = graph.getEdgesOfNode(nodeGameObject);
// var edgeGameObjects = graph.getEdgesOfNode(nodeGameObject, out);
Get neighbor nodes¶
var nodeGameObject = graph.getNeighborNodes(nodeGameObject);
// var nodeGameObject = graph.getNeighborNodes(nodeGameObject, out);
Are neighbor node
var areNeighborNode = graph.areNeighborNodes(nodeAGameObject, nodeBGameObject);
Get edge length¶
Length between connected nodes of this edge
var length = graph.getEdgeLength(edgeGameObject);
For each node or edge game object¶
graph.forEachGameObject(function(gameObject){
})
Container¶
Add nodes and edges into container,
adjust node and edge positions to fit the container and update its size.
graph.fitContainer(container);
// graph.fitContainer(container, padding);
container : p3-container
Layer¶
Add nodes and edges into layer
graph.addToLayer(layer);
Adjust node and edge positions
graph.setGraphOffset(x, y);
Default offset is (0, 0)
Bounds¶
Get bounds¶
var bounds = graph.getBounds();
// var bounds = graph.getBounds(out);
bounds : Rectangle
Draw bounds¶
graph.drawBounds(graphics, color);
graphics : Graphics
Attribute¶
Attribute = private data of node or edge, used for layout (ELK-layout)
Set attribute¶
Set attribute of node or edge
graph.setAttribute(gameObject, key, value);
Set attribute of node
graph.setNodeAttribute(gameObject, key, value);
Set attribute of nodes
graph.setNodesAttribute(gameObjects, key, value);
Set attribute of edge
graph.setEdgeAttribute(gameObject, key, value);
Set attribute of edges
graph.setEdgesttribute(gameObjects, key, value);
Get attribute¶
Get attribute of node or edge
var value = graph.getAttribute(gameObject, key);
Get attribute of node
var value = graph.setNodeAttribute(gameObject, key);
Get attribute of edge
var value = graph.setEdgesAttribute(gameObjects, key);