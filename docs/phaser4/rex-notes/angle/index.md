Angle
Introduction¶
Convert angle value, built-in methods of phaser.
Author: Phaser Team
Usage¶
Degree <-> Radians¶
Degree to radians
var rad = Phaser.Math.DegToRad(deg);
Radians to degree
var deg = Phaser.Math.RadToDeg(rad);  // deg : -180 ~ 180
Wrap¶
Wrap angle (radians) in the range of -PI to PI
var rad = Phaser.Math.Angle.Wrap(angle);
Wrap angle (radians) in the range of 0 to 2*PI
var rad = Phaser.Math.Angle.Normalize(angle);
Wrap angle (degrees) in the range of -180 to 180
var deg = Phaser.Math.Angle.WrapDegrees(angle);
Angle between points¶
Angle from (0,0) to vector (x2 - x1 , y2 - y1)
var rad = Phaser.Math.Angle.Between(x1, y1, x2, y2);
var rad = Phaser.Math.Angle.BetweenPoints(point1, point2);
Angle between angles¶
Shortest angle distance (degrees) between 2 angles
var deg = Phaser.Math.Angle.ShortestBetween(angle1, angle2);
angle1, angle2 : Angle in degrees in the range of -180 to 180
deg : Shortest angle in degrees
deg > 0 : Counter-ClockWise rotation
deg < 0 : ClockWise rotation
Shortest signed angular distance between 2 angles
var rad = Phaser.Math.Angle.GetShortestDistance(angle1, angle2);
angle1 : Start angle in radians
angle2 : Target angle in radians
rad : The distance in radians, in the range [-pi, pi)
Shortest nonnegative angular distance (radians) between two angles
var rad = Phaser.Math.Angle.GetClockwiseDistance(angle1, angle2);
angle1 : Start angle in radians
angle2 : Target angle in radians
rad : The distance in radians, in the range [0, 2pi)
Shortest nonpositive angular distance (radians) between two angles
var rad = Phaser.Math.Angle.GetCounterClockwiseDistance(angle1, angle2);
angle1 : Start angle in radians
angle2 : Target angle in radians
rad : The distance in radians, in the range (-2pi, 0]
Rotate around position¶
Rotate a point around x and y by the given angle.
var out = Phaser.Math.RotateAround(point, x, y, angle);
Rotate a point around x and y by the given angle and distance.
var out = Phaser.Math.RotateAroundDistance(point, x, y, angle, distance);
Rotate to angle¶
var rad = Phaser.Math.Angle.RotateTo(currentAngle, targetAngle, lerp)
currentAngle, : The current angle, in radians.
targetAngle : The target angle to rotate to, in radians.
lerp : The lerp value to add to the current angle.
Random angle¶
Returns a random angle in the range [-pi, pi].
var angle = Phaser.Math.Angle.Random();
Returns a random angle in the range [-180, 180].
var angle = Phaser.Math.Angle.RandomDegrees();