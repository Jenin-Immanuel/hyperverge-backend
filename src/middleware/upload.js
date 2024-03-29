const multer = require("multer")
const GridFsStorage = require("multer-gridfs-storage")

const DB_URL = process.env.DB_URL || ""

const storage = new GridFsStorage({
    url: DB_URL,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg", "image/jpg"]

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-${file.originalname}`
            return filename
        }
        console.log("here mware")

        return {
            bucketName: "photos",
            filename: `${Date.now()}-${file.originalname}`,
        }
    },
})

module.exports = multer({ storage })
