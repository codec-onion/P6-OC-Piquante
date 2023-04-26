const multer = require("multer")

const MIME_TYPES = {
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp"
}

const imageStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images")
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype]
    const firstName = file.originalname.split("." + extension)[0]
    const name = firstName.split(" ").join("_")
    callback(null, name + Date.now() + "." + extension)
  }
})

module.exports = multer({storage: imageStorage}).single("image")