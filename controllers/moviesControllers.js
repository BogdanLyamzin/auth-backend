import * as moviesServices from "../services/moviesServices.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import HttpError from "../helpers/HttpError.js";

import { parsePaginationParams } from '../helpers/parsePaginationParams.js';
import { parseSortParams } from '../helpers/parseSortParams.js';
import { parseMovieFilterParams } from '../helpers/filters/parseMovieFilterParams.js';

import { movieSortFields } from '../models/Movie.js';

const getAll = async (req, res) => {
    const paginationParams = parsePaginationParams(req.query);
    const sortParams = parseSortParams(req.query, movieSortFields);
    const filters = parseMovieFilterParams(req.query);
    filters.owner = req.user._id;
    const result = await moviesServices.getMovies({...paginationParams, ...sortParams, filters});

    res.json(result);
}

const getById = async (req, res) => {
    const { id } = req.params;
    const {_id: owner} = req.user;
    const result = await moviesServices.getOneMovie({_id: id, owner});

    if (!result) {
        throw HttpError(404, `Movie with id=${id} not found`);
    }

    res.json(result);
}

const add = async (req, res) => {
    const {_id: owner} = req.user;
    const result = await moviesServices.addMovie({...req.body, owner});

    res.status(201).json(result);
}

const updateById = async (req, res) => {
    const { id } = req.params;
    const {_id: owner} = req.user;
    const result = await moviesServices.updateOneMovie({_id: id, owner}, req.body);
    if (!result) {
        throw HttpError(404, `Movie with id=${id} not found`);
    }

    res.json(result);
}

const deleteById = async (req, res) => {
    const { id } = req.params;
    const {_id: owner} = req.user;

    const result = await moviesServices.deleteOneMovie({_id: id, owner});
    if (!result) {
        throw HttpError(404, `Movie with id=${id} not found`);
    }

    // res.status(204).send();

    res.json({
        message: "Delete success"
    })
}

export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    deleteById: ctrlWrapper(deleteById),
}