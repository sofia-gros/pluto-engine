DOM element
Introduction¶
Carry DOM element, built-in game object of phaser.
Limitations
Dom elements appear above or below your game canvas. You cannot blend them into the display list, meaning you cannot have a DOM Element, then a Sprite, then another DOM Element behind it.
Author: Phaser Team
Usage¶
Configuration¶
Set parent to divId
Set dom.createContainer to true.
var config = {
// ...
parent: divId,
// fullscreenTarget: divId, // For fullscreen
dom: {
createContainer: true
},
input: {
mouse: {
target: divId
},
touch: {
target: divId
},
},
// ...
}
var game = new Phaser.Game(config);
Add DOM element object¶
Add html string¶
Load html string in preload stage
scene.load.html(key, url);
Reference: load html
Add DOM element object with html string from cache
var domElement = scene.add.dom(x, y).createFromCache(key);  // elementType = 'div'
// var domElement = scene.add.dom(x, y).createFromCache(key, elementType);
Add DOM element object with html string
var domElement = scene.add.dom(x, y).createFromHTML(htmlString);  // elementType = 'div'
// var domElement = scene.add.dom(x, y).createFromHTML(htmlString, elementType);
`elementType : The tag name of the element into which all of the html will be inserted. Defaults to a plain div tag.
Create element¶
scene.add.dom(x, y).createElement(tagName);
// scene.add.dom(x, y).createElement(tagName, style, innerText);
tagName : A string that specifies the type of element to be created. For example, 'div'
style : Either a DOMString that holds the CSS styles to be applied to the created element, or an object the styles will be readyfrom. Optional.
innerText : A DOMString that holds the text that will be set as the innerText of the created element. Optional.
Add existing DOM¶
Create DOM element
var el = document.createElement('div');
// el.style = '...';
// el.innerText = '...';
Add to scene
var domElement = scene.add.dom(x, y, el);
// var domElement = scene.add.dom(x, y, el, style, innerText);
Custom class¶
Define class
class MyDOMElement extends Phaser.GameObjects.DOMElement {
constructor(scene, x, y, element, style, innerText) {
super(scene, x, y, element, style, innerText);
// ...
scene.add.existing(this);
}
// ...
// preUpdate(time, delta) {
//     super.preUpdate(time, delta);
// }
}
scene.add.existing(gameObject) : Adds an existing Game Object to this Scene.
If the Game Object renders, it will be added to the Display List.
If it has a preUpdate method, it will be added to the Update List.
Create instance
var domElement = new MyDOMElement(scene, x, y, element);
Event of DOM element¶
Add listener
domElement.addListener(eventName);
eventName : Event name
Single string. ex. 'click'
Event name joined with ' '
Add event handler
var callback = function(event) {
// event.target.name
};
domElement.on(eventName, callback, scope);
// domElement.once(eventName, callback, scope);
Reference: event emitter
Remove listener
domElement.removeListener(eventName);
eventName : Event name
Single string. ex. 'click'
Event name joined with ' '
Get child¶
Get child by name
var child = domElement.getChildByName(name)
Get child by id
var child = domElement.getChildByID(id)
Get child by property
var child = domElement.getChildByProperty(property, value)
Set inner html string¶
scene.setHTML(html);
or
scene.setText(html);
DOM Element¶
Each DOM element object has 1 DOM element.
Set
domElement.setElement(el);
// domElement.setElement(el, style, innerText);
Get
var el = domElement.node;
Depth¶
domElement.setDepth(value);
Set size¶
var style = domElement.node.style;
style.width = width + 'px';
style.height = height + 'px';
domElement.updateSize();
Skew¶
domElement.setSkew(x, y);
or
domElement.skewX = x;
domElement.skewY = y;
Rotate 3d¶
The rotate3d() CSS function defines a transformation that rotates an element around a fixed axis in 3D space, without deforming it.
domElement.rotate3d.set(x, y, z, a);
or
domElement.rotate3d.x = x;
domElement.rotate3d.y = y;
domElement.rotate3d.z = z;
domElement.rotate3d.w = a;
Reference
Interactive with other game objects¶
DOM game object always put above game canvas, i.e. DOM game object will render above any other kind of game object.
DOM game object will receive touch event even if it is not the first touched game object.
P3's 'pointerdown', 'pointerup' events will be fired above/under DOM game object.
P3's 'pointermove' event won't be fired above/under DOM game object, except
Setting DOM game object to be invisilbe.
Assign input.mouse.target parameter of game config.
DOM game object only can be displayed by main camera. i.e. dom game object can't add to other camera.
Other properties¶
See game object