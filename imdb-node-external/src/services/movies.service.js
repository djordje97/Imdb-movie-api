const { ObjectID } = require('mongodb');
const { Movie, WatchLists, MovieReaction } = require('./../models');
const HttpError = require('../exceptions/exceptions');
const { me } = require('./../services/user.service');
const { getWatchList } = require('./../services/user.service');

const index = async queryParamObject => {
  // eslint-disable-next-line prefer-const
  let { limit, offset, ...rest } = queryParamObject;
  limit = Number(limit) || 5;
  offset = Number(offset) || 0;
  const query = queryBuilder(rest);

  const data = await Movie.find(query)
    .limit(limit)
    .skip(offset)
    .exec();
  const count = await Movie.find(query).count();

  return {
    data,
    count,
  };
};

const queryOptions = {
  regex: value => ({ $regex: new RegExp(`.*^${value.toLowerCase()}.*`, 'i') }),
  in: value => ({ $in: [value] }),
};

const fieldOptionMap = {
  title: {
    query: queryOptions.regex,
  },
  genres: {
    query: queryOptions.in,
  },
};

const fieldOptionMapper = (field, value) => fieldOptionMap[field].query(value);

const queryBuilder = queryParamObject => {
  const query = queryParamObject;
  delete query.limit;
  delete query.offset;

  return Object.keys(queryParamObject).reduce(
    (acc, key) => ({ ...acc, [key]: fieldOptionMapper(key, query[key]) }),
    {},
  );
};

const show = async id => {
  if (!ObjectID.isValid(id)) {
    throw new HttpError(400, 'Mallformed id!');
  }
  try {
    const movie = await Movie.findByIdAndUpdate(
      id,
      { $inc: { visits: 1 } },
      { upsert: true, new: true },
    ).populate('genres');
    if (!movie) {
      throw new HttpError(400, 'No movie with that id');
    }
    return movie;
  } catch (err) {
    throw err;
  }
};

const store = ({ title, description, imageUrl, genres }) => {
  if (!title || !description) {
    throw new HttpError(400, 'Title or description missing');
  }

  const movie = new Movie({
    title,
    description,
    imageUrl,
    genres,
  });

  return movie.save().then(newMovie => newMovie.populate('genres').execPopulate());
};

const update = async (id, { title, description, imageUrl, genres }) => {
  if (!title || !description) {
    throw new HttpError(400, 'Title or description missing');
  }

  const newMovie = {
    title,
    description,
    imageUrl,
    genres,
  };

  const updatedMovie = await Movie.findByIdAndUpdate(id, newMovie, {
    upsert: true,
    new: true,
  }).populate('genres');
  return updatedMovie;
};

const destroy = async id => {
  try {
    const deleteResult = await Movie.find({ _id: id })
      .remove()
      .exec();
    if (!deleteResult) {
      throw new HttpError(400, 'No movie with that id');
    }
  } catch (err) {
    throw err;
  }
};

const addToWatchList = async (movieId, token) => {
  if (!ObjectID.isValid(movieId)) {
    throw new HttpError(400, 'Mallformed id!');
  }

  try {
    const newWatchListItem = new WatchLists({
      user: me(token)._id,
      movie: movieId,
    });

    await newWatchListItem.save();
    return await getWatchList(token);
  } catch (err) {
    throw err;
  }
};

const removeFromWatchList = async (movieId, token) => {
  if (!ObjectID.isValid(movieId)) {
    throw new HttpError(400, 'Mallformed id!');
  }

  try {
    const deleteResult = await WatchLists.find({ movie: movieId, user: me(token)._id })
      .remove()
      .exec();
    if (!deleteResult) {
      throw new HttpError(400, 'No such watch list item!');
    }
    return await getWatchList(token);
  } catch (err) {
    throw err;
  }
};


const getRelatedMovies = async({genres}) =>{
  try{
    const relatedMovies = await Movie.find({"genres" : {
      $in: genres
    }}).exec();
    return relatedMovies;
  } catch (err){
    throw err;
  }
}

const reactOnMovie = async (movieId, {userId, reactionType}, token)  =>{
    try {
      if (!ObjectID.isValid(movieId)) {
        throw new HttpError(400, 'Mallformed id!');
      }

      const reaction = await MovieReaction.findOne({
        movie: movieId,
        user: me(token)._id
      }).exec();


      if(!reaction) {
        const newReaction = new MovieReaction ({
          movie: movieId,
          user: me(token)._id,
          reactionType : reactionType
        });
        await newReaction.save()
      } else  {
         await MovieReaction.remove({_id : reaction._id}).exec();
      } 
      const numberOfLikes = await getNumberOfLikesOrDislikes(movieId, 'LIKE');
      const numberOfDislikes = await getNumberOfLikesOrDislikes(movieId, 'DISLIKE');
      const updatedMovie = await updateMovieLikesAndDislikes(movieId, numberOfLikes, numberOfDislikes);
    
      return updatedMovie;

    } catch (err) {
      throw err;
    }
}

const getTopRated = async () =>
  Movie.find()
    .sort({ likes: -1 })
    .limit(10)
    .exec();

const getNumberOfLikesOrDislikes = async(movieId, reactionType) =>{
 return await MovieReaction.find({
    movie: movieId,
    reactionType: reactionType
  }).count().exec();
}

const updateMovieLikesAndDislikes = async (movieId, likesNumber, dislikesNumber) => {
  await Movie.update({_id: movieId
  }, {
    likes: likesNumber,
    dislikes: dislikesNumber
  }).exec();
  const updatedMovie = Movie.findById(movieId);
  return updatedMovie;
}
module.exports = {
  index,
  show,
  store,
  update,
  destroy,
  addToWatchList,
  removeFromWatchList,
  getTopRated,
  getRelatedMovies,
  reactOnMovie
};
