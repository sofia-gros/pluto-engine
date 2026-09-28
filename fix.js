const fs = require('fs');
const files = [
  'apps/demo/swarm-survivors/gameLogic.ts',
  'packages/core/src/anim/AnimationManager.ts',
  'packages/core/src/physics/ArcadePhysics.ts',
  'packages/core/src/tween/TweenManager.ts'
];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/\.active\[/g, '.idToIndex[');
  fs.writeFileSync(f, content);
});
