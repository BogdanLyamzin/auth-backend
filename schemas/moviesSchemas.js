import Joi from "joi";

import { genreList } from "../constants/movie-constants.js";

export const movieAddSchema = Joi.object({
    title: Joi.string().required().messages({
        "any.required": "title must be exist"
    }),
    director: Joi.string().required(),
    favorite: Joi.boolean(),
    genre: Joi.string().valid(...genreList).required(),
    releaseYear: Joi.number().min(1895).required(),
})

export const movieUpdateSchema = Joi.object({
    title: Joi.string(),
    director: Joi.string(),
    favorite: Joi.boolean(),
    genre: Joi.string().valid(...genreList),
    releaseYear: Joi.number().min(1985),
})