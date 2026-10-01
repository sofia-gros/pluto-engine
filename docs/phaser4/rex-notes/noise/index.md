Noise
Introduction¶
A quad which displays random white noise, built-in game object of phaser.
Author: Phaser Team
Game object
WebGL only
Only work in WebGL render mode.
Usage¶
Add noise object¶
var noise = scene.add.noise({
// noiseOffset: [0, 0],
// noisePower: 1,
// noiseColorStart: 0x000000,
// noiseColorEnd: 0xffffff,
// noiseRandomChannels: false,
// noiseRandomNormal: false
}, x, y, width, height);
config : Configuration of noise texture.
noiseOffset : Offset of the noise pattern, in [x, y].
noisePower : Power applied to each noise value.
noiseColorStart, noiseColorEnd : Color mapped to low/high noise values. Default value is 0x000000/0xffffff.
Number, 24-bit RGB (0xRRGGBB) or 32-bit ARGB (0xAARRGGBB).
String hex color, like '#0033ff', '#03f', '0x0033ff', or '0033ff'.
Array in WebGL color format, [red, green, blue] or [red, green, blue, alpha], in the range 0 to 1.
Phaser.Display.Color object.
noiseRandomChannels : Set true to render independent random noise in each color channel.
noiseRandomNormal : Set true to render a random normal vector per pixel. This overrides noiseRandomChannels.
x, y : Position.
width, height : Size. Default value is 128.
Add noise object with default configuration
var noise = scene.add.noise(undefined, x, y, width, height);
Add noise object from JSON
var noise = scene.make.noise({
x: 0,
y: 0,
width: 128,
height: 128,
config: {
// noiseOffset: [0, 0],
// noisePower: 1,
// noiseColorStart: 0x000000,
// noiseColorEnd: 0xffffff,
// noiseRandomChannels: false,
// noiseRandomNormal: false
},
// angle: 0,
// alpha: 1
// flipX: true,
// flipY: true,
// scale : {
//    x: 1,
//    y: 1
//},
// origin: {x: 0.5, y: 0.5},
add: true
});
Custom class¶
Define class
class MyNoise extends Phaser.GameObjects.Noise {
constructor(scene, config, x, y, width, height) {
super(scene, config, x, y, width, height);
// ...
scene.add.existing(this);
}
// ...
}
scene.add.existing(gameObject) : Adds an existing Game Object to this Scene.
If the Game Object renders, it will be added to the Display List.
If it has a preUpdate method, it will be added to the Update List.
Create instance
var noise = new MyNoise(scene, config, x, y, width, height);
Set noise color¶
noise.setNoiseColor(start, end);
start, end : Color mapped to low/height noise values. Default value is 0x000000/0xffffff.
Number, 24-bit RGB (0xRRGGBB) or 32-bit ARGB (0xAARRGGBB).
String hex color, like '#0033ff', '#03f', '0x0033ff', or '0033ff'.
Array in WebGL color format, [red, green, blue] or [red, green, blue, alpha], in the range 0 to 1.
Phaser.Display.Color object.
Noise offset¶
Get
var offset = noise.noiseOffset;
var offsetX = noise.noiseOffset[0];
var offsetY = noise.noiseOffset[1];
Set
noise.noiseOffset = [offsetX, offsetY];
noiseOffset must be an array of 2 numbers. Animating it scrolls the noise pattern.
Note
This shader depends on floating-point precision. Very large offsets can make the output blocky, while very small offset changes can make the pattern change abruptly.
Noise power¶
Get
var power = noise.noisePower;
Set
noise.noisePower = power;
noisePower reshapes the noise levels.
1 : Original random value.
Greater than 1 : Fewer bright/white pixels; the result becomes darker.
Between 0 and 1 : More bright/white pixels; the result becomes brighter.
Random channels¶
Get
var enabled = noise.noiseRandomChannels;
Enable
noise.noiseRandomChannels = true;
Disable
noise.noiseRandomChannels = false;
When enabled, red, green, and blue channels receive separate random values. The result is still multiplied by the configured start/end color ramp.
Random normal¶
Get
var enabled = noise.noiseRandomNormal;
Enable
noise.noiseRandomNormal = true;
Disable
noise.noiseRandomNormal = false;
When enabled, each pixel renders a random normal vector in the hemisphere facing the camera. This mode overrides noiseRandomChannels.
Render to texture¶
Noise extends shader game object, therefore it can render its output to a texture.
noise.setRenderToTexture(key);
Then use this texture in another game object.
var image = scene.add.image(x, y, key);
For scrolling noise, rendering to a texture and using it in a TileSprite is often more stable than scrolling by very small noiseOffset values.
Other properties¶
See game object and shader game object.
Create mask¶
See mask
Shader effects¶
Support internal and external filters