const mongoose = require('mongoose');

const { Schema } = mongoose;

const movieReactionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
      },
      reactionType: {
          type: String
      }
});

const MovieReaction = mongoose.model('MovieReaction', movieReactionSchema);

module.exports = MovieReaction;