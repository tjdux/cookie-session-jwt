const {body, validationResult} = require('express-validator');

exports.signUpValidator = [
  body('email')
    .isEmail().withMessage("이메일 형식이 아닙니다.")
    .notEmpty().withMessage("이메일이 없습니다."),
  body("password")
    .isLength({min: 6}).withMessage("비밀번호가 6글자 이하")
    .notEmpty().withMessage("비밀번호가 없습니다."),
  body("nickname")
    .notEmpty().withMessage("이름이 없습니다.")
]

// 로그인 입력 검사 시
exports.loginValidator = [
  body('email')
    .isEmail().withMessage("이메일 형식이 아닙니다.")
    .notEmpty().withMessage("이메일이 없습니다."),
  body("password")
    .isLength({min: 6}).withMessage("비밀번호가 6글자 이하")
    .notEmpty().withMessage("비밀번호가 없습니다.")
];

exports.handleValidationResult = (req, res, next) => {
  const result = validationResult(req).errors;

  // 입력 오류가 있는 경우 
  if (result.length){
    const extractedError = result.map(err => err.msg)
    console.log(extractedError)
    return next(new Error("InputValidation"))
  }

  next()
};