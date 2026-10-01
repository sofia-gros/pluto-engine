LocalStorage
Introduction¶
Store small data in key-value pairs locally within the user's browser.
Author: Built-in javascript function
Max Size
5MB per app per browser.
Usage¶
Reference
Sample code
Save data¶
localStorage.setItem(key, value);
Read data¶
var value = localStorage.getItem(key);
Note
The keys and the values are always strings.
Objects, integer keys will be automatically converted to strings.
Remove data¶
localStorage.removeItem(key);