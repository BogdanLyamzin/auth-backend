import {Schema, model} from "mongoose";

import { handleSaveError, setUpdateOptions } from "./hooks.js";

import { genreList, releaseYearRegexp } from "../constants/movie-constants.js";

const movieSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    genre: {
        type: String,
        enum: genreList,
        required: true,
    },
    releaseYear: {
        type: Number,
        min: 1895,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }
}, {versionKey: false, timestamps: true});

movieSchema.post("save", handleSaveError);

movieSchema.pre("findOneAndUpdate", setUpdateOptions);

movieSchema.post("findOneAndUpdate", handleSaveError);

export const movieSortFields = [
    'title',
    'director',
    'favorite',
    'genre',
    'releaseYear',
  ];

const Movie = model("movie", movieSchema);

export default Movie;