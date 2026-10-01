Page
Introduction¶
Display text page by page on text object, bbcode text object, or tag text object.
Author: Rex
Behavior of text object
Live demos¶
BBCode text + page + typing
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rextextpageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextextpageplugin.min.js', true);
Add page behavior
var page = scene.plugins.get('rextextpageplugin').add(textGameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import TextPagePlugin from 'phaser4-rex-plugins/plugins/textpage-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexTextPage',
plugin: TextPagePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add page behavior
var page = scene.plugins.get('rexTextPage').add(textGameObject, config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import TextPage from 'phaser4-rex-plugins/plugins/textpage.js';
Add page behavior
var page = new TextPage(textGameObject, config);
Create instance¶
var page = scene.plugins.get('rexTextPage').add(textGameObject, {
// text: '',              // content in string or array
// maxLines: undefined,
// pageBreak: '\f\n',
});
textObject : Text object, bbcode text object, tag text object, or bitmap text object
text : content in string or array, optional
maxLines : Max lines of a page.
undefined : Default value. For Text object, bbcode text object, tag text object
Use style property maxLines.
Count number of lines if it has fixedHeight setting.
A number : Max lines of a page, for bitmap text object
pageBreak : Symbol of page-break. Default value is '\f\n'. String after this page-break symbol will be placed to a new page.
Set content¶
Set content
page.setText(content);
content : String, number, or string array. Can insert pageBreak symbol.
Append content
page.appendText(content);
content : String, number, or string array. Can insert pageBreak symbol.
Clear content
page.clearText()
Append page
page.appendPage(content);   // content in string or array
content : String, number, or string array. Don't insert pageBreak symbol.
Show page¶
Display current page
page.showPage();
Display next page
page.showNextPage();
Display previous page
page.showPreviousPage();
Display first page
page.showFirstPage();
Display last page
page.showLastPage();
Display page by index
page.showPage(index);
Display page by line index
page.showPageNyLineIndex(index);
Note
Initial page index is -1, so user could call page.showNextPage() to display first page.
Get lines of page¶
Page by page¶
Get lines of current page
var lines = page.getPage();
Get lines of next page
var lines = page.getNextPage();
Get lines of previous page
var lines = page.getPreviousPage();
Get lines of first page
var lines = page.getFirstPage();
Get lines of last page
var lines = page.getLastPage();
Get lines of page by page index
var lines = page.getPage(index);
Page of line¶
Get line of page by line index
var lines = page.getPageByLineIndex(index);
Get page of next line
var lines = page.getPageOfNextLine(index);
Get page of previous line
var lines = page.getPageOfPreviousLine(index);
Other properties¶
Page by page¶
Is last page
var isLastPage = page.isLastPage;
Is first page
var isFirstPage = page.isFirstPage;
Current page index
var pageIndex = page.pageIndex;
Number of pages
var pageIndex = page.pageCount;
Page of line¶
Is last line
var isLastLine = page.isLastLine;
Is first line
var isFirstLine = page.isFirstLine;
Start line index
var startLineIndex = page.startLineIndex;
End line index
var endLineIndex = page.endLineIndex;
Number of lines
var totalLinesCount = page.totalLinesCount;