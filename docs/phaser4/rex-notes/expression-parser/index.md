Expression parser
Introduction¶
Parse expression string into function.
Parser is generated from jison
Author: Rex
Member of scene
Live demos¶
Dot-notation
Custom method
Proxy as context
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexexpressionparserplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexexpressionparserplugin.min.js', true);
Add parser
var parser = scene.plugins.get('rexexpressionparserplugin').add();
Or, parse expression to function object.
var f = scene.plugins.get('rexexpressionparserplugin').compile(expressionString);
// var value = f(context);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import ExpressionParserPlugin from 'phaser4-rex-plugins/plugins/expressionparser-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexExpressionParserPlugin',
plugin: ExpressionParserPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add parser
var parser = scene.plugins.get('rexExpressionParserPlugin').add();
Or, parse expression to function object.
var f = scene.plugins.get('rexExpressionParserPlugin').compile(expressionString);
// var value = f(context);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import ExpressionParser from 'phaser4-rex-plugins/plugins/expressionparser.js';
Add parser
var parser = new ExpressionParser();
Create instance¶
var parser = scene.plugins.get('rexExpressionParserPlugin').add();
or
var parser = scene.plugins.get('rexExpressionParserPlugin').add({
safeMode: false,
cache: false,
functions: {
randomInt(a, b) {
return Math.floor(Math.random()*(b-a)+a);
}
},
values: {
PI: Math.PI
},
defaultHandler(name, args, context) {
return 0;
},
defaultValueHandler(name, context, path) {
return 0;
}
});
safeMode : Restrict expression access when expression strings come from external data. Default value is false.
cache : Cache compiled expressions. Default value is false.
functions : Methods registered into parser.
values : Values registered into parser.
defaultHandler : Fallback callback for missing custom methods.
defaultValueHandler : Fallback callback for missing variables or properties.
Execute¶
Compile then execute¶
Compile expression string into function
var f = parser.compile(expressionString);
or
var f = scene.plugins.get('rexExpressionParserPlugin').compile(expressionString);
expressionString :
Number : 1, 1.5, 0xf.
Variable : a, $a, _a, a.$b._c_, a['b'].c
Arithmetic : +, -, *, \, %, (, ), ex : '(a + b.c) * 3 + (2 % 3)'.
Boolean : >, <, >=, <=, ==, !=, &&, ||, ex '(a > 10) && (a < 30) || (b.c > c)'.
Condition : (cond)? v0:v1, ex'(a > b.c)? a:b.c'.
Custom method : randomInt(a, b.c).
String concat : 'Hello ' + name.
Escape sequence : \n, \r, \t, \b, \f, \v, \0, \\, \', \", \xHH, \uHHHH, \u{H...}.
Invoke function
var value = f(context);
f : Function object from compiled result.
context : Varables used in expression.
{
a: 10,  // Number
b: {c: 10},  // Objet with number property
c: 20,
randomInt(a, b) {  // Custom method
return Math.floor(Math.random()*(b-a)+a);
}
}
Execute directly¶
var value = parser.exec(expressionString, context);
or
var value = parser.exec(f, context);
Default method¶
These methods are registered into each parser instance by default.
var value = parser.exec('round(a) * 10', { a: 2.6 });
// value: 30
round(value) : Math.round(value).
floor(value) : Math.floor(value).
ceil(value) : Math.ceil(value).
abs(value) : Math.abs(value).
min(...values) : Math.min(...values).
max(...values) : Math.max(...values).
clamp(value, min, max) : Clamp value into [min, max].
Default methods are registered before the functions config is applied, therefore they can be overridden.
var parser = new ExpressionParser({
functions: {
round(value) {
return Math.floor(value);
}
}
});
Custom method¶
Register method into parser instance
var parser = scene.plugins.get('rexExpressionParserPlugin').add();
parser.setFunction('randomInt', function(a, b) {
return Math.floor(Math.random()*(b-a)+a);
});
// var value = parser.exec('randomInt(a, b)', {a:10, b:20});
Add method into parser instance
var parser = scene.plugins.get('rexExpressionParserPlugin').add();
parser.randomInt = function(a, b) {
return Math.floor(Math.random()*(b-a)+a);
}
// var value = parser.exec('randomInt(a, b)', {a:10, b:20});
Declare method into class of parser
class MyParser extends ExpressionParser {
randomInt(a, b) {
return Math.floor(Math.random()*(b-a)+a);
}
}
var parser = new MyParser();
// var value = parser.exec('randomInt(a, b)', {a:10, b:20});
Add method into context
var context = {
a: 10,
b: 20,
randomInt(a, b) {  // Custom method
return Math.floor(Math.random()*(b-a)+a);
}
}
var value = parser.exec('randomInt(a, b)', context);
Custom value¶
Register shared values into parser instance.
var parser = scene.plugins.get('rexExpressionParserPlugin').add();
parser.setValue('PI', Math.PI);
parser.setValue('math.E', Math.E);
var value = parser.exec('r * r * PI', { r: 10 });
setValue(name, value) : Register a value.
setValues(values) : Register multiple values.
getValue(name, defaultValue) : Get a registered value.
removeValue(name) : Remove a registered value.
clearValues() : Remove all registered values.
Default handler¶
Fallback callback for missing custom methods.
parser.defaultHandler = function(name, args, context) {
return 0;
}
name : Missing method name, for example 'randomInt' or 'math.randomInt'.
args : Evaluated arguments.
context : Evaluation context.
Default handler could also be declared in context, which has higher priority than parser's default handler.
var context = {
a: 10,
b: 20,
defaultHandler(name, args, context) {
return 0;
}
}
Default value handler¶
Fallback callback for missing variables or properties.
parser.defaultValueHandler = function(name, context, path) {
return 0;
}
name : Missing variable or property path, for example 'a' or 'player.hp'.
context : Evaluation context.
path : Evaluated property path segments, for example ['player', 'hp'].
Default value handler could also be declared in context, which has higher priority than parser's default value handler.
var context = {
defaultValueHandler(name, context, path) {
throw new Error(`Unknown variable: ${name}`);
}
}
Safe mode¶
Restrict expression access when expression strings come from external data.
var parser = new ExpressionParser({
safeMode: true
});
or
parser.setSafeMode(true);
In safe mode :
Property lookup only reads own properties, not prototype properties.
Unsafe property names are blocked : __proto__, prototype, constructor.
Method calls can only invoke context methods or functions registered by setFunction().
Parser instance or prototype methods are not callable from expressions.
Unsafe property access throws an error and does not call defaultValueHandler or defaultHandler.
parser.setFunction('randomInt', function(a, b) {
return Math.floor(Math.random()*(b-a)+a);
});
Cache¶
Cache compiled expressions.
var parser = new ExpressionParser({
cache: true
});
or
parser.setCacheEnable(true);
var value = parser.exec('a + b', { a: 10, b: 20 });
parser.clearCache();
compile() also accepts a cache option.
var f = parser.compile('a + b', {
cache: true
});
Proxy as context¶
Proxy
with has and get handlers could be a context.
For example, proxy scene data :
var context = new Proxy({}, {
has(target, key) {
return scene.data.has(key);
},
get(target, prop) {
return scene.data.get(prop);
}
})
or
var context = scene.plugins.get('rexExpressionParserPlugin').createProxyContext({
has(target, key) {
// return boolean
},
get(target, prop) {
// return any;
}
})