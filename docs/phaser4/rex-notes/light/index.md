Light
Introduction¶
lighting system from normal map.
Author: Phaser Team
WebGL only
It only works in WebGL render mode.
Usage¶
Light system¶
Enable¶
Enable
scene.lights.enable();
Disable
scene.lights.disable();
or
scene.lights.active = false;
Ambient color¶
scene.lights.setAmbientColor(color);
color : Integer color value.
Light¶
Add
var light = scene.lights.addLight(x, y, radius);
// var light = scene.lights.addLight(x, y, radius, color, intensity);
x, y : The horizontal/vertical position of the Light.
radius : The radius of the Light.
color : The integer RGB color of the light. Default is 0xffffff.
intensity : The intensity of the Light.
Remove
scene.lights.removeLight(light);
Position¶
Set
light.setPosition(x, y);
or
light.x = x;
light.y = y;
Get
var x = light.x;
var y = light.y;
Color¶
Set
Red, green, blue
light.color.set(red, green, blue);
or
light.color.r = red;
light.color.g = green;
light.color.b = blue;
Integer value
light.setColor(colorInteger);
Get
Red, green, blue
var red = light.color.r;
var green = light.color.g;
var blue = light.color.b;
Size¶
Set
light.setRadius(radius);
// light.radius = radius;
or
light.diameter = diameter;
// light.width = diameter;
// light.height = diameter;
// light.displayWidth = diameter;
// light.displayHeight = diameter;
Get
var radius = light.radius;
or
var diameter = light.diameter;
// var diameter = light.displayWidth;
// var diameter = light.displayHeight;
// var diameter = light.width;
// var diameter = light.height;
Intensity¶
Set
light.setIntensity(intensity);
or
light.intensity = intensity;
Get
var intensity = light.intensity;
Game object¶
Load texture with normal map¶
scene.load.image(key, [url, normalMapUrl]);
url : Url of texture.
url : Url of texture.
normalMapUrl : Url of normal map.
Apply light pipeline¶
gameObject.setPipeline('Light2D');