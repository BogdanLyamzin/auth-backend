const {Schema, model} = require("mongoose");
const Joi = require("joi");

const bookSchema = Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true,
    },
    favorite: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, {versionKey: false, timestamps: true});

const joiAddSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    favorite: Joi.boolean(),
})

const Book = model("product", bookSchema);

module.exports = {
    Book,
    schemas: {
        add: joiAddSchema
    }
};