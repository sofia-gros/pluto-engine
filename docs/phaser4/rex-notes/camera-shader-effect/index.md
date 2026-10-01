Shader effect
Introduction¶
Shader effect of camera.
Author: Phaser Team
Usage¶
Register post-fx pipeline¶
Register post-fx pipeline in game config
import PostFxClass from 'path';
var config = {
// ...
pipeline: [PostFxClass]
// ...
};
var game = new Phaser.Game(config);
Some post-fx pipelines:
Barrel: Barrel post processing filter.
Color replace: Replace color post processing filter.
Cross-stitching: Cross-stitching post processing filter.
CRT: CRT post processing filter.
Dissolve: Dissolve transition post processing filter.
Fish eye: Fish-eye post processing filter.
Hsl-adjust: Adjust color in HSL domain, post processing filter.
Horri-fi: 6-in-1 post processing filter.
Toonify: Draw outlines and quantize color in HSV domain, post processing filter.
Shockwave: Shockwave post processing filter.
Split: Split image into 4 parts.
Swirl: Swirl post processing filter.
Warp: Warp post processing filter.
Add post-fx pipeline¶
camera.setPostPipeline(PostFxClass);
PostFxClass : Class of post-fx pipeline.
Remove post-fx pipeline¶
Remove a kind of post-fx pipeline
camera.removePostPipeline(PostFxClass);
Remove all post-fx pipelines
camera.resetPipeline(true);
or
camera.postPipelines = [];
camera.hasPostPipeline = false;
Get post-fx pipeline¶
var pipelineInstance = camera.getPostPipeline(PostFxClass);
pipelineInstance :
A pipeline instance
An array of pipeline instances
Add effect properties¶
See Add effect properties behavior