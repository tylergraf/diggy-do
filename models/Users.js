var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var userSchema = new Schema({
    id: ObjectId,
    email: String,
    password: String,
    tasks: [module.exports.taskSchema],
    kids: [module.exports.kidSchema],
    parents: [{name: String, avatar: String, passcode: String}]
});


module.exports = mongoose.model('Users', userSchema);