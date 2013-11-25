// PARENT: KID
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var taskSchema = new Schema({
    id: ObjectId,
    name: String,
    value: Number,
    _kid: {type: ObjectId, ref: 'Kids' },
    _user: {type: ObjectId, ref: 'Users' },
    completed: Boolean,
    type: String,
    due: Date,
    repeated: { monday: Boolean, tuesday: Boolean, wednesday: Boolean, thursday: Boolean, friday: Boolean, saturday: Boolean, sunday: Boolean },
    
    done: Boolean,
    transactionId: String,
    approved: Boolean
});


module.exports = mongoose.model('Tasks', taskSchema);