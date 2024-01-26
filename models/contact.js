const {Schema, model} = require("mongoose");
const Joi = require("joi");

const contactSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    number: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, {versionKey: false, timestamps: true});

const joiAddSchema = Joi.object({
    name: Joi.string().required(),
    number: Joi.string().required(),
})

const Contact = model("contact", contactSchema);

module.exports = {
    Contact,
    schemas: {
        add: joiAddSchema
    }
};