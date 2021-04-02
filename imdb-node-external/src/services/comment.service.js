const { ObjectID } = require('mongodb');
const moment = require('moment');
const { Comment, Movie } = require('./../models');
const HttpError = require('../exceptions/exceptions');

const index = async ({ limit, offset, movieId }) => {
  const limitNum = parseInt(limit, 10) || 5;
  const offsetNum = parseInt(offset, 10) || 0;

  const comments = await Comment.find({ movie: movieId })
    .limit(limitNum)
    .skip(offsetNum)
    .populate('user')
    .sort({ createdAt: 'desc' })
    .exec();
  const count = await Comment.count({ movie: { $ne: null } });

  return {
    data: comments,
    count,
  };
};

const show = async ({ commentId }) => {
  if (!ObjectID.isValid(commentId)) {
    throw new HttpError(400, 'Mallformed id!');
  }

  try {
    const comment = await Comment.findById(commentId)
      .populate('user')
      .exec();

    if (!comment) {
      throw new HttpError(400, 'No comment with that id');
    }

    return comment;
  } catch (err) {
    throw err;
  }
};

const getSubComments = async ({ movieId, commentId }) => {
  if (!ObjectID.isValid(movieId && commentId)) {
    throw new HttpError(400, 'Mallformed id!');
  }

  try {
    const subComments = await Comment.findOne({ _id: commentId }, { subComments: 1 })
      .populate({ path: 'subComments', populate: { path: 'user', model: 'User' } })
      .exec();

    if (!subComments) {
      throw new HttpError(400, 'No comment with that id');
    }

    return subComments;
  } catch (err) {
    throw err;
  }
};

const store = async ({ movieId, comment }) => {
  if (!comment.text) {
    throw new HttpError(400, 'Provide comment text!');
  }

  const newComment = new Comment({
    text: comment.text,
    user: comment.user,
    createdAt: moment(),
    movie: movieId,
  });

  const savedComment = await newComment.save();
  await Movie.findByIdAndUpdate(
    movieId,
    { $push: { comments: savedComment._id } },
    { upsert: true, new: true },
  );

  return index({ movieId });
};

const createSubComment = async ({ commentId, comment }) => {
  if (!comment.text) {
    throw new HttpError(400, 'Provide comment text!');
  }

  const newComment = new Comment({
    text: comment.text,
    user: comment.user,
    createdAt: moment(),
  });

  const savedComment = await newComment.save();
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { $push: { subComments: savedComment._id } },
    { upsert: true, new: true },
  )
    .populate({ path: 'subComments', populate: { path: 'user', model: 'User' } })
    .exec();

  return updatedComment;
};

const update = async ({ commentId, comment }) => {
  if (!comment.text) {
    throw new HttpError(400, 'Comment text not provided!');
  }

  const newComment = {
    text: comment.text,
  };

  return Comment.findByIdAndUpdate(commentId, newComment, { upsert: true, new: true });
};

const destroy = async ({ movieId, commentId }) => {
  try {
    const commentDeleteResult = await Comment.findById(commentId)
      .remove()
      .exec();
    const movieCommentDeleteResult = await Movie.findByIdAndUpdate(movieId, {
      $pull: { comments: { $in: [commentId] } },
    });
    if (!commentDeleteResult || !movieCommentDeleteResult) {
      throw new HttpError(400, 'No genre with that id');
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
  getSubComments,
  createSubComment,
};
