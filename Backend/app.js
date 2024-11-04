const express =  require('express');
// const router = require('./routes/routes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
require('./db/connection');

const app = new express();

app.use(cors());
app.use('/',router); // redirecting to routes
app.use('/user', userRoutes);










const PORT = 3000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});