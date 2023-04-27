const express = require("express")
const morgan = require("morgan")
const dotenv = require("dotenv").config()
const mongoose = require("mongoose")
const userRoutes = require("./routes/user")
const sauceRoutes = require("./routes/sauce")
const path = require("path")

mongoose
  .connect(`${process.env.MONGODB_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log("Connexion à MongoDB échouée !"))

const app = express()

app
  .use(morgan("dev"))
  .use(express.json())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content, Accept, Content-Type, Authorization")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
    next()
  })
  .use("https://p6-oc-piquante.vercel.app/api/auth", userRoutes)
  .use("https://p6-oc-piquante.vercel.app/api/sauces", sauceRoutes)
  .use('https://p6-oc-piquante.vercel.app/images', express.static(path.join(__dirname, 'images')))

module.exports = app
