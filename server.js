const express = require('express');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Article = require('./models/article');
const User = require('./models/user');
const path = require('path');
const articleRouter = require('./routes/articles');
const userRouter = require('./routes/user');
const methodOverride = require('method-override');
const app = express();
const { signup, signin } = require('./controllers/auth.controllers.js');
const { verifyToken } = require('./middlewares/auth.js');

require('dotenv').config();

const PORT = process.env.PORT;

mongoose
  .connect(process.env.dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    app.listen(PORT, () => {
      console.log(`connected to db and running on ${PORT}`);
    })
  )
  .catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));
app.use(express.static('views'));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/views'));
app.use(express.static(path.join(__dirname, 'views')));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.render('articles/home');
});

app.use('/articles', articleRouter);
app.use('/user', userRouter);
