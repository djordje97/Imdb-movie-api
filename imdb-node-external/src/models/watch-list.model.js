const mongoose = require('mongoose');

const { Schema } = mongoose;

const watchListsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  movie: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
  },
});

const WatchLists = mongoose.model('WatchLists', watchListsSchema);

module.exports = WatchLists;
