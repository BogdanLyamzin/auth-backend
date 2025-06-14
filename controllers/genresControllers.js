import { genreList } from "../constants/movie-constants.js";

const getAll = (req, res)=> {
    res.json(genreList);
}

export default {
    getAll,
}