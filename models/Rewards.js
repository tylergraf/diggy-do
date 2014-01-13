// PARENT: KID
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var rewardSchema = new Schema({
    id: ObjectId,
    name: String,
    value: Number,
    avatar: {color: {type: String, default: 'red'}, icon: {type: String, default: 'headphones'}, img: String},
    _user: {type: ObjectId, ref: 'Users' }    
});


module.exports = mongoose.model('Rewards', rewardSchema);