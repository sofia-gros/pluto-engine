Ellipse
Introduction¶
Ellipse shape and methods, built-in methods of phaser.
Author: Phaser Team
Usage¶
Create shape¶
var ellipse = new Phaser.Geom.Ellipse(x, y, width, height);
Clone shape¶
var ellipse1 = Phaser.Geom.Ellipse.Clone(ellipse0);
Draw on graphics¶
Fill shape
// graphics.fillStyle(color, alpha);   // color: 0xRRGGBB
graphics.fillEllipseShape(ellipse);
Stroke shape
// graphics.lineStyle(lineWidth, color, alpha);   // color: 0xRRGGBB
graphics.strokeEllipseShape(ellipse);
Note
Negative width, height will be treated as positive width, height. i.e. Math.abs(width), Math.abs(height)
Set properties¶
All properties
ellipse.setTo(x, y, width, height);
or
Phaser.Geom.Ellipse.CopyFrom(source, dest);
Position
ellipse.setPosition(x, y);
or
ellipse.x = 0;
ellipse.y = 0;
or
ellipse.left = 0;       // ellipse.x
ellipse.top = 0;        // ellipse.y
// ellipse.right = 0;   // ellipse.x
// ellipse.bottom = 0;  // ellipse.y
or
Phaser.Geom.Ellipse.Offset(ellipse, dx, dy); // ellipse.x += dx, ellipse.y += dy
or
Phaser.Geom.Ellipse.OffsetPoint(ellipse, point); // ellipse.x += point.x, ellipse.y += point.y
Width, height
ellipse.width = width;
ellipse.height = height;
Get properties¶
Position
var x = ellipse.x;
var y = ellipse.y;
var top = ellipse.top;
var left = ellipse.left;
var right = ellipse.right;
var bottom = ellipse.bottom;
Width, height
var width = ellipse.width;
var height = ellipse.height;
Bound
var bound = Phaser.Geom.Ellipse.GetBounds(ellipse);
// var bound = Phaser.Geom.Ellipse.GetBounds(ellipse, bound);  // push bound
bound : A Rectangle shape object
Area
var area = Phaser.Geom.Ellipse.Area(ellipse);
Circumference
var circumference = Phaser.Geom.Ellipse.Circumference(ellipse);
Type:
var type = ellipse.type; // 1
Point(s) & shape¶
Get point at shape's edge
var point = ellipse.getPoint(t);  // t : 0 ~ 1 (angle/360)
// var point = ellipse.getPoint(t, point);  // modify point
or
var point = Phaser.Geom.Ellipse.CircumferencePoint(ellipse, angle);  // angle in degrees
// var point = Phaser.Geom.Ellipse.CircumferencePoint(ellipse, angle, point);  // modify point
Get a random point inside shape
var point = ellipse.getRandomPoint();
// var point = ellipse.getRandomPoint(point);  // modify point
Get points around shape's edge
var points = ellipse.getPoints(quantity);
// var points = ellipse.getPoints(quantity, null, points);  // push points
or calculate quantity from steps
var points = ellipse.getPoints(false, step);
// var points = ellipse.getPoints(false, step, points);  // push points
points : an array of point
Point is inside shape
var isInside = ellipse.contains(x, y);
or
var isInside = Phaser.Geom.Ellipse.ContainsPoint(ellipse, point);
Rectangle is inside shape
var isInside = Phaser.Geom.Ellipse.ContainsRect(ellipse, rect);  // rect : 4 points
Empty¶
Set empty
ellipse.setEmpty();     // ellipse.width = 0, ellipse.height = 0
Is empty
var isEmpty = ellipse.isEmpty();   // ellipse.width <= 0 || ellipse.height <= 0
Equal¶
var isEqual = Phaser.Geom.Ellipse.Equals(ellipse0, ellipse1);
Position and width, height are equal.