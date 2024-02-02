const jwt = require("jsonwebtoken")

const PRIVATE_KEY = process.env.PRIVATE_KEY

const signJWT = (data) => {
    return jwt.sign(data, PRIVATE_KEY, { expiresIn: "1h", algorithm: "HS256" })
}

module.exports = { signJWT }
