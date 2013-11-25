// HAS MANY TASKS
// PARENT: USER
var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var kidSchema = new Schema({
    id: ObjectId,
    _user: {type: ObjectId, ref: 'Users'},
    avatar: {color: String, icon: String},
    name: String,
    points: Number,
    password: String,
    dateUpdated: String
});


module.exports = mongoose.model('Kids', kidSchema);