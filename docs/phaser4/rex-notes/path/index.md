Path
Introduction¶
Path in curves, built-in object of phaser.
Author: Phaser Team
Usage¶
Add path object¶
var path = scene.add.path();
// var path = scene.add.path(x, y);  // curve start from (x, y)
or
var path = new Phaser.Curves.Path();
// var path = new Phaser.Curves.Path(x, y);  // curve start from (x, y)
Add path object with curves¶
Curves in JSON
var path = scene.add.path(json);
or
var path = new Phaser.Curves.Path(json);
Add curve¶
Line¶
Add line object
Create line object
var curve = new Phaser.Curves.Line({x: x0, y: y0}, {x: x1, y: y1});
or
var curve = new Phaser.Curves.Line([x0, y0, x1, y1]);
Add to path
path.add(curve);
Add line started from previous end point to next point
path.lineTo(endX, endY);
or
path.lineTo(new Phaser.Math.Vector2({x, y}));
Properties:
curve.p0 : The first endpoint.
curve.p0.x, curve.p0.y
curve.p1 : The second endpoint.
curve.p1.x, curve.p1.y
Circle/ellipse/arc¶
Add circle/ellipse/arc object
Create circle/ellipse/arc object
Circle
var curve = new Phaser.Curves.Ellipse(x, y, radius);
Ellipse
var curve = new Phaser.Curves.Ellipse(x, y, xRadius, yRadius);
Arc
var curve = new Phaser.Curves.Ellipse(x, y, xRadius, yRadius, startAngle, endAngle, clockwise, rotation);
startAngle, endAngle : Degrees.
Add to path
path.add(curve);
Add circle/ellipse/arc started from previous end point to next point
Circle
path.circleTo(radius);
Ellipse
path.ellipseTo(xRadius, yRadius);
Arc
path.ellipseTo(xRadius, yRadius, startAngle, endAngle, clockwise, rotation);
Properties:
curve.p0 : Center point.
curve.p0.x, curve.p0.y
curve.xRadius, curve.yRadius : Horizontal/vertical radiuse.
curve.startAngle, curve.endAngle : Start/end angle, in degrees.
curve.clockwise : true if Clockwise, false if anti-clockwise.
curve.angle : Rotation, in degrees.
curve.rotation : Rotation, in radians.
Spline¶
Add spline object
Create spline object
var curve = new Phaser.Curves.Spline([
p0,            // {x, y}, or [x, y]
p1,            // {x, y}, or [x, y]
// ...
]);
or
var curve = new Phaser.Curves.Spline([
x0, y0,
x1, y1,
// ...
]);
Add to path
path.add(curve);
Add spline started from previous end point to next point
var points = ;
path.splineTo([
p0,            // {x, y}, or [x, y]
p1,            // {x, y}, or [x, y]
// ...
]);
or
path.splineTo([
x0, y0,
x1, y1,
// ...
]);
Append point¶
var point = curve.addPoint(x, y);
Quadratic bezier curve¶
Create quadratic bezier curve object
var curve = new Phaser.Curves.QuadraticBezier(startPoint, controlPoint, endPoint); // point: {x, y}
or
var points = [
x0, y0,     // start point
x1, y1,     // control point
x2, y2      // end point
];
var curve = new Phaser.Curves.QuadraticBezier(points);
Add to path
path.add(curve);
Add quadratic bezier curve started from previous end point to next point
path.quadraticBezierTo(endX, endY, controlX, controlY);
or
path.quadraticBezierTo(endPoint, controlPoint);  // point : Phaser.Math.Vector2
Cubic bezier curve¶
Create quadratic bezier curve object
var curve = new Phaser.Curves.CubicBezier(startPoint, controlPoint1, controlPoint2, endPoint); // point: {x, y}
or
var points = [
x0, y0,     // start point
x1, y1,     // control point1
x2, y2,     // control point2
x3, y3      // end point
];
var curve = new Phaser.Curves.CubicBezier(points);
Add to path
path.add(curve);
Add cubic bezier curve started from previous end point to next point
path.cubicBezierTo(endX, endY, control1X, control1Y, control2X, control2Y);
or
path.cubicBezierTo(endPoint, controlPoint1, controlPoint2);  // point : Phaser.Math.Vector2
Move to point¶
path.moveTo(x, y);
Add curves from JSON¶
path.fromJSON(json);
Get curves¶
var curves = path.curves;
Get curve at t¶
var curve = path.getCurveAt(t);
t : The normalized location on the Path. Between 0 and 1
Draw on graphics¶
path.draw(graphics);
// path.draw(graphics, pointsTotal);
pointsTotal : The number of points to draw for each Curve.
or
curve.draw(graphics);
// curve.draw(graphics, pointsTotal);
pointsTotal : The resolution of the curve.
Point¶
Get point
var out = path.getPoint(t);  // t: 0 ~ 1
// var out = path.getPoint(t, out);  // modify out
or
var out = curve.getPoint(t);  // t: 0 ~ 1
// var out = curve.getPoint(t, out);  // modify out
Distance of path from start point to target point (out) might not linear with t.
Get random point
var out = path.getRandomPoint();
// var out = path.getRandomPoint(out);  // modify out
or
var out = curve.getRandomPoint();
// var out = curve.getRandomPoint(out);  // modify out
Get n points
Path
var points = path.getPoints(divisions);
divisions : The number of divisions per resolution per curve.
Curve
var points = curve.getPoints(divisions);
// var points = curve.getPoints(divisions, undefined, out);
or
var points = curve.getPoints(undefined, stepRate);
// var points = curve.getPoints(undefined, stepRate, out);
divisions : The number of divisions in this curve.
divisions, if divisions > 0, else
this.getLength / stepRate, if stepRate > 0, else
defaultDivisions
points : Return 1 + divisions points.
Get (n+1) points equally spaced out along the curve
var points = path.getSpacedPoints(n);
or
var points = curve.getSpacedPoints(n);
// var points = curve.getSpacedPoints(undefined, stepRate);
// var points = curve.getSpacedPoints(divisions, stepRate, out);
Get points spaced out n distance pixels apart
var points = curve.getDistancePoints(n)
The smaller the distance, the larger the array will be.
Path object does NOT support this feature yet.
Get start point
var out = path.getStartPoint();
// var out = path.getStartPoint(out);  // modify out
or
var out = curve.getStartPoint();
// var out = curve.getStartPoint(out);  // modify out
Get end point
var out = path.getEndPoint();
// var out = path.getEndPoint(out);  // modify out
or
var out = curve.getEndPoint();
// var out = curve.getEndPoint(out);  // modify out
Get t (0~1) from distance
var t = curve.getTFromDistance(d);
Path object does NOT support this feature yet.
Get tangent
var out = path.getTangent(t);  // t: 0~1
// var out = path.getTangent(t, out);  // modify out
or
var out = curve.getTangent(t);  // t: 0~1
// var out = curve.getTangent(t, out);  // modify out
Length of path¶
var l = path.getLength();
or
var l = curve.getLength();
Length of path/curve will be cached.
Update length¶
path.updateArcLengths();
or
curve.updateArcLengths();
Curves to JSON¶
var json = path.toJSON();
or
var json = curve.toJSON();
Bounds¶
Get bounds
var out = path.getBounds();    // accuracy = 16
// var out = path.getBounds(out);
// var out = path.getBounds(out, accuracy);
or
var out = curve.getBounds();    // accuracy = 16
// var out = curve.getBounds(out);
// var out = curve.getBounds(out, accuracy);
out : A rectangle object
Destroy¶
path.destroy();