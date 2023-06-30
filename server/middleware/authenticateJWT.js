const jwt = require('jsonwebtoken')

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization
  if (token) {
    jwt.verify(token, process.env.JWT_KEY, (err, email) => {
      if (err) {
        return res.sendStatus(403) // Forbidden
      }
      req.email = email.email
      next()
    })
  } else {
    console.log('unauth')
    res.sendStatus(401) // Unauthorized
  }
}

export { authenticateJWT }
