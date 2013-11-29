var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var userSchema = new Schema({
    id: ObjectId,
    name: {type: String, default: 'Parent'},
    avatar: {color: {type: String, default: 'green'}, icon: {type: String, default: 'band-aid'}, img: String},
    email: String,
    password: String,
    tasks: [module.exports.taskSchema],
    kids: [module.exports.kidSchema],
    parents: [{name: String, avatar: String, passcode: String}]
});


module.exports = mongoose.model('Users', userSchema);