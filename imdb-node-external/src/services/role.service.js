const { ObjectID } = require('mongodb');
const { Roles, Genre } = require('./../models');
const HttpError = require('../exceptions/exceptions');

const index = async () => Roles.find().exec();

const show = async id => {
  if (!ObjectID.isValid(id)) {
    throw new HttpError(400, 'Mallformed id!');
  }

  try {
    const role = await Roles.findOne({ _id: id }).exec();

    if (!role) {
      throw new HttpError(400, 'No role with that id');
    }

    return role;
  } catch (err) {
    throw err;
  }
};

const findByName = async name => {
  if (!name) {
    throw new HttpError(400, 'Provide role name!');
  }

  try {
    const role = await Roles.findOne({ name }).exec();

    if (!role) {
      throw new HttpError(400, 'No role with that id');
    }

    return role;
  } catch (err) {
    throw err;
  }
};
const store = ({ name }) => {
  if (!name) {
    throw new HttpError(400, 'Role name not provided!');
  }

  const role = new Roles({
    name,
  });

  return role.save();
};

const update = async (id, { name }) => {
  if (!name) {
    throw new HttpError(400, 'Role name not provided!');
  }

  const newRole = {
    name,
  };

  const updatedGenre = await Genre.findByIdAndUpdate(id, newRole, { upsert: true, new: true });
  return updatedGenre;
};

const destroy = async id => {
  try {
    const deleteResult = await Roles.find({ _id: id })
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
  findByName,
  store,
  update,
  destroy,
};
