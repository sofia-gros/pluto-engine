LocalForage
Introduction¶
Offline storage, improved.
Author: Mozilla
Usage¶
Official document
Sample code
By default, LocalForage selects backend drivers for the datastore in this order:
IndexedDB
WebSQL
localStorage
Save data¶
Callback
localforage.setItem(key, value, function(){ /* ... */ });
Promise
localforage.setItem(key, value)
.then(function(value){ /* ... */ })
.catch(function(err){ /* ... */ });
Read data¶
Callback
localforage.getItem(key, function(err, value){ /* ... */ });
Promise
localforage.getItem(key)
.then(function(value){ /* ... */ })
.catch(function(err){ /* ... */ });
Remove data¶
Callback
localforage.removeItem(key, function(){ /* ... */ });
Promise
localforage.removeItem(key)
.then(function(value){ /* ... */ })
.catch(function(err){ /* ... */ });