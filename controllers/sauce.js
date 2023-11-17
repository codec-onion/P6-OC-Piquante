const Sauce = require("../models/Sauce")
const fs = require("fs")


exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({ error }))
}


exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }))
}


exports.createSauce = (req, res, next) => {
  console.log(req)
  const sauceObject = JSON.parse(req.body.sauce)
  delete sauceObject.userId

  try {
    const objectValues = Object.values(sauceObject).toString()
    for (let value of objectValues){
      if(value.length === 0){
        throw error
      }
    }
    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
    })
    sauce.save()
      .then(() => res.status(201).json({ message: "Sauce ajoutée avec succès." }))
      .catch(error => res.status(400).json({ error }))
  } catch (error) {
    res.status(400).json({ message: "Un problème est survenue. Avez-vous pensez à bien renseigner toutes les informations?" })
  }

}


exports.modifySauce = (req, res, next) => {
  const id = req.params.id
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
  } : { ...req.body }
  delete sauceObject.userId

  function updateSauce(id, sauceObject) {
    Sauce.updateOne({ _id: id }, { ...sauceObject, _id: id })
      .then(() => res.status(201).json({ message: "Sauce modifiée avec succès" }))
      .catch(error => res.status(500).json({ error }))
  }

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if(sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Vous n'êtes pas autorisé à modifié cette sauce." })
      } 
      else if(req.file) {
        const filename = sauce.imageUrl.split("/images/")[1]
        fs.unlink(`images/${filename}`, () => { updateSauce(id, sauceObject) })
      } 
      else { updateSauce(id, sauceObject) }
    })
    .catch(error => res.status(400).json({ error }))
}


exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if(sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Vous n'êtes pas autorisé à supprimer cette sauce." })
      } 
      else {
        const filename = sauce.imageUrl.split("/images/")[1]
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée avec succès." }))
            .catch(error => res.status(500).json({ error }))
        })
      }
    })
    .catch(error => res.status(400).json({ error }))
}


exports.likeOrDislikeSauce = (req, res ,next) => {
  const likeObject = { ...req.body }
  const idSauce = req.params.id
  Sauce.findOne({ _id: idSauce })
    .then(sauce => {
      const sauceLikes = {
        likes: sauce.likes,
        dislikes: sauce.dislikes,
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked
      }
      const liked = sauceLikes.usersLiked.find(user => user === req.auth.userId)
      const disliked = sauceLikes.usersDisliked.find(user => user === req.auth.userId)

      function updateSauce(idSauce, sauceLikes) {
        Sauce.updateOne({ _id: idSauce }, { ...sauceLikes, _id: idSauce })
          .then(() => res.status(201).json({ message: "Sauce mise à jour." }))
          .catch(error => res.status(400).json({ error }))
      }

      // Si like sans avoir liker ni disliker
      if(likeObject.like === 1 && !liked && !disliked) {
        sauceLikes.likes += 1
        sauceLikes.usersLiked.push(req.auth.userId)

        updateSauce(idSauce, sauceLikes)
      }
      // Si like en ayant liker
      else if(likeObject.like === 0 && liked && !disliked) {
        sauceLikes.likes -= 1
        const userLikeIndex = sauceLikes.usersLiked.indexOf(req.auth.userId)
        sauceLikes.usersLiked.splice(userLikeIndex, 1)

        updateSauce(idSauce, sauceLikes)
      }
      // Si dislike sans avoir liker ni disliker
      else if(likeObject.like === -1 && !liked && !disliked) {
        sauceLikes.dislikes += 1
        sauceLikes.usersDisliked.push(req.auth.userId)

        updateSauce(idSauce, sauceLikes)
      }
      // Si dislike en ayant disliker
      else if(likeObject.like === 0 && !liked && disliked) {
        sauceLikes.dislikes -= 1
        const userDislikeIndex = sauceLikes.usersDisliked.indexOf(req.auth.userId)
        sauceLikes.usersDisliked.splice(userDislikeIndex, 1)

        updateSauce(idSauce, sauceLikes)
      }
    })
    .catch(error => res.status(400).json({ error }))
}