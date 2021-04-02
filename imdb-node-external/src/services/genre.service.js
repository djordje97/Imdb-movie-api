const { ObjectID } = require('mongodb');
const { Genre } = require('./../models');
const HttpError = require('../exceptions/exceptions');

const index = async () => {
  const genres = await Genre.find().exec();
  const count = await Genre.count();

  return {
    data: genres,
    count,
  };
};

const show = async id => {
  if (!ObjectID.isValid(id)) {
    throw new HttpError(400, 'Mallformed id!');
  }

  try {
    const genre = await Genre.findOne({ _id: id }).exec();

    if (!genre) {
      throw new HttpError(400, 'No movie with that id');
    }

    return genre;
  } catch (err) {
    throw err;
  }
};

const store = ({ name }) => {
  if (!name) {
    throw new HttpError(400, 'Genre name not provided!');
  }

  const genre = new Genre({
    name,
  });

  return genre.save();
};

const update = async (id, { name }) => {
  if (!name) {
    throw new HttpError(400, 'Genre name not provided!');
  }

  const newGenre = {
    name,
  };

  const updatedGenre = await Genre.findByIdAndUpdate(id, newGenre, { upsert: true, new: true });
  return updatedGenre;
};

const destroy = async id => {
  try {
    const deleteResult = await Genre.find({ _id: id })
      .remove()
      .exec();
    if (!deleteResult) {
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
};
