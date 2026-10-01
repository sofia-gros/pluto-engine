Character cache
Introduction¶
Generate bitmapfont from text game object, or bbcode text game object.
Author: Rex
Member of scene
Live demos¶
Set text
Textbox
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexcharactercacheplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcharactercacheplugin.min.js', true);
Add character-cache object
var characterCache = scene.plugins.get('rexcharactercacheplugin').add(config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import CharacterCachePlugin from 'phaser4-rex-plugins/plugins/charactercache-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexCharacterCache',
plugin: CharacterCachePlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Add character-cache object
var characterCache = scene.plugins.get('rexCharacterCache').add(config);
Import class¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import class
import CharacterCache from 'phaser4-rex-plugins/plugins/charactercache.js';
Add character-cache object
var characterCache = new CharacterCache(game, config);
or
var characterCache = new CharacterCache(scene, config);
Create instance¶
var characterCache = scene.plugins.get('rexCharacterCache').add({
key: '',
cellWidth: 32,
cellHeight: 32,
maxCharacterCount: 4096,
freqMode: true,
style: textStyle,
// textObject: textGameOject,
content: '',
});
key : Texture key in texture manager
cellWidth, cellHeight : Maximum frame size.
maxCharacterCount : Maximun character count.
Width of texture = Math.ceil(Math.sqrt(maxCharacterCount)) * cellWidth
Height of texture = Math.ceil(Math.sqrt(maxCharacterCount)) * cellHeight
freqMode :
true : Swap out un-unsed and low-frequence character.
false : Swap out any un-unsed character.
style : Style of Text game object. Create a text game object by this style setting
on systemScene if textObject parameter is not given.
textObject : Text game object, or bbcode text game object for drawing character.
content : Load these characters into cache.
Create BitmapText¶
Create BitmapText/Dynamci BitmapText game object using this character cache,
add this game object into scene's display list
BitmapText
var txt = characterCache.addBitmapText(scene);
// var txt = characterCache.addBitmapText(scene, x, y, text, size, align);
Dynamci BitmapText
var txt = characterCache.addDynamicBitmapText(scene);
// var txt = characterCache.addDynamicBitmapText(scene, x, y, text, size, align);
Load characters¶
Load characters into bitmap font, replace unused characters if no free character space.
characterCache.load(content);
// characterCache.load(content, lock);
content : Characters in a string.
lock
true : Lock these characters, won't be replaced out later.
false : Don't lock these characters, can be replaced out later. Default behavior.
Warning
Console.warn messages if no unused character is found.
Events¶
Add a character
characterCache.on('add', function(character, textObject) {
// Can change style of textObject here
})
Swap out a character
characterCache.on('remove', function(character, textObject) {
})
Override bitmaptext¶
Inject characterCache.load(text) into bitmapText.setText(text) method.
characterCache.overrideBitmapText(bitmapText);
// var bitmapText = characterCache.overrideBitmapText(bitmapText);
Now setText method has lock parameter : bitmapText.setText(text, lock).
Or user can override bitmapText.setText by extending Phaser.GameObjects.BitmapText class.
Unlock all characters¶
characterCache.unlock();
Get all cache data¶
var cacheData = characterCache.getAllData();
cacheData : Array of cache data
{
character: string,
freq: number,
alive: boolean,
lock: boolean,
}
Destroy instance¶
characterCache.destroy();
Properties¶
characterCache.key : Font key.
characterCache.cellWidth, characterCache.cellHeight : Cell size.
characterCache.inCacheCount : Amount of characters in cache.