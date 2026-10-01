CSV to hash table
Introduction¶
Hash table indexed by (col-key, row-key) from csv string.
Author: Rex
Member of scene
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexcsvtohashtableplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcsvtohashtableplugin.min.js', true);
Add hash-table object
var table = scene.plugins.get('rexcsvtohashtableplugin').add();
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import CsvToHashTablePlugin from 'phaser4-rex-plugins/plugins/csvtohashtable-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexCsvToHashTable',
plugin: CsvToHashTablePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add hash-table object
var table = scene.plugins.get('rexCsvToHashTable').add();
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import CsvToHashTable from 'phaser4-rex-plugins/plugins/csvtohashtable.js';
Add hash-table object
var table = new CsvToHashTable();
Create instance¶
var table = scene.plugins.get('rexCsvToHashTable').add();
Append rows from csv string¶
table.loadCSV(csvString, {
// delimiter: ',',
// convert: true
// convertScope: undefined
});
For exameple, csv string
name
hp
mp
Rex
100
20
Alice
300
40
name,hp,mp
Rex,100,20
Alice,300,40
will be converted to
{
"Alice": {
"name": "Alice",
"hp": 300,
"mp": 40
},
"Rex": {
"name": "Rex",
"hp": 100,
"mp": 20
}
}
Then get value by
var value = table.get('Rex', 'hp');
Convert value type¶
Values will be converted to number (include hex number string like '0xFF'), boolean, null, or string, if convert is true, or assign your convert function by convert and convertScope when loading table (table.loadCSV(...)).
var convertCallback = function(table, rowKey, colKey, value) {
// value = ...
return value;
};
Or uses these metheds to convert columns or rows.
convert values in column
table.convertCol(colKey);  // colKey: a colKey, or an array of colKeys
// table.convertCol(colKey, convertCallback, convertCallbackScope);
convert values in row
table.convertRow(rowKey);  // rowKey: a rowKey, or an array of rowKeys
// table.convertRow(rowKey, convertCallback, convertCallbackScope);
Get value¶
var val = table.get(rowKey, colKey);
rowKey : Row key string, or row index number.
colKey : Column key string, or column index number.
Set value¶
table.set(rowKey, colKey, value);
table.add(rowKey, colKey, value);
// equal to table.set(rowKey, colKey, table.get(rowKey, colKey) + value);
rowKey : Row key string, or row index number.
colKey : Column key string, or column index number.
Has column/row key¶
var hasRow = table.hasRowKey(rowKey);
var hasCol = table.hasColKey(colKey);
var hasCell = table.hasKey(rowKey, colKey);
rowKey : Row key string, or row index number.
colKey : Column key string, or column index number.
Value in column or row¶
var existed = table.isValueInRol(rowKey, value);
var existed = table.isValueInCol(colKey, value);
rowKey : Row key string, or row index number.
colKey : Column key string, or column index number.
Create table¶
Clear table¶
table.clear();
Append a column¶
table.appendCol(colKey, initValue);
// table.appendCol(colKey, callback, scope);  // get initValue from callback
Callback
var callback = function (table, rowKey, colKey) {
// value = ...
return value;
};
colKey : Column key string, or column index number.
Append a row¶
table.appendRow(rowKey, initValue);
// table.appendRow(rowKey, callback, scope);  // get initValue from callback
Callback
var callback = function (table, rowKey, colKey) {
// value = ...
return value;
};
rowKey : Row key string, or row index number.
Remove a column¶
table.removeCol(colKey);
colKey : Column key string, or column index number.
Remove a row¶
table.removeRol(rowKey);
rowKey : Row key string, or row index number.
Sort column or row¶
table.sortCol(colKey, mode);
// table.sortCol(callback, scope);  // sort columns by callback
table.sortRow(rowKey, mode);
// table.sortRow(callback, scope);  // sort rows by callback
rowKey : Row key string, or row index number.
colKey : Column key string, or column index number.
Mode:
'ascending', or 0
'descending', or 1
'logical ascending', or 2
'logical descending', or 3
Sorting callback
var callback = function(rowKeyA, rowKeyB) {
return result; // 1, -1, or 0
};
Retrieve columns or rows¶
table.eachCol(rowKey, callback, scope);
table.eachRow(colKey, callback, scope);
rowKey : Row key string, or row index number.
colKey : Column key string, or column index number.
Callback
var callback = function(table, rowKey, colKey, value) {
// ...
};
JSON¶
Table to json
var jsonData = table.toJSON();
Reset table by JSON
table.resetFromJSON(jsonData);