const Sauce = require("../models/Sauce")
const fs = require("fs")

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.json(sauces))
    .catch(error => res.status(404).json({ error }))
}

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }))
}

exports.createSauce = (req, res, next) => {
  const sauceProperties = JSON.parse(req.body.sauce)
  delete sauceProperties.userId
  const sauce = new Sauce({
    ...sauceProperties,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  })
  sauce.save()
    .then(() => res.json({ message: "Sauce ajoutée avec succès." }))
    .catch(error => res.json({ error }))
}