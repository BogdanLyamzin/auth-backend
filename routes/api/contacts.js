const express = require("express");
const createError = require("http-errors");

const {Contact, schemas} = require("../../models/contact");
const {authenticate} = require("../../middlewares");

const router = express.Router();

router.get("/", authenticate, async(req, res, next)=> {
    try {
        const {_id} = req.user;
        const result = await Contact.find({owner: _id}, "-owner -createdAt -updatedAt");
        res.json(result);
    } catch (error) {
        next(error);
    }
})

router.get("/:id", async(req, res, next)=> {
    try {
        const {id} = req.params;
        const result = await Contact.findById(id, "-owner -createdAt -updatedAt");
        if(!result){
            throw new createError(404, "Not found");
        }
        res.json(result);
    } catch (error) {
        if(error.message.includes("Cast to ObjectId failed")){
            error.status = 404;
        }
        next(error)
    }
})

router.post("/", authenticate, async(req, res, next)=> {
    try {
        const {error} = schemas.add.validate(req.body);
        if(error){
            throw new createError(400, error.message)
        }
        const data = {...req.body, owner: req.user._id};
        const result = await Contact.create(data);
        res.status(201).json(result)
    } catch (error) {
        if(error.message.includes("validation failed")){
            error.status = 400;
        }
        next(error);
    }
})

router.patch("/:id", async(req, res, next)=> {
    try {
        const {error} = schemas.add.validate(req.body);
        if(error){
            throw new createError(400, error.message)
        }
        const {id} = req.params;
        const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
        if(!result){
            throw new createError(404, "Not found")
        }
        res.json(result);
    } catch (error) {
        next(error)
    }
})

router.delete("/:id", async(req, res, next)=> {
    try {
        const {id} = req.params;
        const result = await Contact.findByIdAndDelete(id);
        if(!result){
            throw new createError(404, "Not found")
        }
        res.json({message: "Contact deleted"})
    } catch (error) {
        next(error);
    }
})

module.exports = router;