const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticate-middleware')
const prisma = require('../utils/prisma/index')
const { body } = require('express-validator');
require('dotenv').config()

/** 회원가입
 *  1. 닉네임, 이메일, 비밀번호 입력 검증
 *  1-1. 비밀번호 6글자 이상
 *  1-2. 이메일 중복 확인
 *  2. 데이터 베이스에 저장 
 */

// 회원가입
router.post('/sign-up', body('email').notEmpty(),  async (req, res, next) => {
  const { email, password, nickname } = req.body;

  // 1. 닉네임, 이메일, 비밀번호 입력 검증
  if (!email || !password || !nickname) {
    return next(new Error("InputValidation"))
  }

  // 1-1. 비밀번호 6글자 이상
  if (password.length < 6) {
    return next(new Error("PasswordValidation"))
  }


  try {
    // 1-2. 이메일 중복 확인
    const user = await prisma.user.findFirst({
      where: { email }
    })

    if(user){    
      return next(new Error("ExistingEmail"))
    }

    // 2. 데이터 베이스에 저장
    await prisma.user.create({
      data: {
        email,
        password,
        nickname
      }
    })

    return res.status(201).json({
      message: "회원가입 완료"
  })
  } catch (e) {
    return next(new Error("DataBaseError"))
  }
})

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
  const user = {
    id: 1,
    username: "john",
    role: "user"
  }

  const token = jwt.sign(user, process.env.SECRET_KEY, {
    expiresIn: '5h'
  })
  console.log(token);

  return res.json({
    token
  })
})

router.get('/user', authenticateToken, (req, res, next) => {
  console.log(req.user);
  // next(new Error("existing email"));
  res.send(req.user);
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

const signUpValidator = [
  body('email')
    .isEmail().withMessage("이메일 형식이 아닙니다.")
    .notEmpty().withMessage("이메일이 없습니다.")
]

module.exports = router;