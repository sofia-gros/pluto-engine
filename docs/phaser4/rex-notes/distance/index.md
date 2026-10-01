Distance
Introduction¶
Get distance, built-in methods of phaser.
Author: Phaser Team
Usage¶
Distance¶
Get distance between 2 points
var d = Phaser.Math.Distance.Between(x1, y1, x2, y2);
or
var d = Phaser.Math.Distance.BetweenPoints(a, b); // a, b: {x, y}
Get squared distance
var d = Phaser.Math.Distance.BetweenPointsSquared(a, b); // a, b: {x, y}
Get Chebyshev distance (the maximum of the horizontal and vertical distances)
var d = Phaser.Math.Distance.Chebyshev(x1, y1, x2, y2);
Get snake distance(i.e. rectilinear distance, Manhattan distance, the sum of the horizontal and vertical distance)
var d = Phaser.Math.Distance.Snake(x1, y1, x2, y2);
Get power distance (the sum of the horizontal power distance and vertical power distance)
var d = Phaser.Math.Distance.Power(x1, y1, x2, y2);
Speed¶
Get speed
var d = Phaser.Math.GetSpeed(distance, time);
distance : The distance to travel in pixels.
time : The time, in ms, to cover the distance in.