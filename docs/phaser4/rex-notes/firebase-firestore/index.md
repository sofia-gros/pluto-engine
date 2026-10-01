Firestore
Introduction¶
Cloud Firestore is a flexible, scalable database for mobile, web, and server development from Firebase and Google Cloud Platform.
Author: Firebase
Usage¶
Official document
Sample code
Setup¶
Import firestore
import firebase from 'firebase/app';
import 'firebase/firestore';
Firebase has been included in package.json.
Initialize
var firebaseApp = firebase.initializeApp({
apiKey: '...',
authDomain: '...',
databaseURL: '...',
projectId: '...',
storageBucket: '...',
messagingSenderId: '...'
});
var db = firebaseApp.firestore();
db.settings({
timestampsInSnapshots: true
})
References¶
Reference of collection
var collectionRef = db.collection(collectionName);
Reference of document
var docRef = db.collection(collectionName).doc(docName);
Save¶
Add document
db.collection(collectionName).add(doc)      // doc: { ... }
.then(function(doc) { /* ... */ })
.catch(function(error) { /* ... */ });
Maximum size for a document : 1 MiB (1,048,576 bytes)
Set document
db.collection(collectionName).doc(docName).set(keyValues)  // keyValues: { ... }
.then(function(doc) { /* ... */ })
.catch(function(error) { /* ... */ });
Overwrite document
Update data
db.collection(collectionName).doc(docName).update(keyValues)  // keyValues: { ... }
.then(function(doc) { /* ... */ })
.catch(function(error) { /* ... */ });
Batched writes
// Get a new write batch
var batch = db.batch();
batch.set(db.collection(collectionName).doc(docName), keyValues);
batch.update(db.collection(collectionName).doc(docName), keyValues);
batch.delete(db.collection(collectionName).doc(docName));
// ...
// Commit the batch
batch.commit()
.then(function() { /* ... */ })
.catch(function(error) { /* ... */ });
Maximum document writting in a commit : 500
Delete a document
db.collection(collectionName).doc(docName).delete()
.then(function() { /* ... */ })
.catch(function(error) { /* ... */ });
Delete a field
db.collection(collectionName).doc(docName).update({
key: firebase.firestore.FieldValue.delete()
})
.then(function() { /* ... */ })
.catch(function(error) { /* ... */ });
Transaction
var docRef = db.collection(collectionName).doc(docName);
db.runTransaction(function(transaction) {
// read-modify-write
// This code may get re-run multiple times if there are conflicts.
return transaction.get(docRef).then(function(doc) {
// doc.exists
transaction.update(docRef, keyValues);
});
})
.then(function() {
//console.log("Transaction successfully committed!");
})
.catch(function(error) {
//console.log("Transaction failed: ", error);
});
Limitation: Writes and transactions section
Server timestamp¶
firebase.firestore.FieldValue.serverTimestamp()
Load¶
Get a document
db.collection(collectionName).doc(docName).get()
.then(function(doc) { /* ... */ })
.catch(function(error) { /* ... */ });
doc
doc.id
doc.data()
Get all documents
db.collection(collectionName).get()
.then(function(querySnapshot) { /* ... */ })
.catch(function(error){ /* ... */ });
querySnapshot
querySnapshot.docs
querySnapshot.forEach(callback, thisArg)
querySnapshot.empty
querySnapshot.size
Simple queries
db.collection(collectionName).where(key, op, value).get()
.then(function(querySnapshot) { /* ... */ })
.catch(function(error){ /* ... */ });
op : '>', '==', '<', '>=', '<='
!= : where(key,'>', value).where(key, '<', value)
Compound queries
db.collection(collectionName).where(key0, op0, value0).where(key1, op1, value1).get()
.then(function(querySnapshot) { /* ... */ })
.catch(function(error){ /* ... */ });
Range filters (<, <=, >, >=) on only one field
Paginate¶
Order, limit
db.collection(collectionName).orderBy(key).limit(count)
Descending order : orderBy(key, 'desc')
Order by multiple fields : orderBy(key0).orderBy(key1)
Query, order, limit
db.collection(collectionName).where(key, op, value).orderBy(key).limit(count)
Key of first order must be equal to range comparison (<, <=, >, >=)
Page
Start at
db.collection(collectionName).orderBy(key).startAt(value).limit(count).get()
.then(function(querySnapshot) { /* ... */ })
.catch(function(error){ /* ... */ });
endAt(value)
Next page
var lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
db.collection(collectionName).orderBy(key).startAfter(lastDoc).limit(count).get()
.then(function(querySnapshot) { /* ... */ })
.catch(function(error){ /* ... */ });
endBefore(lastDoc)
Get realtime updates¶
Get updates of a document
var unsubscribe = db.collection(collectionName).doc(docName)
.onSnapshot(function(doc) { /* ... */ });
Get updates of documents
var unsubscribe = db.collection(collectionName).where(key, op, value)
.onSnapshot(function(querySnapshot) { /* ... */ });
Changes
var changes = querySnapshot.docChanges();  // [change]
Change
change.type : 'added', 'modified', 'removed'
change.newIndex
change.oldIndex
Detach a listener
unsubscribe();
Events for metadata changes
var unsubscribe = db.collection(collectionName).doc(docName)
.onSnapshot({
includeMetadataChanges: true    // Listen for document metadata changes
},
function(doc) { /* ... */ } );
Indexing¶
Reference