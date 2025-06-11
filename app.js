const express = require('express');
const userRouter = require('./routers/userRouter');
require('dotenv').config()

const cookieParser = require('cookie-parser');

const session = require('express-session')
const fileStore = require('session-file-store')(session);

const errorHandlingMiddleware = require('./middleware/error-handling-middleware')

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.use(session({
  resave: false,
  cookie: {
    httpOnly: true
  },
  saveUninitialized: true,
  secret: process.env.SECRET,
  store: new fileStore()
}))

app.use('/', userRouter)

// error-handling middleware
app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})