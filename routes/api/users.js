const express = require("express");
const HttpError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User, schemas } = require("../../models/user");
const { authenticate } = require("../../middlewares")

const router = express.Router();

const {SECRET_KEY} = process.env;



router.post("/signup", async(req, res, next)=> {
    try {
        await User.deleteMany();
        const {error} = schemas.register.validate(req.body);
        if(error){
            throw new HttpError(400, error.message)
        }
        const {email, name, password} = req.body;
        const user = await User.findOne({email});
        if(user){
            throw new HttpError(409, "Email in use");
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const result = await User.create({name, email, password: hashPassword});
        const payload = {
            id: result._id
        }
        const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "1h"});
        await User.findByIdAndUpdate(result._id, {token});
        res.status(201).json({
            user: {
                name: result.name,
                email: result.email
            },
            token
        })
    } catch (error) {
        next(error)
    }
});

router.post("/login", async(req, res, next)=> {
    try {
        const {error} = schemas.login.validate(req.body);
        if(error){
            throw new HttpError(400, error.message)
        }
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            throw new HttpError(401, "Email or password is wrong");
        }
        const compareResult = await bcrypt.compare(password, user.password);
        if(!compareResult){
            throw new HttpError(401, "Email or password is wrong");
        }
        const payload = {
            id: user._id
        }
        const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "1h"});
        await User.findByIdAndUpdate(user._id, {token});
        res.json({
            user: {
                name: user.name,
                email: user.email
            },
            token,
        })
    } catch (error) {
        next(error);
    }
})

router.get("/current", authenticate, async (req, res, next) => {
    const {name, email, token} = req.user;
    res.json({
        user: {
            name,
            email
        },
        token
    })
});

router.post("/logout", authenticate, async (req, res, next) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.send({
        message: "Logout success"
    })
})

module.exports = router;