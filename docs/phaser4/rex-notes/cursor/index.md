Cursor
Introduction¶
Custom cursor, built-in feature of phaser.
Author: Phaser Team
Usage¶
References:
Cursor
Using URL values for the cursor property
Set default cursor¶
scene.input.setDefaultCursor(CSSString);
// CSSString: 'url(assets/input/cursors/sword.cur), pointer'
Set cursor of a Game Object¶
Change cursor image when cursor is over that Game Object.
gameObject.setInteractive({
cursor: CSSString
});
// CSSString: 'url(assets/input/cursors/sword.cur), pointer'
Set cursor image directly after gameObject.setInteractive().
gameObject.input.cursor = CSSString;
// CSSString: 'url(assets/input/cursors/sword.cur), pointer'
Use pointer (hand cursor).
gameObject.setInteractive({
useHandCursor: true
});
Change current cursor¶
scene.input.canvas.style.cursor = cursor;
cursor : CSSString
or
scene.input.setCursor(gameObject.input);
Reset to default cursor¶
scene.input.resetCursor(null, true);