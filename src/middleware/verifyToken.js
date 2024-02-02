const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]
    if (!token) return res.status(401).json({ message: "Unauthorized" })

    jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" })
        req.email = decoded.email
        next()
    })
}

module.exports = verifyToken
