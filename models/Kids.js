// HAS MANY TASKS
// PARENT: USER
var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var kidSchema = new Schema({
    id: ObjectId,
    _user: {type: ObjectId, ref: 'Users'},
    avatar: {color: {type: String, default: 'red'}, icon: {type: String, default: 'headphones'}, img: String},
    name: String,
    points: {type: Number, default: 0},
    passcode: String,
    dateUpdated: String
});


module.exports = mongoose.model('Kids', kidSchema);
