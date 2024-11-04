const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.CONNECTION_PATH)
.then(() => {
    console.log('connection established');
}).catch(() => {
    console.log('error in conection');
});
