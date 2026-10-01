Point
Introduction¶
Warning
The Geom.Point class and all related functions will be removed. All functionality for this can be found in the existing Vector2 math classes. All Geometry classes that currently create and return Point objects will be updated to return Vector2 objects instead.
Point shape and methods, built-in methods of phaser.
Author: Phaser Team
Usage¶
Create shape¶
var point = new Phaser.Geom.Point(x, y);
Clone shape¶
var point1 = Phaser.Geom.Point.Clone(point0);
Draw on graphics¶
// graphics.fillStyle(color, alpha);   // color: 0xRRGGBB
graphics.fillPointShape(point, size);
Set properties¶
All properties
point.setTo(x, y);
or
Phaser.Geom.Point.CopyFrom(source, dest);
Position
point.x = 0;
point.y = 0;
Round
Ceil : Apply Math.ceil() to each coordinate of the given Point
var point = Phaser.Geom.Point.Ceil(point)
Floor : Apply Math.floor() to each coordinate of the given Point.
var point = Phaser.Geom.Point.Floor(point)
Symmetry¶
Invert : x = y, y = x
var point = Phaser.Geom.Point.Invert(point);
Negative : x = -x, y = -y
var out = Phaser.Geom.Point.Negative(point);
// var out = Phaser.Geom.Point.Negative(point, out);  // modify out
Get properties¶
Position
var x = point.x;
var y = point.y;
Type:
var type = point.type; // 3
Equal¶
var isEqual = Phaser.Geom.Point.Equals(point0, point1);
x, y are equal.
Points¶
Centroid : center-point over some points
var out = Phaser.Geom.Point.GetCentroid(points);
// var out = Phaser.Geom.Point.GetCentroid(points, out);  // modify out
Calculates the Axis Aligned Bounding Box (or aabb) from an array of points (rectangle)
var rect = Phaser.Geom.Point.GetRectangleFromPoints(points);
// var rect = Phaser.Geom.Point.GetRectangleFromPoints(points, rect);  // modify rect
Interpolate
var out = Phaser.Geom.Point.Interpolate(pointA, pointB, t);  // out : point
// var out = Phaser.Geom.Point.Interpolate(pointA, pointB, t, out);  // modify out
Intersection¶
Point to line
var result = Phaser.Geom.Intersects.PointToLine(point, line);
// var result = Phaser.Geom.Intersects.PointToLine(point, line, lineThickness);
var result = Phaser.Geom.Intersects.PointToLineSegment(point, line);
Point as Vector¶
Vector starting at (0,0)
Magnitude : sqrt( (x * x) + (y * y) )
var magnitude = Phaser.Geom.Point.GetMagnitude(point);
or
var magnitudeSq = Phaser.Geom.Point.GetMagnitudeSq(point);
Project
var out = Phaser.Geom.Point.Project(from, to);
// var out = Phaser.Geom.Point.Project(from, to, out);  // modify out
or
var out = Phaser.Geom.Point.ProjectUnit(from, to);  // vector `from` and `to` are unit vector (length = 1)
// var out = Phaser.Geom.Point.ProjectUnit(from, to, out);  // modify out