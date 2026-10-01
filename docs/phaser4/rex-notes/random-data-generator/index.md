Random data generator
Introduction¶
Get random value from a random generator, built-in methods of phaser.
Author: Phaser Team
Usage¶
Random data generator¶
Pre-defined random data generator
var rnd = Phaser.Math.RND;
New random generator
var rnd = new Phaser.Math.RandomDataGenerator(seed);
Set seed¶
Set seed in game config for pre-defined random data generator
var config = {
// ...
seed: seed,
// ...
}
var game = new Phaser.Game(config);
seed :
An array of string, like [(Date.now() * Math.random()).toString()]
Set seed
rnd.init(seed);
seed : A string or an array of string.
Get random value¶
Random real number between 0 and 1.
var value = rnd.frac();
Random integer between 0 and 2^32.
var value = rnd.integer();
Random real number between 0 and 2^32.
var value = rnd.real();
Random integer between and including min and max.
var value = rnd.between(min, max);
// var value = rnd.integerInRange(min, max);
Random real number between min and max.
var value = rnd.realInRange(min, max);
Random real number between -1 and 1.
var value = rnd.normal();
Random angle between -180 and 180.
var angle = rnd.angle();
Random rotation in radians, between -3.141 and 3.141.
var angle = rnd.rotation();
Random timestamp between min and max.
var timestamp = rnd.timestamp(min, max);
min : Default value is the beginning of 2000.
max : Default value is the end of 2020.
UUID
var uuid = rnd.uuid();
Random sign value
var sign = rnd.sign();
sign : -1 or 1
Get random item¶
Random element from within the given array.
var item = rnd.pick(arr);
Random element from within the given array, favoring the earlier entries.
var item = rnd.weightedPick(arr);
Shuffle array¶
var arr = rnd.shuffle(arr);