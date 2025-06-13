const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticate-middleware')
const prisma = require('../utils/prisma/index')
const bcrypt = require('bcrypt')

const {signUpValidator, handleValidationResult, loginValidator} = require('../middleware/validation-middleware')
require('dotenv').config()

/** 회원가입
 *  1. 닉네임, 이메일, 비밀번호 입력 검증
 *  1-1. 비밀번호 6글자 이상
 *  1-2. 이메일 중복 확인
 *  2. 데이터 베이스에 저장 
 */



// 회원가입
router.post('/sign-up', signUpValidator, handleValidationResult,  async (req, res, next) => {
  const { email, password, nickname } = req.body;

  try {
    // 1-2. 이메일 중복 확인
    const user = await prisma.user.findFirst({
      where: { email }
    })

    if(user){    
      return next(new Error("ExistingEmail"))
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    // salt: 생성될 때마다 값이 변경됨

    const bycrytPassword = await bcrypt.hash(password, salt)

    // 2. 데이터 베이스에 저장
    await prisma.user.create({
      data: {
        email,
        password: bycrytPassword,
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

/** 로그인 API
 * 1. 이메일, 비밀번호 입력 여부 확인 
 * 2. 이메일에 해당하는 사용자 찾기 
 * 3. 사용자 존재 여부 확인
 * 4. 비밀번호 일치 여부 확인 
 * 5. jwt 토큰 발급 
 * 6. jwt 토큰 전달 
*/

//  로그인, 토큰 생성
router.post('/login', loginValidator, handleValidationResult, async (req, res, next) => {
  const { email, password } = req.body;
  
  const user = await prisma.user.findUnique({
    where: { email } 
  })

  if(!user){    
    return next(new Error("UserNotFound"))
  }

  const isPasswordVerified = await bcrypt.compare(password, user.password)
  if (!isPasswordVerified){
    return next(new Error("passwordError"))
  }

  const token = jwt.sign({
    userId: user.userId
  }, process.env.SECRET_KEY, {
    expiresIn: '10h'
  })

  return res.status(200).send({
    token
  })
})

router.get('/user', authenticateToken, (req, res, next) => {
  console.log(req.user);
  // next(new Error("existing email"));
  res.send(req.user);
})

// 쿠키 설정
router.get('/set-cookie', (req, res) => { 
  res.cookie("login", "true");
  return res.send("cookie set")
})

// 쿠키 가져오기
router.get('/get-cookie', (req, res) => {
  const cookies = req.cookies
  return res.json({
    cookies
  })
})

module.exports = router;