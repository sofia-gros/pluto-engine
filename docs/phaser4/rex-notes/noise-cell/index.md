Cell noise
Introduction¶
A quad which displays cellular noise, built-in game object of phaser.
Author: Phaser Team
Game object
Cellular noise is also called Worley noise or Voronoi noise.
WebGL only
Only work in WebGL render mode.
Usage¶
Add cell noise object¶
2D cell noise
var noise = scene.add.noisecell2d({
// noiseCells: [32, 32],
// noiseWrap: [32, 32],
// noiseOffset: [0, 0],
// noiseVariation: [1, 1],
// noiseIterations: 1,
// noiseMode: 0,
// noiseSmoothing: 1,
// noiseNormalMap: false,
// noiseNormalScale: 1,
// noiseColorStart: 0x000000,
// noiseColorEnd: 0xffffff,
// noiseSeed: [1, 2, 3, 4, 5, 6, 7, 8]
}, x, y, width, height);
3D cell noise
var noise = scene.add.noisecell3d({
// noiseCells: [32, 32, 32],
// noiseWrap: [32, 32, 32],
// noiseOffset: [0, 0, 0],
// noiseVariation: [1, 1, 1],
// noiseIterations: 1,
// noiseMode: 0,
// noiseSmoothing: 1,
// noiseNormalMap: false,
// noiseNormalScale: 1,
// noiseColorStart: 0x000000,
// noiseColorEnd: 0xffffff,
// noiseSeed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
}, x, y, width, height);
4D cell noise
var noise = scene.add.noisecell4d({
// noiseCells: [32, 32, 32, 32],
// noiseWrap: [32, 32, 32, 32],
// noiseOffset: [0, 0, 0, 0],
// noiseVariation: [1, 1, 1, 1],
// noiseIterations: 1,
// noiseMode: 0,
// noiseSmoothing: 1,
// noiseNormalMap: false,
// noiseNormalScale: 1,
// noiseColorStart: 0x000000,
// noiseColorEnd: 0xffffff,
// noiseSeed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
}, x, y, width, height);
config : Configuration of cell noise texture.
noiseCells : Number of cells in each dimension.
2D : [x, y]. Default value is [32, 32].
3D : [x, y, z]. Default value is [32, 32, 32].
4D : [x, y, z, w]. Default value is [32, 32, 32, 32].
noiseWrap : Number of cells before the pattern repeats.
By default, this is the same as noiseCells.
noiseCells should be integers for wrapping to work properly.
Use wrapNoise() to set this value from noiseCells.
noiseOffset : Offset of the noise field.
2D : [x, y].
3D : [x, y, z]. Changing z shifts through the volume slice.
4D : [x, y, z, w]. Changing z/w shifts through the hypervolume slice.
noiseVariation : How far cell centers can move away from a perfect grid.
noiseIterations : Number of octaves of noise. It is floored and clamped to at least 1.
noiseMode : Output mode.
0 : Sharp cell boundaries.
1 : Flat random color per cell.
2 : Smooth cell boundaries.
noiseSmoothing : Smoothness used by mode 2. Default value is 1.
noiseNormalMap : Set true to output a normal map instead of a color ramp.
noiseNormalScale : Curvature strength of normal map output.
noiseColorStart, noiseColorEnd : Color mapped to the middle/edge of the cells. Default value is 0x000000/0xffffff.
Number, 24-bit RGB (0xRRGGBB) or 32-bit ARGB (0xAARRGGBB).
String hex color, like '#0033ff', '#03f', '0x0033ff', or '0033ff'.
Array in WebGL color format, [red, green, blue] or [red, green, blue, alpha], in the range 0 to 1.
Phaser.Display.Color object.
noiseSeed : Seed values for reproducible cell patterns.
2D : 8 numbers. Default value is [1, 2, 3, 4, 5, 6, 7, 8].
3D : 12 numbers. Default value is [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].
4D : 16 numbers. Default value is [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].
x, y : Position.
width, height : Size. Default value is 128.
Add cell noise object with default configuration
var noise = scene.add.noisecell2d(undefined, x, y, width, height);
var noise = scene.add.noisecell3d(undefined, x, y, width, height);
var noise = scene.add.noisecell4d(undefined, x, y, width, height);
Add cell noise object from JSON
var noise = scene.make.noisecell2d({
x: 0,
y: 0,
width: 128,
height: 128,
config: {
// noiseCells: [32, 32],
// noiseWrap: [32, 32],
// noiseOffset: [0, 0],
// noiseVariation: [1, 1],
// noiseIterations: 1,
// noiseMode: 0,
// noiseSmoothing: 1,
// noiseNormalMap: false,
// noiseNormalScale: 1,
// noiseColorStart: 0x000000,
// noiseColorEnd: 0xffffff,
// noiseSeed: [1, 2, 3, 4, 5, 6, 7, 8]
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
For 3D/4D cell noise, use scene.make.noisecell3d() or scene.make.noisecell4d() and replace arrays with the matching dimension.
Custom class¶
Define class
class MyNoiseCell2D extends Phaser.GameObjects.NoiseCell2D {
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
var noise = new MyNoiseCell2D(scene, config, x, y, width, height);
Use Phaser.GameObjects.NoiseCell3D or Phaser.GameObjects.NoiseCell4D to extend the 3D/4D versions.
Set noise color¶
noise.setNoiseColor(start, end);
start, end : Color mapped to the middle/edge of the cells. Default value is 0x000000/0xffffff.
Number, 24-bit RGB (0xRRGGBB) or 32-bit ARGB (0xAARRGGBB).
String hex color, like '#0033ff', '#03f', '0x0033ff', or '0033ff'.
Array in WebGL color format, [red, green, blue] or [red, green, blue, alpha], in the range 0 to 1.
Phaser.Display.Color object.
Cells¶
Get
var cells = noise.noiseCells;
Set
noise.noiseCells = [cellsX, cellsY];
// noise.noiseCells = [cellsX, cellsY, cellsZ]; // 3D
// noise.noiseCells = [cellsX, cellsY, cellsZ, cellsW]; // 4D
Try to keep the cell count between 2 and about one eighth of the texture resolution.
A cell count of 1 has no room to vary, and a cell count greater than the texture resolution is close to expensive white noise.
Wrap¶
Get
var wrap = noise.noiseWrap;
Set
noise.noiseWrap = [wrapX, wrapY];
// noise.noiseWrap = [wrapX, wrapY, wrapZ]; // 3D
// noise.noiseWrap = [wrapX, wrapY, wrapZ, wrapW]; // 4D
Wrap seamlessly
noise.wrapNoise();
wrapNoise() copies noiseCells into noiseWrap.
A lower noiseWrap value causes the pattern to repeat sooner.
A higher noiseWrap value breaks visible wrapping.
Keep this value as low as possible to reduce floating-point precision issues.
Offset¶
Get
var offset = noise.noiseOffset;
var offsetX = noise.noiseOffset[0];
var offsetY = noise.noiseOffset[1];
Set
noise.noiseOffset = [offsetX, offsetY];
// noise.noiseOffset = [offsetX, offsetY, offsetZ]; // 3D
// noise.noiseOffset = [offsetX, offsetY, offsetZ, offsetW]; // 4D
Animating x and y scrolls the noise pattern. In 3D/4D cell noise, animating higher dimensions changes the rendered XY slice.
3D pattern evolution
noise.noiseOffset[2] = scene.time.now / 1000;
4D repeating pattern evolution
noise.noiseOffset[2] = Math.sin(scene.time.now / 1000) / 32;
noise.noiseOffset[3] = Math.cos(scene.time.now / 1000) / 32;
Note
Very large offsets can introduce floating-point precision issues and make the noise appear blocky.
Variation¶
Get
var variation = noise.noiseVariation;
Set
noise.noiseVariation = [variationX, variationY];
// noise.noiseVariation = [variationX, variationY, variationZ]; // 3D
// noise.noiseVariation = [variationX, variationY, variationZ, variationW]; // 4D
noiseVariation controls how far each cell can vary from its grid position.
0 : Cells stay on a perfect grid.
1 : Cells are fully chaotic.
Do not set variation above 1; the nearest cell can move outside the sampling range and create seams.
Iterations¶
Get
var iterations = noise.noiseIterations;
Set
noise.noiseIterations = iterations;
Iterations add fine detail. Each octave doubles the resolution and contributes half as much to the output. Values above about 5 usually have less visible effect but still cost more.
Mode¶
Get
var mode = noise.noiseMode;
Set
noise.noiseMode = mode;
Modes:
0 : Sharp boundaries between cells.
1 : Index mode. Cells have a single flat random color, which may not be unique.
2 : Smooth boundaries between cells. Use noiseSmoothing to control smoothness.
Smoothing¶
Get
var smoothing = noise.noiseSmoothing;
Set
noise.noiseSmoothing = smoothing;
noiseSmoothing is used when noiseMode is 2.
1 : Moderate smoothing.
Between 0 and 1 : Less smoothing.
Greater than 1 : More smoothing. The visible increase slows above about 4.
Normal map¶
Enable
noise.noiseNormalMap = true;
Disable
noise.noiseNormalMap = false;
Curvature strength
noise.noiseNormalScale = scale;
When noiseNormalMap is enabled, output color is a normal map and noiseColorStart/noiseColorEnd are not used for the final output. Normal maps work best with mode 0 or 2, which form curves.
Seed¶
Get
var seed = noise.noiseSeed;
Set
noise.noiseSeed = [1, 2, 3, 4, 5, 6, 7, 8]; // 2D
// noise.noiseSeed = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // 3D
// noise.noiseSeed = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]; // 4D
Randomize
noise.randomizeNoiseSeed();
Changing the seed creates a different pattern.
Note
Seed values should be fairly small. Numbers between 0 and 1, or between 0 and the seed length, are recommended. Very large seed values can lose floating-point precision and make the noise appear blocky.
Keep awake¶
noise.keepAwake = true;
keepAwake is an advanced setting enabled by default. It jitters shader inputs by an imperceptible amount to avoid precision-mode flickering on some Chromium browsers.
Render to texture¶
Cell noise extends shader game object, therefore it can render its output to a texture.
noise.setRenderToTexture(key);
Then use this texture in another game object.
var image = scene.add.image(x, y, key);
Other properties¶
See game object and shader game object.
Create mask¶
See mask
Shader effects¶
Support internal and external filters