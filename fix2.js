const fs = require('fs');

function replace(f, regex, replacement) {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(regex, replacement);
  fs.writeFileSync(f, content);
}

replace('apps/demo/swarm-survivors/gameLogic.ts', /const capacity = this\.arena\.capacity;/g, 'const activeCount = this.arena.activeCount;');
replace('apps/demo/swarm-survivors/gameLogic.ts', /for \(let i = 0; i < capacity; i\+\+\) \{/g, 'for (let i = 0; i < activeCount; i++) {');
replace('apps/demo/swarm-survivors/gameLogic.ts', /if \(\!this\.arena\.active\[i\]\) continue;/g, '');
replace('apps/demo/swarm-survivors/gameLogic.ts', /if \(this\.arena\.active\[i\] === 0\) continue;/g, '');

replace('packages/core/src/anim/AnimationManager.ts', /for \(let i = 0; i < arena\.capacity; i\+\+\) \{/g, 'for (let i = 0; i < arena.activeCount; i++) {');
replace('packages/core/src/anim/AnimationManager.ts', /if \(\!arena\.active\[i\]\) continue;/g, '');

replace('packages/core/src/physics/ArcadePhysics.ts', /for \(let i = 0; i < arena\.capacity; i\+\+\) \{/g, 'for (let i = 0; i < arena.activeCount; i++) {');
replace('packages/core/src/physics/ArcadePhysics.ts', /for \(let j = i \+ 1; j < arena\.capacity; j\+\+\) \{/g, 'for (let j = i + 1; j < arena.activeCount; j++) {');
replace('packages/core/src/physics/ArcadePhysics.ts', /if \(arena\.active\[i\] === 0\) continue;/g, '');
replace('packages/core/src/physics/ArcadePhysics.ts', /if \(arena\.active\[j\] === 0\) continue;/g, '');

replace('packages/core/src/tween/TweenManager.ts', /if \(\!this\.arena\.active\[targetId\]\)/g, 'if (this.arena.idToIndex[targetId] === -1)');

