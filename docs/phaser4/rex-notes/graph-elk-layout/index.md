ELK layout
Introduction¶
Layout nodes and edges of graph by ELK library.
Author: Rex
Method
Live demos¶
Graph in container
Graph in scrollablepanel
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.scenePlugin('rexgraphplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgraphplugin.min.js', 'rexGraph', 'rexGraph');
Add graph object
var graph = scene.rexGraph.add.graph(config);
Create node and edge game objects from code or text
graph.addNode(...);
graph.addEdge(...);
scene.rexGraph.buildGraphFromText(graph, config);
It is recommended that using line game object for edge game object
Layout node and edge game objects
await scene.rexGraph.ELKLayout(graph, config);
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
Create node and edge game objects from code or text
graph.addNode(...);
graph.addEdge(...);
scene.rexGraph.buildGraphFromText(graph, config);
It is recommended that using line game object for edge game object
Layout node and edge game objects
await scene.rexGraph.ELKLayout(graph, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { Graph, /* BuildGraphFromText */, ELKLayout } from 'phaser4-rex-plugins/plugins/graph-components.js';
Add graph object
var graph = new Graph(scene, config);
Create node and edge game objects from code or text
graph.addNode(...);
graph.addEdge(...);
BuildGraphFromText(graph, config);
It is recommended that using line game object for edge game object
Layout node and edge game objects
await ELKLayout(graph, config);
Layout node and edge game objects¶
await ELKLayout(graph, {
onLayoutStart: undefined,
onLayoutComplete: undefined,
onLayoutNode: undefined,
onLayoutEdge: undefined,
layoutConfig: {
layoutOptions: {
// ...
}
},
container: undefined,
containerPadding: undefined,
graphOffsetX: 0,
graphOffsetY: 0,
});
Callbacks:
onLayoutStart : Callback invoked when starting this ELKLayout method. Default value is undefined
function(graph) {
}
onLayoutComplete : Callback invoked when finishing this ELKLayout method (ELKLayout method is asynchronous). Default value is undefined
function(graph) {
}
onLayoutNode : Callback invoked when setting position of a node game object. Default value is undefined
function(nodeGameObject) {
}
onLayoutEdge : Callback invoked when setting path of a node game object. Default value is
function (gameObject, path, sourceGameObject, targetGameObject) {
if (gameObject.setLine) {
gameObject.setLine(path);
}
if (gameObject.setHeadShape) {
if (!gameObject.hasOwnProperty('headShapeSave')) {
gameObject.headShapeSave = gameObject.headShape;
}
if (sourceGameObject.$dummy) {
gameObject.setHeadShape(0);
} else {
gameObject.setHeadShape(gameObject.headShapeSave);
}
}
if (gameObject.setTailShape) {
if (!gameObject.hasOwnProperty('tailShapeSave')) {
gameObject.tailShapeSave = gameObject.tailShape;
}
if (targetGameObject.$dummy) {
gameObject.setTailShape(0);
} else {
gameObject.setTailShape(gameObject.tailShapeSave);
}
}
}
gameObject : Assume that edge game object is line game object with 'poly' line type
path : Point {x, y} array
sourceGameObject, targetGameObject : Node game object of this edge
Configuration of elk.layout(...)
layoutConfig : Parameters pass to elk.layout(...) method, suggestion value for creating top-down, orthogonal edge graph :
{
layoutOptions: {
'elk.algorithm': 'layered',
'elk.direction': 'DOWN',
'elk.edgeRouting': 'ORTHOGONAL',
'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
'elk.layered.considerModelOrder.components': 'MODEL_ORDER',
},
}
Container:
container : Put all nodes and edge into a p3-container, adjust node and edge positions to fit the container and update its size.
containerPadding : Extend size of container.
Graph offset if container is not assigned
graphOffsetX, graphOffsetY : Graph offset, default is 0, 0, i.e. align graph to (0, 0)
Node or edge parameters¶
Node parameters¶
padding : Space between node and edge
Code
graph.addNode(nodeGameObject, { padding:3 });
Build from text
NodeID [padding=3]
Layout alignment Assistant¶
Add dummy nodes and invisible edges to group multiple components into a single logical component for improved layer alignment.
Example:
Before alignment :
A -> B -> C -> H -> I
A -> D -> E -> H -> I
A -> F -> * -> G -> I
J -> K -> L -> * -> I
* *> M -> * -> * -> I
O -> P -> Q -> R -> S
T -> U -> Q
V -> W -> X -> R
Y -> Z -> X
After alignment :
A -> B -> C -> H -> I
A -> D -> E -> H -> I
A -> F -> * -> G -> I
J -> K -> L -> * -> I
* *> M -> * -> * -> I
O -> P -> Q -> R -> S
T -> U -> Q
V -> W -> X -> R
Y -> Z -> X
/*
For trees alignment,
connect to dummy node with invisible edge
*/
I *> *1
S *> *1
Dummy node¶
graph.addNode(graph.createDummyNode());
See also dummy node
Invisible edge¶
graph.addEdge(graph.createInvisibleEdge());
See also invisible edge