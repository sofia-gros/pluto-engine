LokiJs
Introduction¶
In-memory JavaScript Datastore with Persistence.
Reference
Document
Usage¶
Sample code
Create database¶
var db = new loki();
// var db = new loki('loki.json', config);  // load database from file
Create collection¶
var collection = db.addCollection(name);
// var collection = db.addCollection(name, config);
Get collection¶
var collection = db.getCollection(name);
Insert document¶
var docInColl = collection.insert(doc);  // doc: an object
Get Id
var id = docInColl.$loki;
Insert documents¶
collection.insert(docArray);  // documents in array
Query¶
Get document by id¶
var doc = collection.get(id);  // id: `$loki`
Get doc by unique index¶
var doc = collection.by(key, value);
Filter documents¶
$eq : filter for document(s) with property of (strict) equality
var docArray = collection.find({key: value});
// var docArray = collection.find({key: {'$eq': value});
$aeq : filter for document(s) with property of abstract (loose) equality
var docArray = collection.find({key: {'$aeq': value}});
For example
var results = coll.find({age: {'$aeq': 20}});  // age == '20' or age == 20
$ne : filter for document(s) with property not equal to provided value
var docArray = collection.find({key: {'$ne': value}});
$gt : filter for document(s) with property greater than provided value
var docArray = collection.find({key: {'$gt': value}});
$gte : filter for document(s) with property greater or equal to provided value
var docArray = collection.find({key: {'$gte': value}});
$lt : filter for document(s) with property less than provided value
var docArray = collection.find({key: {'$lt': value}});
$lte : filter for document(s) with property less than or equal to provided value
var docArray = collection.find({key: {'$lte': value}});
$between : filter for documents(s) with property between provided values
var docArray = collection.find({key: {'$between': [value0, value1]}});
$in : filter for document(s) with property matching any of the provided array values
var docArray = collection.find({key: {'$in': [value0, value1, ...]}});
Your property should not be an array but your compare values should be.
$nin : filter for document(s) with property not matching any of the provided array values
var docArray = collection.find({key: {'$nin': [value0, value1, ...]}});
$contains : filter for document(s) with property containing the provided value
var docArray = collection.find({key: {'$contains': value}});
Use this when your property contains an array but your compare value is not an array
$containsAny : filter for document(s) with property containing any of the provided values
var docArray = collection.find({key: {'$containsAny': [value0, value1, ...]}});
$containsNone : filter for documents(s) with property containing none of the provided values
var docArray = collection.find({key: {'$containsNone': [value0, value1, ...]}});
$regex : filter for document(s) with property matching provided regular expression
var docArray = collection.find({key: {'$regex': pattern}});
// var docArray = collection.find({key: {'$regex': [pattern, options]});
For example
var docArray = collection.find({key: { '$regex': 'din' }});
var docArray = collection.find({key: { '$regex': ['din', 'i'] }});
$dteq: filter for document(s) with date property equal to provided date value
var docArray = collection.find({key: {'$dteq': new Date('1/1/2017')}});
$type : filter for documents which have a property of a specified type
var docArray = collection.find({key: {'$type': value}}); // 'string', or 'number', ...
$size : filter for documents which have array property of specified size
var docArray = collection.find({key: {'$size': value}});
(does not work for strings)
$len : filter for documents which have string property of specified length
var docArray = collection.find({key: {'$len': value}});
$or : filter for documents which meet any of the nested subexpressions
var docArray = collection.find({'$or': [
{key0: {'$lt': value0}},
{key1: {'$gte': value1}},
// ...
]});
Find one document¶
var doc = collection.findOne({});
Filter by function¶
var docArray = collection.where(function(doc){
// ...
return isPicked;  // true to pick this document
})
Sort¶
Sort with a key
var docArray = collection.chain().find({}).simplesort(key).data();  // ascending
// var docArray = collection.chain().find({}).simplesort(key, {desc: true}).data();  // descending
Sort with mutiple keys
var docArray = collection.chain().find({}).compoundsort([key0, key1]).data();  // key0, key1: ascending
// var docArray = collection.chain().find({}).compoundsort([key0, [key1, true]]).data(); // key0: ascending, key1: descending
Sort with function
var docArray = collection.chain().find({}).sort(
function(doc1, doc2) {
return result; // 0, 1, -1
})
.data();
result:
0: equal
1: greater
-1: less
Pagination¶
Get documents from start to start+count-1.
var docArray = collection.chain().find({}).offset(start).limit(count).data();
Update¶
Update each filtered documents.
var docArray = collection.chain().find({}).update(
function(doc) {
//
return doc;
});
Remove¶
Remove filtered documents.
collection.chain().find({}).remove();
Map¶
Map document into a new anonymous collection, won't affect original collection.
var docArray = collection.chain().find({}).map(
function(doc) {
// ...
return doc
})
.data();
Map-reduce¶
Map document into a new anonymous collection
Run reduceFn to get final result value from result set of step 1.
var mapFn = function(doc) {
// ...
return doc
};
var reduceFn = function(docArray) {
// ...
return result;
}
var result = collection.chain().find({}).mapReduce(mapFn, reduceFn);
Clone result set¶
var resultSet = collection.chain().find({});
var resultSetClone = resultSet.branch();
// resultSetClone.find({}).data();
Dynamic view¶
Create dynamic view
var view = children.addDynamicView(name);
Add filters
find
view.applyFind({});
where
view.applyWhere(function(doc) { return true; });
simple sort
view.applySimpleSort(key);
sort by multiple keys
view.applySortCriteria([key0, key1]);
// view.applySortCriteria([key0, [key1, true]]);
sort function
view.applySort(function(doc1, doc2) {
return result; // 0, 1, -1
});
result:
0: equal
1: greater
-1: less
Get result data
var docArray = view.data();
Add new filters
var docArray = view.branchResultset().find({}).data();
Speed-up quering¶
Custom unique index¶
Define custom unique index
var collection = db.addCollection(name, {
unique: [key0]
});
Get document by custom unique index
var doc = collection.by(key0, value);
Binary indices¶
Define binary index
var collection = db.addCollection(name, {
indices: [key0]
});
Or
collection.ensureIndex(key);
Get documents by normal filters
var docArray = collection.find({key0: {'$gt': value}});
Methods of collection¶
Average value of a property
var avgValue = collection.avg(key);
Maximum value of a property
var maxValue = collection.max(key);
Minimum value of a property
var minValue = collection.min(key);
Median value of a property
var medianValue = collection.median(key);
Amount of documents
var amount = collection.count(query);  // {key: {'$gt': value}}
Serialize & Deserialize¶
Database as string
var s = db.serialize();
Load database from string
db.loadJSON(s);