Circle
Introduction¶
Circle shape and methods, built-in methods of phaser.
Author: Phaser Team
Usage¶
Create shape¶
var circle = new Phaser.Geom.Circle(x, y, radius);
Clone shape¶
var circle1 = Phaser.Geom.Circle.Clone(circle0);
Draw on graphics¶
Fill shape
// graphics.fillStyle(color, alpha);   // color: 0xRRGGBB
graphics.fillCircleShape(circle);
Stroke shape
// graphics.lineStyle(lineWidth, color, alpha);   // color: 0xRRGGBB
graphics.strokeCircleShape(circle);
Note
Negative radius will be treated as positive radius. i.e. Math.abs(radius)
Set properties¶
All properties
circle.setTo(x, y, radius);
or
Phaser.Geom.Circle.CopyFrom(source, dest);
Position
circle.setPosition(x, y);
or
circle.x = 0;
circle.y = 0;
or
circle.left = 0;       // circle.x
circle.top = 0;        // circle.y
// circle.right = 0;   // circle.x
// circle.bottom = 0;  // circle.y
or
Phaser.Geom.Circle.Offset(circle, dx, dy); // circle.x += dx, circle.y += dy
or
Phaser.Geom.Circle.OffsetPoint(circle, point); // circle.x += point.x, circle.y += point.y
Radius
circle.radius = radius;
or
circle.diameter = diameter;  // diameter = 2 * radius
Get properties¶
Position
var x = circle.x;
var y = circle.y;
var top = circle.top;
var left = circle.left;
var right = circle.right;
var bottom = circle.bottom;
Radius
var radius = circle.radius;
// var diameter = circle.diameter;
Bound
var bound = Phaser.Geom.Circle.GetBounds(circle);
// var bound = Phaser.Geom.Circle.GetBounds(circle, bound);  // push bound
bound : A Rectangle shape object
Area
var area = Phaser.Geom.Circle.Area(circle);
Circumference
var circumference = Phaser.Geom.Circle.Circumference(circle);
Type:
var type = circle.type; // 0
Point(s) & shape¶
Get point at shape's edge
var point = circle.getPoint(t);  // t : 0 ~ 1 (angle/360)
// var point = circle.getPoint(t, point);  // modify point
or
var point = Phaser.Geom.Circle.CircumferencePoint(circle, angle);  // angle in degrees
// var point = Phaser.Geom.Circle.CircumferencePoint(circle, angle, point);  // modify point
Get a random point inside shape
var point = circle.getRandomPoint();
// var point = circle.getRandomPoint(point);  // modify point
Get points around shape's edge
var points = circle.getPoints(quantity);
// var points = circle.getPoints(quantity, null, points);  // push points
or calculate quantity from steps
var points = circle.getPoints(false, step);
// var points = circle.getPoints(false, step, points);  // push points
points : an array of point
Point is inside shape
var isInside = circle.contains(x, y);
or
var isInside = Phaser.Geom.Circle.ContainsPoint(circle, point);
Rectangle is inside shape
var isInside = Phaser.Geom.Circle.ContainsRect(circle, rect);  // rect : 4 points
Empty¶
Set empty
circle.setEmpty();     // circle.radius = 0
Is empty
var isEmpty = circle.isEmpty();   // circle.radius <= 0
Equal¶
var isEqual = Phaser.Geom.Circle.Equals(circle0, circle1);
Position and radius are equal.
Intersection¶
Circle to circle¶
Is intersection
var result = Phaser.Geom.Intersects.CircleToCircle(circleA, circleB);
Get intersection points
var result = Phaser.Geom.Intersects.GetCircleToCircle(circleA, circleB);
// var out = Phaser.Geom.Intersects.GetCircleToCircle(circleA, circleB, out);
Circle to rectangle¶
Is intersection
var result = Phaser.Geom.Intersects.CircleToRectangle(circle, rect);
Get intersection points
var result = Phaser.Geom.Intersects.GetCircleToRectangle(circle, rect);
// var out = Phaser.Geom.Intersects.GetCircleToRectangle(circle, rect, out);
Circle to triangle¶
Is intersection
var result = Phaser.Geom.Intersects.TriangleToCircle(triangle, circle);
Get intersection points
var result = Phaser.Geom.Intersects.GetTriangleToCircle(triangle, circle);
// var out = Phaser.Geom.Intersects.GetTriangleToCircle(triangle, circle, out);
Circle to line¶
Is intersection
var result = Phaser.Geom.Intersects.LineToCircle(line, circle);
// var result = Phaser.Geom.Intersects.LineToCircle(line, circle, nearest);
nearest : Nearest point on line.
Get intersection points
var result = Phaser.Geom.Intersects.GetLineToCircle(line, circle);
// var out = Phaser.Geom.Intersects.GetLineToCircle(line, circle, out);