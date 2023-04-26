const express = require("express")
const sauceController = require("../controllers/sauce")
const auth = require("../middleware/auth")
const multerConfig = require("../middleware/multer-config")

const router = express.Router()

router.get("/", auth, sauceController.getAllSauces)
router.get("/:id", auth, sauceController.getOneSauce)
router.post("/", auth, sauceController.createSauce)

module.exports = router