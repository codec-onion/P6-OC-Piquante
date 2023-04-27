const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decodedToken = jwt.verify(token, `${process.env.SECRET_TOKEN}`)
    const userId = decodedToken.userId
    req.auth = { userId: userId }
    next()
  } catch(error) {
    res.status(401).json({ message: "Vous n'êtes pas autorisé à accéder à la page demandée.", error })
  }
}