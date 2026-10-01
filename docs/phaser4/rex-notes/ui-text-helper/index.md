Ui text helper
Introduction¶
Some helper methods for Text object, bbcode text object, tag text object, Bitmap text object game objects
Author: Rex
Methods
Live demos¶
Wrap-expand-text
Wrap-expand-bitmaptext
Fontsize-expand-text
Resize Fontsize-expand-text
Usage¶
Wrap-expand-text
Fontsize-expand-text
Wrap expand text¶
sizer
.add(
this.rexUI.wrapExpandText(this.add.text(0, 0, content)),
{
// proportion: 1,
// expand: true
}
)
proportion: 1 or/and expand: true : Expand width of text
Fontsize expand text¶
sizer
.add(
this.rexUI.fontSizeExpandText(this.add.text(0, 0, content)),
{
// proportion: 1,
// expand: true
}
)
proportion: 1 or/and expand: true : Expand width of text