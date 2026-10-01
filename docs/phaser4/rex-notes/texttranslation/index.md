Translation
Introduction¶
Apply translated string (i18next) to text object, bbcode text object, tag text object, bitmap text object, or label game object
Author: Rex
Behavior of text object
Live demos¶
Inline resources
External resources
External yaml resource
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in scene's config
class Demo extends Phaser.Scene {
constructor() {
super({
key: 'Scnee',
pack: {
files: [{
type: 'plugin',
key: 'rextexttranslationplugin',
url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexttranslationplugin.min.js',
start: true,
mapping: 'translation'  // Add text-translation plugin to `scene.translation`
}]
},
// ...
});
}
// ...
}
Initialize i18next during preload stage
scene.plugins.get('rextexttranslationplugin').initI18Next(scene, {
lng: 'dev',
fallbackLng: 'dev',
ns: 'translation',
// resources: {
//     'dev': {
//         'translation': {
//             key: value,
//         }
//     }
// }
// debug: true,
// backend: {
//     loadPath: '',
//     parse: function(data) { return JSON.parse(data); }
// },
})
Add translation behavior
var translation = scene.plugins.get('rextexttranslationplugin').add(textGameObject, config);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import TextTranslationPlugin from 'phaser4-rex-plugins/plugins/texttranslation-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexTextTranslation',
plugin: TextTranslationPlugin,
start: true,
mapping: 'translation'  // Add text-translation plugin to `scene.translation`
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Initialize i18next during preload stage
scene.plugins.get('rexTextTranslation').initI18Next(scene, {
lng: 'dev',
fallbackLng: 'dev',
ns: 'translation',
// resources: {
//     'dev': {
//         'translation': {
//             key: value,
//         }
//     }
// }
// debug: true,
// backend: {
//     loadPath: '',
//     parse: function(data) { return JSON.parse(data); }
// },
})
Add translation behavior
var translation = scene.plugins.get('rexTextTranslation').add(textGameObject, config);
Import class¶
Install rex plugins, i18next, i18next-http-backend from npm
npm i phaser4-rex-plugins
npm i i18next
npm i i18next-http-backend
Import class
import TextTranslationBehavior from 'phaser4-rex-plugins/plugins/texttranslation.js';
import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import Awaitloader from 'phaser4-rex-plugins/plugins/awaitloader.js';
Initialize i18next during preload stage
Awaitloader.call(scene.load, function (successCallback, failureCallback) {
i18next
.use(Backend)
.init({
lng: 'dev',
fallbackLng: 'dev',
ns: 'translation',
// resources: {
//     'dev': {
//         'translation': {
//             key: value,
//         }
//     }
// }
// debug: true,
// backend: {
//     loadPath: '',
//     parse: function(data) { return JSON.parse(data); }
// },
}, successCallback);
})
TextTranslationBehavior.setI18Next(i18next);
Awaitloader : Using Awaitloader to load external resource.
Backend : i18next-http-backend module can be used to load external resource.
TextTranslationBehavior.setI18Next(i18next) : Pass i18next to TextTranslationBehavior.
TextTranslationBehavior.setI18Next is a static method.
Add translation behavior
var translation = new TextTranslationBehavior(textGameObject, config);
Initialize i18next¶
scene.plugins.get('rexTextTranslation').initI18Next(scene, {
lng: 'dev',
fallbackLng: 'dev',
ns: 'translation',
// resources: {
//     'dev': {
//         'translation': {
//             key: value,
//         }
//     }
// }
// debug: true,
// backend: {
//     loadPath: '',
//     parse: function(data) { return JSON.parse(data); }
// },
})
or
i18next
.use(Backend)
.init(config, onComplete);
lng : Language to use. Will fallback to 'dev'.
fallbackLng : Language to use if translations in user language are not available. Setting it explicitly to false will not trigger to load the fallbackLng at all.
ns : String or array of namespaces to load. Default value is 'translation'.
debug : Logs info level to console output. Helps finding issues with loading not working. Default value is false.
resources : Resources to initialize with.
backend.loadPath : Path where resources get loaded from, or a function returning a path.
function(lngs, namespaces) {
return customPath;
}
backend.parse : Parse data after it has been fetched. Optional.
function(data) {
return JSON.parse(data);
}
See also Configuration Options, and Backend Options
Create instance¶
var translation = scene.plugins.get('rexTextTranslation').add(textGameObject, {
// translationKey: '',
// interpolation: {},
// updateText: true,
// setText: function(gameObject, text) {
//     gameObject.setText(text);
// }
});
textObject : text object, bbcode text object, tag text object, bitmap text object, or label game object
translationKey : Key in translation resource. See Essentials
interpolation : Integrating dynamic values into translation result. See Interpolation
updateText :
true : Update text object via translationKey, and interpolation. Default behavior.
false : Don't update text object now.
setText : Callback invoked when updating text object. Default value is
function(gameObject, text) {
gameObject.setText(text);
}
Set translation key¶
translation
.setTranslationKey(key)
.updateText()
Set interpolation¶
Assign interpolation object
translation
.setInterpolation(object)
.updateText()
Update current interpolation object
translation
.updateInterpolation(key, value)
.updateText()
or
translation
.updateInterpolation(object)
.updateText()
Update text¶
Update text object via translationKey, and interpolation.
translation.updateText()
Change language¶
scene.plugins.get('rexTextTranslation').changeLanguage(language);
// scene.plugins.get('rexTextTranslation').changeLanguage(language, onComplete);
or
i18next.changeLanguage(language, onComplete);
All translation behavior will update text object after changing language.
Set default namespace¶
scene.plugins.get('rexTextTranslation').setDefaultNamespace(namespace);
or
i18next.setDefaultNamespace(namespace);
Translate string¶
var result = scene.plugins.get('rexTextTranslation').t(translationKey, interpolation);
or
var result = i18next.t(translationKey, interpolation);
Events¶
On language changed, triggered by changeLanguage method.
scene.plugins.get('rexTextTranslation').on('languageChanged', function (lng) {
});
or
i18next.on('languageChanged', function (lng) {
});