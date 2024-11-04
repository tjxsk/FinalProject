const express = require('express');
const userRoutes = new express.Router();
const jwt =  require('jsonwebtoken');

const userModel = require('../model/userModel');

userRoutes.use(express.json());
userRoutes.use(express.urlencoded({ extended: true }));

userRoutes.post('/login', async (req,res) => {
    const user = await userModel.findOne({username: req.body.userName})
    if(!user) {
        res.json({message:"user not found"})
    }
    try {
        if(user.password == req.body.password)
        {
            const payload = {uname: req.body.username, pwd: req.body.password};
            const token = jwt.sign(payload, 'secretkey')
            res.status(200).send({message: 'Login Successful',usertoken: token})
        }
    } catch (err) {
        console.log(err)
    }
})





module.exports = userRoutes;