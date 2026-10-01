Simplex noise
Introduction¶
A quad which displays smooth simplex noise, built-in game object of phaser.
Author: Phaser Team
Game object
WebGL only
Only work in WebGL render mode.
Usage¶
Add simplex noise object¶
2D simplex noise
var noise = scene.add.noisesimplex2d({
// noiseCells: [32, 32],
// noisePeriod: [32, 32],
// noiseOffset: [0, 0],
// noiseFlow: 0,
// noiseWarpAmount: 0,
// noiseIterations: 1,
// noiseWarpIterations: 1,
// noiseNormalMap: false,
// noiseNormalScale: 1,
// noiseColorStart: 0x000000,
// noiseColorEnd: 0xffffff,
// noiseDetailPower: 2,
// noiseFlowPower: 2,
// noiseContributionPower: 2,
// noiseWarpDetailPower: 2,
// noiseWarpFlowPower: 2,
// noiseWarpContributionPower: 2,
// noiseValueFactor: 0.5,
// noiseValueAdd: 0.5,
// noiseValuePower: 1,
// noiseSeed: [1, 2]
}, x, y, width, height);
3D simplex noise
var noise = scene.add.noisesimplex3d({
// noiseCells: [32, 32, 32],
// noisePeriod: [32, 32, 32],
// noiseOffset: [0, 0, 0],
// noiseFlow: 0,
// noiseWarpAmount: 0,
// noiseIterations: 1,
// noiseWarpIterations: 1,
// noiseNormalMap: false,
// noiseNormalScale: 1,
// noiseColorStart: 0x000000,
// noiseColorEnd: 0xffffff,
// noiseDetailPower: 2,
// noiseFlowPower: 2,
// noiseContributionPower: 2,
// noiseWarpDetailPower: 2,
// noiseWarpFlowPower: 2,
// noiseWarpContributionPower: 2,
// noiseValueFactor: 0.5,
// noiseValueAdd: 0.5,
// noiseValuePower: 1,
// noiseSeed: [1, 2, 3]
}, x, y, width, height);
config : Configuration of noise texture.
noiseCells : Number of cells in each dimension.
2D : [x, y]. Default value is [32, 32].
3D : [x, y, z]. Default value is [32, 32, 32].
noisePeriod : Number of cells before the pattern repeats.
By default, this is the same as noiseCells.
Use wrapNoise() to set this value from noiseCells.
noiseOffset : Offset of the noise field.
2D : [x, y].
3D : [x, y, z]. Changing z shifts through the volume slice.
noiseFlow : Flow value used to evolve the pattern. The pattern returns to its original state after adding Math.PI * 2.
noiseWarpAmount : Turbulence amount. Set 0 to disable warp.
noiseIterations : Number of octaves of noise. It is floored and clamped to at least 1.
noiseWarpIterations : Number of octaves used by the warp calculation. It is floored and clamped to at least 1.
noiseNormalMap : Set true to output a normal map instead of a color ramp.
noiseNormalScale : Curvature strength of normal map output.
noiseColorStart, noiseColorEnd : Color mapped to adjusted noise value 0/1. Default value is 0x000000/0xffffff.
Number, 24-bit RGB (0xRRGGBB) or 32-bit ARGB (0xAARRGGBB).
String hex color, like '#0033ff', '#03f', '0x0033ff', or '0033ff'.
Array in WebGL color format, [red, green, blue] or [red, green, blue, alpha], in the range 0 to 1.
Phaser.Display.Color object.
noiseDetailPower : Frequency multiplier between noise octaves. Default value is 2.
noiseFlowPower : Flow multiplier between noise octaves. Default value is 2.
noiseContributionPower : Contribution divisor between noise octaves. Default value is 2.
noiseWarpDetailPower : Frequency multiplier between warp octaves. Default value is 2.
noiseWarpFlowPower : Flow multiplier between warp octaves. Default value is 2.
noiseWarpContributionPower : Contribution divisor between warp octaves. Default value is 2.
noiseValueFactor, noiseValueAdd, noiseValuePower : Adjust raw noise before color mapping.
value = Math.pow(
Phaser.Math.Clamp(rawNoise * noiseValueFactor + noiseValueAdd, 0, 1),
noiseValuePower
);
noiseSeed : Seed offset for reproducible patterns.
2D : [x, y]. Default value is [1, 2].
3D : [x, y, z]. Default value is [1, 2, 3]. Values are documented as integers.
x, y : Position.
width, height : Size. Default value is 128.
Add simplex noise object with default configuration
var noise = scene.add.noisesimplex2d(undefined, x, y, width, height);
var noise = scene.add.noisesimplex3d(undefined, x, y, width, height);
Add simplex noise object from JSON
var noise = scene.make.noisesimplex2d({
x: 0,
y: 0,
width: 128,
height: 128,
config: {
// noiseCells: [32, 32],
// noisePeriod: [32, 32],
// noiseOffset: [0, 0],
// noiseFlow: 0,
// noiseWarpAmount: 0,
// noiseIterations: 1,
// noiseWarpIterations: 1,
// noiseNormalMap: false,
// noiseNormalScale: 1,
// noiseColorStart: 0x000000,
// noiseColorEnd: 0xffffff,
// noiseDetailPower: 2,
// noiseFlowPower: 2,
// noiseContributionPower: 2,
// noiseWarpDetailPower: 2,
// noiseWarpFlowPower: 2,
// noiseWarpContributionPower: 2,
// noiseValueFactor: 0.5,
// noiseValueAdd: 0.5,
// noiseValuePower: 1,
// noiseSeed: [1, 2]
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
For 3D simplex noise, use scene.make.noisesimplex3d() and replace 2D arrays with 3D arrays, for example [32, 32, 32], [0, 0, 0], and [1, 2, 3].
Custom class¶
Define class
class MyNoiseSimplex2D extends Phaser.GameObjects.NoiseSimplex2D {
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
var noise = new MyNoiseSimplex2D(scene, config, x, y, width, height);
Use Phaser.GameObjects.NoiseSimplex3D to extend the 3D version.
Set noise color¶
noise.setNoiseColor(start, end);
start, end : Color mapped to adjusted noise value 0/1. Default value is 0x000000/0xffffff.
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
Try to keep the cell count between 2 and about one eighth of the texture resolution.
A cell count greater than the texture resolution is close to expensive white noise.
Period¶
Get
var period = noise.noisePeriod;
Set
noise.noisePeriod = [periodX, periodY];
// noise.noisePeriod = [periodX, periodY, periodZ]; // 3D
Wrap seamlessly
noise.wrapNoise();
wrapNoise() copies noiseCells into noisePeriod.
Offset¶
Get
var offset = noise.noiseOffset;
var offsetX = noise.noiseOffset[0];
var offsetY = noise.noiseOffset[1];
Set
noise.noiseOffset = [offsetX, offsetY];
// noise.noiseOffset = [offsetX, offsetY, offsetZ]; // 3D
Animating x and y scrolls the noise pattern. In 3D simplex noise, animating z changes the pattern by shifting through the volume slice.
Flow¶
Get
var flow = noise.noiseFlow;
Set
noise.noiseFlow = flow;
noiseFlow evolves the pattern in place. It is periodic and repeats after Math.PI * 2.
Warp¶
Get
var amount = noise.noiseWarpAmount;
Set
noise.noiseWarpAmount = amount;
Warp adds turbulence by using extra noise octaves to offset the sampled coordinates. It adds shader cost.
Iterations¶
Get
var iterations = noise.noiseIterations;
var warpIterations = noise.noiseWarpIterations;
Set
noise.noiseIterations = iterations;
noise.noiseWarpIterations = warpIterations;
Iterations add fine detail. Values above about 5 usually have less visible effect but still cost more.
Octave powers¶
Detail
noise.noiseDetailPower = detailPower;
noise.noiseWarpDetailPower = warpDetailPower;
Flow
noise.noiseFlowPower = flowPower;
noise.noiseWarpFlowPower = warpFlowPower;
Contribution
noise.noiseContributionPower = contributionPower;
noise.noiseWarpContributionPower = warpContributionPower;
Default value is 2.
Detail power controls how fast frequency increases between octaves.
Flow power controls how fast flow progression increases between octaves.
Contribution power controls how fast later octave contribution decays.
Output value¶
Get
var factor = noise.noiseValueFactor;
var add = noise.noiseValueAdd;
var power = noise.noiseValuePower;
Set
noise.noiseValueFactor = factor;
noise.noiseValueAdd = add;
noise.noiseValuePower = power;
Raw simplex noise is emitted around the range -1 to 1, then adjusted before color mapping.
value = Math.pow(
Phaser.Math.Clamp(rawNoise * noise.noiseValueFactor + noise.noiseValueAdd, 0, 1),
noise.noiseValuePower
);
With the default noiseValueFactor/noiseValueAdd, raw -1..1 is remapped to 0..1.
noiseValuePower = 1 : Original adjusted value.
noiseValuePower > 1 : Fewer bright/white areas; the result becomes darker.
0 < noiseValuePower < 1 : More bright/white areas; the result becomes brighter.
Normal map¶
Enable
noise.noiseNormalMap = true;
Disable
noise.noiseNormalMap = false;
Curvature strength
noise.noiseNormalScale = scale;
When noiseNormalMap is enabled, output color is a normal map and noiseColorStart/noiseColorEnd are not used for the final output.
Seed¶
Get
var seed = noise.noiseSeed;
Set
noise.noiseSeed = [seedX, seedY];
// noise.noiseSeed = [seedX, seedY, seedZ]; // 3D
Randomize
noise.randomizeNoiseSeed();
Changing the seed creates a different, reproducible pattern.
Note
NoiseSimplex3D documents its seed values as integers.
Render to texture¶
Simplex noise extends shader game object, therefore it can render its output to a texture.
noise.setRenderToTexture(key);
Then use this texture in another game object.
var image = scene.add.image(x, y, key);
Other properties¶
See game object and shader game object.
Create mask¶
See mask
Shader effects¶
Support internal and external filters