Chart
Introduction¶
Draw chart on canvas.
Author: Rex
Game object
Live demos¶
Radar chart
Usage¶
Sample code
Install plugin¶
Install chart.js¶
Chart.js is not included in rexUI, installs it before creating any chart.
scene.load.script('chartjs', 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.8.0/chart.min.js');
or
scene.load.script('chartjs', 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js');
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.script('chartjs', 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.8.0/Chart.min.js');
scene.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
Add chart object
var chart = scene.rexUI.add.chart(config);
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
Add chart object
var chart = scene.rexUI.add.chart(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import { Chart } from 'phaser4-rex-plugins/templates/ui/ui-components.js';
Add chart object
var chart = new Chart(scene, config);
scene.add.existing(chart);
Add chart object¶
var chart = scene.rexUI.add.chart(x, y, width, height, config);
x, y : Position of this object.
width, height : Canvas size.
config : Configuration for creating chart.
Set undefined to not create chart at beginning.
Custom class¶
Define class
class MyChart extends RexPlugins.UI.Chart {
constructor(scene, x, y, width, height, config) {
super(scene, x, y, width, height, config);
// ...
scene.add.existing(this);
}
// ...
}
Create instance
var chart = new MyChart(scene, x, y, width, height, config);
Create chart¶
Create chart (if not creating at beginning).
chart.setChart(config);
config : Configuration for creating chart.
Chart data¶
Get dataset
var dataset = chart.getChartDataset(datasetIndex);
datasetIndex : Index number or label string.
Get data
var data = chart.getChartData(datasetIndex, dataIndex);
datasetIndex : Index number or label string.
dataIndex : Index number or label string.
Set
chart.setChartData(datasetIndex, dataIndex, value).updateChart();
datasetIndex : Index number or label string.
dataIndex : Index number or label string.
Manipulate chart object¶
Get chart object
var chart = chart.chart;
Set properties of chart
Array of dataset
var datasets = chart.data.datasets;
Label of dataset
var label = chart.data.datasets[i].label;
Labels
var labels = chart.data.labels;
Set chart data
chart.data.datasets[datasetIndex].data[dataIndex] = value;
Update chart
chart.update();