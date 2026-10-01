Loader
Introduction¶
Load assets, built-in object of phaser.
Author: Phaser Team
Usage¶
Loading in preload stage¶
scene.load.image(key, url);
// scene.load.image(config); // config: {key, url}
Loader in preload stage will start loading automatically by scene.
Loading after preload stage¶
scene.load.image(key, url);   // add task
// scene.load.image(config); // config: {key, url}
scene.load.once('complete', callback, scope);  // add callback of 'complete' event
scene.load.start();                     // start loading
Set path¶
scene.load.setPath(path)
More configurations¶
More configurations in game config
loader:{
baseURL: '',
path: '',
enableParallel: true,
maxParallelDownloads: 4,
crossOrigin: undefined,
responseType: '',
async: true,
user: '',
password: '',
timeout: 0,
maxRetries: 2,
withCredentials: false,
imageLoadType: 'XHR',    // 'HTMLImageElement'
localScheme: [ 'file://', 'capacitor://' ]
},
Events¶
Load file complete event
scene.load.on('filecomplete', function(key, type, data) {}, scope);
scene.load.on('filecomplete-' + type + '-' + key, function(key, type, data) {}, scope);
Add loading file event
scene.load.on('addfile', function(key, type, file) {}, scope);
Start loading
scene.load.once('start', function(){}, scope);
Loading progressing
scene.load.on('progress', function(progress){}, scope);
progress value will increase when a file is loaded, and decrease when a new file loading request is added.
var loader = scene.load;
var total = loader.totalToLoad;
var remainder = loader.list.size + loader.inflight.size;
var progress = 1 - (remainder / total);
Loading file progressing
scene.load.on('fileprogress', function(file, progress){
// var key = file.key;
}, scope);
Loading a file object successful
scene.load.once('load', function(fileObj){}, scope);
Loading a file object failed
scene.load.once('loaderror', function(fileObj){}, scope);
All loading completed
Before releasing resources
scene.load.once('postprocess', function(loader){}, scope);
After releasing resources
scene.load.once('complete', function(loader){}, scope);
Scene's 'preupdate', 'update', 'postupdate', 'render' events will be triggered during preload stage.
Status of loader¶
Ready to start loading
var isReady = scene.load.isReady();
Is loading
var isLoading = scene.load.isLoading();
File types¶
Image¶
Image
scene.load.image(key, url);
// scene.load.image(key, url, xhrSettings);
url : Url of texture, or base64 string of Uri.
Image and normal map
scene.load.image(key, [url, normalMapUrl]);
// scene.load.image(key, [url, normalMapUrl], xhrSettings);
url : Url of texture, or base64 string of Uri.
normalMapUrl : Url of normal map.
SVG
scene.load.svg(key, url);
// scene.load.svg(key, url, svgConfig);
// scene.load.svg(key, url, svgConfig, xhrSettings);
svgConfig : {width, height}, or {scale}
Html texture
scene.load.htmlTexture(key, url, width, height);
// scene.load.htmlTexture(key, url, width, height, xhrSettings);
Get data from texture cache
var cache = scene.textures;
var data = cache.get(key);
Sprite sheet¶
scene.load.spritesheet(key, url, {
// frameWidth: frameWidth,
// frameHeight: frameHeight,
// startFrame: startFrame,
// endFrame: endFrame,
// margin: margin,
// spacing: spacing
});
// scene.load.spritesheet(key, url, frameConfig, xhrSettings);
Get data from texture cache
var cache = scene.textures;
var data = cache.get(key);
Texture atlas¶
scene.load.atlas(key, textureURL, atlasURL);
// scene.load.atlas(key, textureURL, atlasURL, textureXhrSettings, atlasXhrSettings);
Get data from texture cache
var cache = scene.textures;
var data = cache.get(key);
On load complete
scene.load.on('filecomplete-atlasjson-' + key, function(key, type, data) {}, scope);
Multi file texture atlas¶
scene.load.multiatlas(key, atlasURL);
// scene.load.multiatlas(key, atlasURL, path, baseURL, atlasXhrSettings);
atlasURL : The absolute or relative URL to load the texture atlas json data file from.
path : Optional path to use when loading the textures defined in the atlas data.
baseURL : Optional Base URL to use when loading the textures defined in the atlas data.
Unity texture atlas¶
scene.load.unityAtlas(key, textureURL, atlasURL);
// scene.load.unityAtlas(key, textureURL, atlasURL, textureXhrSettings, atlasXhrSettings);
Animation¶
scene.load.animation(key, url);
// scene.load.animation(key, url, dataKey, xhrSettings);
Get data from json cache
var cache = scene.json;
var data = cache.get(key);
Audio¶
scene.load.audio(key, urls);
// scene.load.audio(key, urls, {instances: 1}, xhrSettings);
urls : The absolute or relative URL to load the audio files from, or a blob, or a base64 string of Uri.
config.instances : Number of audio instances for HTML5Audio. Defaults to 1.
Get data from cache
var cache = scene.cache.audio;
var data = cache.get(key);
Audio sprite¶
scene.load.audioSprite(key, jsonURL, audioURL, audioConfig);
// scene.load.audioSprite(key, jsonURL, audioURL, audioConfig, audioXhrSettings, jsonXhrSettings);
jsonURL : The absolute or relative URL to load the json file from.
audioURL : The absolute or relative URL to load the audio file from.
audioConfig : An object containing an instances property for HTML5Audio. Defaults to 1.
Video¶
scene.load.video(key, url, noAudio);
// scene.load.video(key, url, noAudio, xhrSettings);
url : The absolute or relative URL to load the video files from, or a blob.
loadEvent : The load event to listen for when not loading as a blob.
'loadeddata' : Data for the current frame is available. Default value.
'canplay' : The video is ready to start playing.
'canplaythrough' : The video can be played all the way through, without stopping.
asBlob : Load the video as a data blob, or via the Video element? Default value is false.
noAudio : Does the video have an audio track? If not you can enable auto-playing on it.
false : Has audio track, default behavior.
Get data from video cache
var cache = scene.video;
var data = cache.get(key);
Font¶
scene.load.font(key, fontURL);
// scene.load.font(key, fontURL, format, descriptors, xhrSettings);
format : truetype (default value) or opentype
descriptors : See FontFace/descriptors
Bitmap font¶
scene.load.bitmapFont(key, textureURL, fontDataURL);
// scene.load.bitmapFont(key, textureURL, fontDataURL, textureXhrSettings, fontDataXhrSettings);
textureURL : The absolute or relative URL to load the font image file from.
fontDataURL : The absolute or relative URL to load the font xml data file from, which created by software such as
Angelcode Bitmap Font Generator
Littera
Glyph Designer
Get data from cache
var cache = scene.cache.bitmapFont;
var data = cache.get(key);
Tile map¶
JSON : Created using the Tiled Map Editor and selecting JSON as the export format
scene.load.tilemapTiledJSON(key, url);
// scene.load.tilemapTiledJSON(key, url, xhrSettings);
CSV : Created in a text editor, or a 3rd party app that exports as CSV.
scene.load.tilemapCSV(key, url);
// scene.load.tilemapCSV(key, url, xhrSettings);
Get data from cache
var cache = scene.cache.tilemap;
var data = cache.get(key);
Text¶
scene.load.text(key, url);
// scene.load.text(key, url, xhrSettings);
Get data from cache
var cache = scene.cache.text;
var data = cache.get(key);
JSON¶
scene.load.json(key, url);
// scene.load.json(key, url, dataKey, xhrSettings);
dataKey : When the JSON file loads only this property will be stored in the Cache.
Get data from cache
var cache = scene.cache.json;
var data = cache.get(key);
XML¶
scene.load.xml(key, url);
// scene.load.xml(key, url, xhrSettings);
Get data from cache
var cache = scene.cache.xml;
var data = cache.get(key);
HTML¶
scene.load.html(key, url);
// scene.load.html(key, url, xhrSettings);
Get data from cache
var cache = scene.cache.html;
var data = cache.get(key);
CSS¶
scene.load.css(key, url);
// scene.load.css(key, url, xhrSettings);
Get data from cache
var cache = scene.cache.css;
var data = cache.get(key);
Scene¶
scene.load.sceneFile(key, url);
// scene.load.sceneFile(key, url, xhrSettings);
The key matches the class name in the JavaScript file.
Script¶
scene.load.script(key, url);
// scene.load.script(key, url, type, xhrSettings);
type :　'script', or 'module'.
Scripts¶
scene.load.scripts(key, urlArray);
// scene.load.scripts(key, urlArray, xhrSettings);
Add scripts in the exact order of urlArray.
GLSL¶
scene.load.glsl(key, url);
// scene.load.glsl(key, url, shaderType, xhrSettings);
shaderType : The type of shader.
'fragment' : Fragment shader. Default value.
'vertex' : Vertex shader.
Get data from cache
var cache = scene.cache.shader;
var data = cache.get(key);
A glsl file can contain multiple shaders, all separated by a frontmatter block.
---
name:
type:
---
void main(void)
{
}
Binary¶
scene.load.binary(key, url, dataType);  // dataType: Uint8Array
// scene.load.binary(key, url, dataType, xhrSettings);
dataType : Optional type to cast the binary file to once loaded.
Uint8Array, Uint8ClampedArray, Uint16Array Uint32Array
Int8Array, Int16Array, Int32Array
Float32Array, Float64Array
BigInt64Array, BigUint64Array
Get data from cache
var cache = scene.cache.binary;
var data = cache.get(key);
Plugin¶
scene.load.plugin(key, url, true); // start plugin when loaded
// scene.load.plugin(key, url, true, undefined, xhrSettings);
url : File url or class instance.
Scene plugin¶
scene.load.scenePlugin(key, url, systemKey, sceneKey);
// scene.load.scenePlugin(key, url, systemKey, sceneKey, xhrSettings);
url : File url or class instance.
File pack¶
Load files in JSON format.
scene.load.pack(key, url);
// scene.load.pack(key, url, dataKey, xhrSettings);
or
scene.load.pack(key, json);
// scene.load.pack(key, json, dataKey);
dataKey : When the JSON file loads only this property will be stored in the Cache.
JSON pack file:
{
'dataKey': {
// "prefix": "...",          // optional, extend key by prefix
// "path": "...",            // optional, extend url by path
// "defaultType": "image",   // optional, default file type
'files': [
{
'type': 'image',
'key': '...',
'url': '...'
},
{
'type': 'image',
'key': '...',
'url': '...'
}
// ...
]
},
'node0': {
'node1': {
'node2': {
'files': [
// ....
]
}
}
}
// dataKey: 'node0.node1.node2'
}
File type:
audio
binary
glsl
html
htmlTexture
image
json
script
spritesheet
svg
text
tilemapCSV
tilemapJSON
xml
Get pack json data from cache
var cache = scene.cache.json;  // pack json is stored in json cache
var data = cache.get(key);
Event name in 'filecomplete' event : 'filecomplete-packfile-' + key
Remove pack assets¶
scene.load.removePack(key);
// scene.load.removePack(key, dataKey);
Replace¶
Remove key.
Load file again.
Cache¶
Get data¶
var cache = scene.cache.text;
var data = cache.get(key);
Add data¶
var cache = scene.cache.text;
var data = cache.add(key);
Release data¶
var cache = scene.cache.text;
cache.remove(key);
Data in cache¶
var cache = scene.cache.text;
var hasData = cache.exists(key);
// var hasData = cache.has(key);
Cache events¶
Add any item
cache.events.on('add', function(cache, key, item){
})
Remove any item
cache.events.on('remove', function(cache, key, item){
})
XHR Settings Object¶
Parameter xhrSettings
{
async: true,
user: '',
password: '',
timeout: 0,
headers: undefined,
header: undefined,
headerValue: undefined,
requestedWith: undefined,
overrideMimeType: undefined,
withCredentials: false
}
user : Optional username for the XHR request.
password : Optional password for the XHR request.
timeout : Optional XHR timeout value.
headers, header, headerValue, requestedWith : This value is used to populate the XHR setRequestHeader
overrideMimeType : Provide a custom mime-type to use instead of the default.
withCredentials : Whether or not cross-site Access-Control requests should be made using credentials such as cookies, authorization headers or TLS client certificates. Setting withCredentials has no effect on same-site requests.