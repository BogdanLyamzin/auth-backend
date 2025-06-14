import { DataTypes } from "sequelize";

import Sequelize from "../Sequelize.js";

import { typeList } from "../../constants/movies.js";

const Movie = Sequelize.define(
    "movie",
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "У фільма має бути назва"
                }
            }
        },
        director: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        favorite: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        type: {
            type: DataTypes.ENUM(...typeList),
            defaultValue: "film",
            allowNull: false,
        },
        releaseYear: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        owner: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }
);

// Movie.sync({force: true});

export default Movie;