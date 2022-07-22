const {Schema, model} = require("mongoose");
const Joi = require("joi");

const productSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
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
    name: Joi.string().required(),
    price: Joi.number().min(0.01).required(),
    description: Joi.string().required(),
})

const Product = model("product", productSchema);

module.exports = {
    Product,
    schemas: {
        add: joiAddSchema
    }
};