Point light
Introduction¶
A point light with gradient color in a circle.
Author: Phaser Team
WebGL only
It only works in WebGL render mode.
Usage¶
Add point light¶
var pointLight = scene.add.pointlight(x, y, color, radius, intensity, attenuation);
x, y : The horizontal/vertical position of this Game Object in the world.
color : Color of this light.
radius : Radius of this light.
intensity : 0~1, intensity of color.
attenuation : 0~1, decay intensity along radius.
Position¶
Set
pointLight.setPosition(x, y);
or
pointLight.x = x;
pointLight.y = y;
Get
var x = pointLight.x;
var y = pointLight.y;
Color¶
Set
Red, green, blue
pointLight.color.set(red, green, blue);
or
pointLight.color.r = red;
pointLight.color.g = green;
pointLight.color.b = blue;
red, green, blue : 0~1.
Get
Red, green, blue
var red = pointLight.color.r;
var green = pointLight.color.g;
var blue = pointLight.color.b;
red, green, blue : 0~1.
Radius¶
Set
pointLight.radius = radius;
Get
var radius = pointLight.radius;
Intensity¶
Set
pointLight.intensity = intensity;
Get
var intensity = pointLight.intensity;
Attenuation¶
Set
pointLight.attenuation = attenuation;
Get
var attenuation = pointLight.attenuation;