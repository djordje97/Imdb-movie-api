const mongoose = require('mongoose');
const moment = require('moment');

const { Schema } = mongoose;

const commentsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  movie: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
  },
  subComments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
  text: {
    type: String,
    required: true,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: moment(),
  },
});

const Comments = mongoose.model('Comments', commentsSchema);

module.exports = Comments;
