const mongoose = require('mongoose');
const {MovieReaction } = require('../models');

const { Schema } = mongoose;

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  genres: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
  visits: {
    type: Number,
    default: 0,
  },
  imageUrl: String,
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
