module.exports = function (err, req, res, next) {
  console.error(err.message)
  switch(err.message){
    case 'wrong password': 
      return res.status(400).send({
        errorMessage: "잘못된 비밀번호"
      })
    case 'existing email':
      return res.status(400).send({
        errorMessage: "가입된 이메일"
      })
    case "Forbidden":
      return res.status(401).send({
        errorMessage: "접근 권한이 없습니다."
      })
    case "UserNotFound":
    case "Need login":
    case "accessTokenNotMatched":
      return res.status(401).send({
        errorMessage: "로그인을 해주세요"
      })
  }
}