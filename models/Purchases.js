var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var purchaseSchema = new Schema({
    id: ObjectId,
    _reward: {type: ObjectId, ref: 'Rewards' },
    _kid: {type: ObjectId, ref: 'Kids' },
    price: Number
});


module.exports = mongoose.model('Purchases', purchaseSchema);
