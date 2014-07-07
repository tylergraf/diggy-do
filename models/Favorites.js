// HAS MANY TASKS
// PARENT: USER
var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var favoriteSchema = new Schema({
    id: ObjectId,
    _reward: {type: ObjectId, ref: 'Rewards' },
    _kid: {type: ObjectId, ref: 'Kids' }
});


module.exports = mongoose.model('Favorites', favoriteSchema);
