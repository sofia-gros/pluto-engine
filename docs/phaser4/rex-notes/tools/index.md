Tools
Texture atlas¶
Texture-packer¶
Texture-packer
Free texture packer¶
Free texture packer, Web app
Leshy SpriteSheet Tool¶
Leshy SpriteSheet Tool
Export to JSON-TP-Hash
Aseprite¶
Aseprite
Go to "File - Export Sprite Sheet"
On the Layout tab:
Set the "Sheet type" to "Packed"
Set the "Constraints" to "None"
Check the "Merge Duplicates" checkbox
On the Sprite tab:
Set "Layers" to "Visible layers"
Set "Frames" to "All frames", unless you only wish to export a sub-set of tags
On the Borders tab:
Check the "Trim Sprite" and "Trim Cells" options
Ensure "Border Padding", "Spacing" and "Inner Padding" are all > 0 (1 is usually enough)
On the Output tab:
Check "Output File", give your image a name and make sure you choose "png files" as the file type
Check "JSON Data" and give your json file a name
The JSON Data type can be either a Hash or Array, Phaser doesn't mind.
Make sure "Tags" is checked in the Meta options
In the "Item Filename" input box, make sure it says just "{frame}" and nothing more.
Click export
Tested with Aseprite 1.2.25
Atlas-packer¶
gammafp/Atlas-packer
Animation¶
gammafp/Animator
Bitmap font¶
SnowB BMF
71squared-glyphdesigner
Bitmap Font Generator
TTF to PNG