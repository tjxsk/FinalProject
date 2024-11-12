const express = require('express');
const axios = require('axios');
const multer = require('multer');
const router = new express.Router();
const bookModel = require('../model/bookModel');
const verifyToken = require('../middleware/verifyToken');
const openCageAPI = process.env.openCageAPI;


router.use(express.json());
router.use(express.urlencoded({ extended: true }));


// middleware to convert coordinates to Readable Location
// const getLocationName = async (latitude, longitude) => {
//     try {
//         const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
//             params: {
//                 q: `${latitude},${longitude}`,
//                 key: openCageAPI
//             }
//         });

//         const { data } = response;
//         return data.results[0]?.formatted || 'Unknown Location';
//     } catch (error) {
//         console.error("Error fetching location name:", error);
//         return 'Unknown Location';
//     }
// };

// coordinates to location name
// router.get('/getLocation', verifyToken, async (req, res) => {
//     const { latitude, longitude } = req.query;
//     try {
//         const locationName = await getLocationName(latitude, longitude); 
//         res.json({ location: locationName });
//     } catch (error) {
//         console.error('Error fetching location:', error);
//         res.status(500).json({ error: 'Unable to fetch location' });
//     }
// });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// get operation
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const data = await bookModel.findById(id);
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send('DATA NOT FOUND');
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const data = await bookModel.find().sort({ date: -1 });
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send('DATA NOT FOUND');
    }
});


// get operation for nearby books

// router.get('/nearby', verifyToken, async (req, res) => {
//     const { latitude, longitude } = req.query;
//     const lat = parseFloat(latitude);
//     const long = parseFloat(longitude);

//     try {
//         const books = await bookModel.aggregate([
//             {
//                 $geoNear: {
//                     near: {
//                         type: "Point",
//                         coordinates: [long, lat]
//                     },
//                     distanceField: "distance",
//                     maxDistance: 10000, // 10 km in meters
//                     spherical: true
//                 }
//             }
//         ]);

//         res.status(200).json(books);
//     } catch (error) {
//         console.error("Error fetching nearby books:", error);
//         res.status(500).json({ message: 'Error fetching nearby books' });
//     }
// });


//  post operation
router.post('/addBook', verifyToken, upload.single('bookImage'), async (req, res) => {
    try {
        const { bookName, bookAuthor, isAvailable} = req.body;

        // const locationName = await getLocationName(latitude, longitude);
        console.log("Request User ID:", req.userId);

        const newBookData = {
            bookName,
            bookAuthor,
            isAvailable: isAvailable === 'true',
            // location: {
            //     type: 'Point',
            //     coordinates: [parseFloat(longitude), parseFloat(latitude)],
            //     name: locationName 
            // },
            bookOwner: req.userId,
            bookImage: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        };

        const newBook = new bookModel(newBookData);
        await newBook.save();
        res.status(201).json({ message: 'Book added successfully' });
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ message: 'Error adding book' });
    }
});

//  put operation
router.put('/updateBook/:id', verifyToken, upload.single('bookImage'), async (req, res) => {
    try {
        const { bookName, bookAuthor, isAvailable } = req.body;

        const book = await bookModel.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Updating
        if (bookName) book.bookName = bookName;
        if (bookAuthor) book.bookAuthor = bookAuthor;
        if (typeof isAvailable !== 'undefined') book.isAvailable = JSON.parse(isAvailable); // Convert string to boolean
        if (req.file) {
            book.bookImage.data = req.file.buffer;
            book.bookImage.contentType = req.file.mimetype;
        }

        await book.save();
        res.status(200).json({ message: 'Book updated successfully', book });
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ message: 'Error updating book' });
    }
});

//   delete operation
router.delete('/deleteBook/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const data = await bookModel.findByIdAndDelete(id, req.body);
        res.status(200).send('Successfully deleted');
    } catch (error) {
        res.status(400).send('delete unsuccessfull');
    }
});



module.exports = router;