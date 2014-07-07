// PARENT: KID
// PARENT: TASK
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var transactionSchema = new Schema({
    id: ObjectId,
    date: String,
    value: Number,
    _user: {type: ObjectId, ref: 'Users' },
    _task: {type: ObjectId, ref: 'Tasks' },
    _kid: {type: ObjectId, ref: 'Kids' },
    approved: { type: Boolean, default: false },
    dateUpdated: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Transactions', transactionSchema);
