const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticate-middleware')
require('dotenv').config()

router.get('/set-session', (req, res) => {
  console.log(req.session.users)
  if (!req.session.users){
    req.session.users = 1;
  } else {
    req.session.users += 1;
  }
  res.send({
    "접속 유저 수": req.session.users,
  })
})

// 토큰 생성
router.get('/login', (req, res, next) => {
  // const {username, password} = req.params;
  // req.session.user = {
  //   username: user.username,
  //   loginAt: new Date().toString()
  // }
  const user = {
    id: 1,
    username: "john",
    role: "user"
  }

  const token = jwt.sign(user, process.env.SECRET_KEY, {
    expiresIn: '5s'
  })
  console.log(token);

  return res.json({
    token
  })
})

router.get('/user', authenticateToken, (req, res, next) => {
  console.log(req.user);
  // next(new Error("existing email"));
})

router.get('/set-cookie', (req, res) => { 
  res.cookie("login", "true");
  return res.send("cookie set")
})

router.get('/get-cookie', (req, res) => {
  const cookies = req.cookies
  return res.json({
    cookies
  })
})

module.exports = router;