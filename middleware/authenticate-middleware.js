const jwt = require('jsonwebtoken');

// 토큰 검증
module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]

  // // req.password = "1234" 입력받았다고 가정
  // req.password = "1234";
  
  // if (req.password !== "1234"){
  //   return next(new Error("wrong password"))
  // }

  const verifiedToken = verifyToken(token)
  
  if (!verifiedToken){
    return next(new Error('TokenNotMatched'))
  }

  console.log(verifiedToken)

  req.user = verifiedToken;
  next();
}

function verifyToken(token){
  try {
    return jwt.verify(token, process.env.SECRET_KEY);;
  } catch (e) {
    return false;
  }
}