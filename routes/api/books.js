const express = require("express");
const createError = require("http-errors");

const {Book, schemas} = require("../../models/book");
const {authenticate} = require("../../middlewares");

const router = express.Router();

router.get("/", authenticate, async(req, res, next)=> {
    try {
        const {_id} = req.user;
        const result = await Book.find({owner: _id}).populate("owner", "email");
        res.json(result);
    } catch (error) {
        next(error);
    }
})

router.get("/:id", async(req, res, next)=> {
    try {
        const {id} = req.params;
        const result = await Book.findById(id);
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
        const result = await Book.create(data);
        res.status(201).json(result)
    } catch (error) {
        if(error.message.includes("validation failed")){
            error.status = 400;
        }
        next(error);
    }
})

router.put("/:id", async(req, res, next)=> {
    try {
        const {error} = schemas.add.validate(req.body);
        if(error){
            throw new createError(400, error.message)
        }
        const {id} = req.params;
        const result = await Book.findByIdAndUpdate(id, req.body, {new: true});
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
        const result = await Book.findByIdAndDelete(id);
        // findByIdAndDelete => findOneAndDelete
        // findByIdAndRemove => findAndModify
        if(!result){
            throw new createError(404, "Not found")
        }
        res.json({message: "Product deleted"})
    } catch (error) {
        next(error);
    }
})

module.exports = router;