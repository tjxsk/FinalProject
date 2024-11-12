const express =  require('express');
const bookRouter = require('./routes/bookRoutes');
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const storyRouter =  require('./routes/storyRoutes');

const cors = require('cors');
require('./db/connection');

const app = new express();

app.use(cors());
app.use('/books',bookRouter); // redirecting to routes
app.use('/user', userRouter);
app.use('/posts', postRouter);
app.use('/', storyRouter);










const PORT = 3000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});