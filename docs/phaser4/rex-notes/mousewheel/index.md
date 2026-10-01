Mouse wheel
Introduction¶
Mouse wheel events of phaser.
Author: Phaser Team
Usage¶
Mouse wheel events¶
Events on touched Game object
gameObject.on('wheel', function(pointer, dx, dy, dz, event){ /* ... */ });
Event on input plugin for each touched Game object
scene.input.on('gameobjectwheel', function(pointer, gameObject, dx, dy, dz, event){ /* ... */ });
Events to get all touched Game Objects
scene.input.on('wheel', function(pointer, currentlyOver, dx, dy, dz, event){ /* ... */ });
Mouse wheel properties¶
pointer.deltaX : The horizontal scroll amount that occurred due to the user moving a mouse wheel or similar input device.
pointer.deltaY : The vertical scroll amount that occurred due to the user moving a mouse wheel or similar input device.
pointer.deltaZ : The z-axis scroll amount that occurred due to the user moving a mouse wheel or similar input device.