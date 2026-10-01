Keyboard events
Introduction¶
Built-in keyboard events of phaser.
Author: Phaser Team
Usage¶
Quick start¶
Is key-down/is key-up
var keyObject = scene.input.keyboard.addKey('W');  // Get key object
var isDown = keyObject.isDown;
var isUp = keyObject.isUp;
var shiftKey = keyObject.shiftKey;
Key is down after a duration
var keyObject = scene.input.keyboard.addKey('W');  // Get key object
var isDown = scene.input.keyboard.checkDown(keyObject, duration);
On key-down/on key-up
var keyObject = scene.input.keyboard.addKey('W');  // Get key object
keyObject.on('down', function(event) { /* ... */ });
keyObject.on('up', function(event) { /* ... */ });
or
scene.input.keyboard.on('keydown-' + 'W', function (event) { /* ... */ });
scene.input.keyboard.on('keyup-' + 'W', function (event) { /* ... */ });
Any key-down/any key-up
scene.input.keyboard.on('keydown', function (event) { /* ... */ });
scene.input.keyboard.on('keyup', function (event) { /* ... */ });
event : KeyboardEvent
event.code : 'Key' + 'W'
Key object¶
Get key object
var keyObject = scene.input.keyboard.addKey('W');  // see `Key map` section
// var keyObject = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
or
var keyObject = scene.input.keyboard.addKey('W', enableCapture, emitOnRepeat);
enableCapture : Automatically call preventDefault on the native DOM browser event for the key codes being added.
emitOnRepeat : Controls if the Key will continuously emit a 'down' event while being held down (true), or emit the event just once (false, the default).
Get key objects
var keyObjects = scene.input.keyboard.addKeys('W,S,A,D');  // keyObjects.W, keyObjects.S, keyObjects.A, keyObjects.D
// var keyObjects = scene.input.keyboard.addKeys('W,S,A,D', enableCapture, emitOnRepeat);
or
var keyObjects = scene.input.keyboard.addKeys({
up: 'W',
down: 'S',
left: 'A',
right: 'D'
});  // keyObjects.up, keyObjects.down, keyObjects.left, keyObjects.right
Remove key object
scene.input.keyboard.removeKey('W');
// scene.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.W);
// scene.input.keyboard.removeKey(key, destroy, removeCapture);
destroy : Call Key.destroy on each removed Key object
removeCapture : Remove all key captures for Key objects owened by this plugin?
Remove all key objects
scene.input.keyboard.removeAllKeys(true);
// scene.input.keyboard.removeAllKeys(destroy, removeCapture);
destroy : Call Key.destroy on each removed Key object
removeCapture : Remove all key captures for Key objects owened by this plugin?
Key-down/key-up state
var isDown = keyObject.isDown;
var isUp = keyObject.isUp;
Duration of key-down
var duration = keyObject.getDuration(); // ms
Enable/disable
keyObject.enabled = enabled; // Set false to disable key event
Key object of cursorkeys¶
Get key state object
var cursorKeys = scene.input.keyboard.createCursorKeys();
Get key state
var isUpDown = cursorKeys.up.isDown;
var isDownDown = cursorKeys.down.isDown;
var isLeftDown = cursorKeys.left.isDown;
var isRightDown = cursorKeys.right.isDown;
var isSpaceDown = cursorKeys.space.isDown;
var isShiftDown = cursorKeys.shift.isDown;
Order of key-down/key-up events¶
Key-down/key-up events of key object
var keyObject = scene.input.keyboard.addKey('W');  // Get key object
keyObject.on('down', function(event) { /* ... */ });
keyObject.on('up', function(event) { /* ... */ });
event.stopImmediatePropagation() : Stop any further listeners from being invoked in the current Scene.
event.stopPropagation() : Stop it reaching any other Scene.
On key-down/on key-up
scene.input.keyboard.on('keydown-' + 'W', function (event) { /* ... */ });
scene.input.keyboard.on('keyup-' + 'W', function (event) { /* ... */ });
event.stopImmediatePropagation() : Stop any further listeners from being invoked in the current Scene.
event.stopPropagation() : Stop it reaching any other Scene.
Invoke event.preventDefault() to stop event propagation to native DOM.
Any key-down/on key-up
scene.input.keyboard.on('keydown', function (event) { /* ... */ });
scene.input.keyboard.on('keyup', function (event) { /* ... */ });
event.key : 'a'
event.keyCode : 65
event.code : 'KeyA'
event.stopImmediatePropagation() : Stop any further listeners from being invoked in the current Scene.
event.stopPropagation() : Stop it reaching any other Scene.
Destroy key object¶
keyObject.destroy();
Key map¶
A ~ Z
F1 ~ F12
BACKSPACE
TAB
ENTER
SHIFT
CTRL. ALT
PAUSE
CAPS_LOCK
ESC
SPACE
PAGE_UP, PAGE_DOWN
END, HOME
LEFT, UP, RIGHT,DOWN
PRINT_SCREEN
INSERT, DELETE
ZERO, ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE
NUMPAD_ZERO, NUMPAD_ONE, NUMPAD_TWO, NUMPAD_THREE, NUMPAD_FOUR, NUMPAD_FIVE, NUMPAD_SIX, NUMPAD_SEVEN, NUMPAD_EIGHT, NUMPAD_NINE, NUMPAD_ADD, NUMPAD_SUBTRACT
OPEN_BRACKET, CLOSED_BRACKET
SEMICOLON_FIREFOX, COLON, COMMA_FIREFOX_WINDOWS, COMMA_FIREFOX, BRACKET_RIGHT_FIREFOX, BRACKET_LEFT_FIREFOX