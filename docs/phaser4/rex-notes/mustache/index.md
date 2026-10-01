Mustache
Introduction¶
Format string with variables.
Reference
Usage¶
var template = 'hello, {{name}}';
var view = {
name: 'rex'
};
var result = Mustache.render(template, view);