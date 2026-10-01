Handlebars
Introduction¶
Format string with variables, largely compatible with Mustache templates.
Reference
Usage¶
var template = 'hello, {{name}}';
var view = {
name: 'rex'
};
var result = Mustache.render(template, view);
Pre-compile¶
const template = Handlebars.compile("{{foo}}");
template({}, {
// allowProtoPropertiesByDefault: false,
// allowProtoMethodsByDefault: false
});