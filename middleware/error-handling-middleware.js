module.exports = function (err, req, res, next) {
  console.error(err.message)
  switch(err.message){
    case 'passwordError': 
      return res.status(400).send({
        errorMessage: "일치하지 않는 비밀번호"
      })
    case 'ExistingEmail':
      return res.status(400).send({
        errorMessage: "가입된 이메일"
      })
    case "Forbidden":
      return res.status(401).send({
        errorMessage: "접근 권한이 없습니다."
      })
    case "UserNotFound":
      return res.status(404).send({
        errorMessage: "존재하지 않는 유저"
      })
    case "Need login":
    case "accessTokenNotMatched":
      return res.status(401).send({
        errorMessage: "로그인을 해주세요"
      })
    case "InputValidation":
    case "PasswordValidation":
      return res.status(401).send({
        errorMessage: "입력된 요청이 잘못되었습니다."
      })
    case "DataBaseError":
      return res.status(500).send({
        errorMessage: "데이터 베이스 오류"
      })
    default:
      return res.status(500).send({
        errorMessage: "서버 오류"
      })
  }
}