Random number
Introduction¶
Get random value, built-in methods of phaser.
Author: Phaser Team
Usage¶
Get random value between (min, max)¶
Random integer
var value = Phaser.Math.Between(min, max);
Random floating point number
var value = Phaser.Math.FloatBetween(min, max);
Get random vector¶
2D vector
var vec = Phaser.Math.RandomXY(vec);    // return vec {x, y}
// var vec = Phaser.Math.RandomXY(vec, scale);
3D vector
var vec = Phaser.Math.RandomXYZ(vec);    // return vec {x, y, z}
// var vec = Phaser.Math.RandomXYZ(vec, scale);
4D vector
var vec = Phaser.Math.RandomXYZW(vec);    // return vec {x, y, z, w}
// var vec = Phaser.Math.RandomXYZW(vec, scale);