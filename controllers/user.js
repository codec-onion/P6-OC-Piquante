const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const Password = require("../models/Password")
const dotenv = require("dotenv").config()


exports.signup = (req, res, next) => {

  try {
    if (Password.validate(`${req.body.password}`)) {
      bcrypt.hash(req.body.password, 10)
        .then(hash => {
          const user = new User({
            email: req.body.email,
            password: hash
          })
          user.save()
            .then(() => res.status(201).json({ message: "Utilisateur créé avec succès" }))
            .catch(error => res.status(400).json({ message: "Impossible de vous inscrire. Avez-vous déjà un compte?" }))
        })
        .catch(error => res.status(500).json({ error }))
    } else {
      throw false
    }
  } catch (error) {
    res.status(400).json({message: "Votre mot de passe doit avoir entre 8 et 24 caractère. Il doit contenir au moins une majuscule, une minuscule et un chiffre."})
  }
}


exports.login = (req, res, next) => {

  User.findOne({ email: req.body.email })
    .then(user => {
      if(user === null) {
        return res.status(401).json({ message: "Nous n'avons pas pu vous identifier." })
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if(!valid) {
            return res.status(401).json({ message: "Nous n'avons pas pu vous identifier." })
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              `${process.env.SECRET_TOKEN}`,
              { expiresIn: "24h" }
            )
          })
        })
        .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}