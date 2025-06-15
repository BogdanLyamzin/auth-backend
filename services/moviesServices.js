import Movie from "../models/Movie.js";

import { sortList } from "../constants/index.js";

import { calcPaginationData } from "../helpers/calcPaginationData.js";

export const getMovies = async ({
  page = 1,
  perPage = 10,
  sortBy = "_id",
  sortOrder = sortList[0],
  filters = {},
}) => {
  const skip = (page - 1) * perPage;
  const movieQuery = Movie.find();

  if (filters.owner) {
    movieQuery.where("owner").equals(filters.owner);
  }

  if (filters.genre) {
    movieQuery.where("genre").equals(filters.genre);
  }

  if (filters.minReleaseYear) {
    movieQuery.where("releaseYear").gte(filters.minReleaseYear);
  }

  if (filters.maxReleaseYear) {
    movieQuery.where("releaseYear").lte(filters.maxReleaseYear);
  }

  const totalItems = await Movie.find()
    .merge(movieQuery)
    .countDocuments();

  const items = await movieQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  const paginationData = calcPaginationData({ page, perPage, totalItems });

  return {
    items,
    totalItems,
    ...paginationData,
  };
  // return Movie.find(filter, "-createdAt -updatedAt", settings).populate("owner", "username email");
};

export const getOneMovie = (filter) => Movie.findOne(filter);

export const addMovie = (data) => Movie.create(data);

export const updateOneMovie = async (filter, data) =>
  Movie.findOneAndUpdate(filter, data);

export const deleteOneMovie = (filter) => Movie.findOneAndDelete(filter);
