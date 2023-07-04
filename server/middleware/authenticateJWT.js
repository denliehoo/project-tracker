const jwt = require('jsonwebtoken')

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization
  if (token) {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return res.sendStatus(401)
        // return res.sendStatus(403) // Forbidden
      }
      req.email = decoded.email
      // if the current time is greater than the expiration time (meaning token expired, redirect to login)
      if (Math.floor(Date.now() / 1000) > decoded.exp) {
        return res.status(401).json({ error: 'Token expired' })
      }
      console.log('doesnt redirect')
      next()
    })
  } else {
    console.log('unauth')
    res.status(401).json({ error: 'Unauthorized' })
  }
}

export { authenticateJWT }
