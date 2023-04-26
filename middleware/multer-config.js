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
    const name = file.originalname.split(" ").join("_")
    const extension = MIME_TYPES[file.mimetype]
    callback(null, name + Date.now() + "." + extension)
  }
})

module.exports = multer(imageStorage).single("image")