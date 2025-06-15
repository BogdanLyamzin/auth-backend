import { genreList } from "../../constants/movie-constants.js";

const parseNumber = value => {
    if(typeof value !== "string") return;

    const parsedNumber = parseInt(value);
    if(Number.isNaN(parsedNumber)) return;

    return parsedNumber;
}

export const parseMovieFilterParams = ({minReleaseYear, maxReleaseYear, genre})=> {
    const parsedMinReleaseYear = parseNumber(minReleaseYear);
    const parsedMaxReleaseYear = parseNumber(maxReleaseYear);

    const parsedGenre = genreList.includes(genre) ? genre : undefined;

    return {
        minReleaseYear: parsedMinReleaseYear,
        maxReleaseYear: parsedMaxReleaseYear,
        genre: parsedGenre,
    };
};