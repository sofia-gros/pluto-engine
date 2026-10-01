Effect properties
Introduction¶
Attach properties to a game object or camera, to add/remove/control builtin preFX or postFX effects.
Author: Rex
Method only
Pre-fx, and Post-fx shader effects
WebGL only
Only work in WebGL render mode.
Live demos¶
Color effects
Reveal
Interactive
Camera
Usage¶
Sample code
Install plugin¶
Load minify file¶
Load plugin (minify file) in preload stage
scene.load.plugin('rexeffectpropertiesplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexeffectpropertiesplugin.min.js', true);
Attach properties to a game object/camera.
scene.plugins.get('rexeffectpropertiesplugin').add(gameObject);
scene.plugins.get('rexeffectpropertiesplugin').add(camera);
Import plugin¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Install plugin in configuration of game
import EffectPropertiesPlugin from 'phaser4-rex-plugins/plugins/effectproperties-plugin.js';
var config = {
// ...
plugins: {
global: [{
key: 'rexEffectProperties',
plugin: EffectPropertiesPlugin,
start: true
},
// ...
]
}
// ...
};
var game = new Phaser.Game(config);
Attach properties to a game object/camera.
scene.plugins.get('rexEffectProperties').add(gameObject);
scene.plugins.get('rexEffectProperties').add(camera);
Import method¶
Install rex plugins from npm
npm i phaser4-rex-plugins
Import method
import AddEffectPropertiesProperties from 'phaser4-rex-plugins/plugins/effectproperties.js';
Attach properties to a game object/camera.
AddEffectPropertiesProperties(gameObject);
AddEffectPropertiesProperties(camera);
Attach properties¶
Supported effects are barrel, blackWhite, blocky, bloom, blur, bokeh, brightness, brown,
circle, contrast,  desaturate, desaturateLuminance, displacement,
glow, gradient, grayscale, hue, kodachrome, lsd, negative, pixelate, polaroid,
reveal, saturate, sepia, shadow, shiftToBGR, shine, technicolor, tiltShift,
vignette, vintagePinhole, wipe.
Attatch properties of all effects to a game object/camera.
scene.plugins.get('rexEffectProperties').add(gameObject);
scene.plugins.get('rexEffectProperties').add(camera);
Attatch properties of some preFX/postFX effects to a game object/camera.
scene.plugins.get('rexEffectProperties').add(gameObject, {
barrel: true,
blackWhite: true,
blocky: true,
bloom: true,
blur: true,
bokeh: true,
brightness: true,
brown: true,
circle: true,
contrast: true,
desaturate: true,
desaturateLuminance: true,
displacement: true,
glow: true,
gradient: true,
grayscale: true,
hue: true,
kodachrome: true,
lsd: true,
negative: true,
pixelate: true,
polaroid: true,
reveal: true,
saturate: true,
sepia: true,
shadow: true,
shiftToBGR: true,
shine: true,
technicolor: true,
tiltShift: true,
vignette: true,
vintagePinhole: true,
wipe: true,
});
or
scene.plugins.get('rexEffectProperties').add(gameObject, [
'barrel', 'blackWhite', 'blocky', 'bloom', 'blur', 'bokeh', 'brightness', 'brown',
'circle', 'contrast',
'desaturate', 'desaturateLuminance', 'displacement',
'glow', 'gradient', 'grayscale',
'hue',
'kodachrome',
'lsd',
'negative',
'pixelate', 'polaroid',
'reveal',
'saturate', 'sepia', 'shadow', 'shiftToBGR', 'shine',
'technicolor', 'tiltShift',
'vignette', 'vintagePinhole',
'wipe'
]);
or
scene.plugins.get('rexEffectProperties').add(gameObject, effectName);
A plain object with effect names.
A list of effect name string.
A effect name string.
Effect properties¶
Will try to create preFX effect if gameObject has preFX, otherwise, try to create postFX effect.
Barrel¶
barrel :
A number : Enable this effect and set intensity of barrel (1: origin).
null : Remove this effect
BlackWhite¶
blackWhite :
true, or 1 : Enable this effect.
null : Remove this effect
Blocky¶
blockySize
A number : Enable this effect and set size of blocky
null : Remove this effect
blockOffsetX, blockOffsetY
A number
Bloom¶
bloomColor :
A number : Enable this effect and set color of bloom (0xffffff).
null : Remove this effect
bloomOffsetX, bloomOffsetY, bloomBlurStrength, bloomStrength, bloomSteps :
A number
Blur¶
blurColor :
A number : Enable this effect and set color of blur (0xffffff).
null : Remove this effect
blurQuality, blurX, blurY, blurStrength, blurSteps :
A number
Bokeh¶
bokehRadius :
A number : Enable this effect and set radius of bokeh (0~1).
null : Remove this effect
bokehAmount, bokehContrast :
A number
Brightness¶
brightness :
A number : Enable this effect and set brightness (0~1).
null : Remove this effect
Brown¶
brown :
true, or 1 : Enable this effect.
null : Remove this effect
Circle¶
circleColor :
A number : Enable this effect and set color of circle (0xffffff).
null : Remove this effect
circleThickness, circleBackgroundColor, circleBackgroundAlpha, circleScale, circleFeather :
A number
Contrast¶
contrast :
A number : Enable this effect and set contrast (0~1).
null : Remove this effect
Desaturate¶
desaturate :
A number : Enable this effect and set desaturate (0~1).
null : Remove this effect
DesaturateLuminance¶
desaturateLuminance :
true, or 1 : Enable this effect.
null : Remove this effect
Displacement¶
displacementKey :
A string : Enable this effect and set displacement reference texture.
null : Remove this effect
displacementX, displacementY :
A number
Glow¶
glowColor :
A number : Enable this effect and set color of glow (0xffffff).
null : Remove this effect
glowOuterStrength, glowInnerStrength :
A number
Gradient¶
gradientColor :
[number, number] : Enable this effect and set gradient color1 and gradient color2 (0xffffff).
null : Remove this effect
gradientAlpha, gradientFromX, gradientFromY, gradientToX, gradientToY, gradientSize :
A number
Grayscale¶
grayscale :
A number : Enable this effect and set intensity of grayscale (0~1).
null : Remove this effect
Hue¶
hue :
A number : Enable this effect and set hue rotation, in degrees.
null : Remove this effect
Kodachrome¶
kodachrome :
true, or 1 : Enable this effect.
null : Remove this effect
Lsd¶
lsd :
true, or 1 : Enable this effect.
null : Remove this effect
Negative¶
negative :
true, or 1 : Enable this effect.
null : Remove this effect
Pixelate¶
pixelate :
A number : Enable this effect and set size of pixelate, in pixels.
null : Remove this effect
Polaroid¶
polaroid :
true, or 1 : Enable this effect.
null : Remove this effect
Reveal¶
revealLeft, revealRight, revealUp, or revealDown :
A number : Enable this effect with specific reveal direction and set progress (0~1).
null : Remove this effect
revealWidth :
A number
Saturate¶
saturate :
A number : Enable this effect and set saturate (0~1).
null : Remove this effect
Sepia¶
sepia :
true, or 1 : Enable this effect.
null : Remove this effect
Shadow¶
shadowColor :
A number : Enable this effect and set color of shadow (0xffffff).
null : Remove this effect
shadowX, shadowY, shadowDecay, shadowPower, shadowSamples, shadowIntensity :
A number
ShiftToBGR¶
shiftToBGR :
true, or 1 : Enable this effect.
null : Remove this effect
Shine¶
shineSpeed :
A number : Enable this effect and set speed of shine, in seconds.
null : Remove this effect
shineLineWidth, shineGradient :
A number
Technicolor¶
technicolor :
true, or 1 : Enable this effect.
null : Remove this effect
TiltShift¶
tiltShiftRadius :
A number : Enable this effect and set radius of tiltShift (0~1).
null : Remove this effect
tiltShiftAmount, tiltShiftContrast, tiltShiftBlurX, tiltShiftBlurY, tiltShiftStrength :
A number
Vignette¶
vignetteRadius :
A number : Enable this effect and set radius of vignette (0~1).
null : Remove this effect
vignetteX, vignetteY, vignetteStrength :
A number
VintagePinhole¶
vintagePinhole :
true, or 1 : Enable this effect.
null : Remove this effect
Wipe¶
wipeLeft, wipeRight, wipeUp, or wipeDown :
A number : Enable this effect with specific wipe direction and set progress (0~1).
null : Remove this effect
wipeWidth :
A number
Clear all effects¶
gameObject.clearAllEffects();