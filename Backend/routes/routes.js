const express = require('express');
const router = new express.Router();
const courseModel = require('../model/courseModel');
const jwt = require('jsonwebtoken');


router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// adding middleware

function verifyToken(req,res,next) {
    let token = req.headers.token;
    try {
        if (!token) throw 'Unauthorized Access'
        let payload = jwt.verify(token, "secretkey")
        if (!payload) throw 'Unauthorized Access'
        next()
    }  catch (error) {
        res.json({message: error})
    }
}

// get operation
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const data = await courseModel.findById(id);
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send('DATA NOT FOUND');
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const data = await courseModel.find();
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send('DATA NOT FOUND');
    }
});

//  post operation
router.post('/add', verifyToken, async (req, res) => {
    try {
        const data = await courseModel.create(req.body);
        res.status(201).send('Successfully added');
    } catch (error) {
        res.status(400).send('post unsuccessfull');
    }
});

//  put operation
router.put('/edit/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const data = await courseModel.findByIdAndUpdate(id, req.body);
        res.status(200).send('Successfully updated');
    } catch (error) {
        res.status(400).send('update unsuccessfull');
    }
});

//   delete operation
router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const data = await courseModel.findByIdAndDelete(id, req.body);
        res.status(200).send('Successfully deleted');
    } catch (error) {
        res.status(400).send('delete unsuccessfull');
    }
});











module.exports = router;