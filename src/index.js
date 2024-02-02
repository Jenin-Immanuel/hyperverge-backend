require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const jwt = require("jsonwebtoken")

const PORT = process.env.PORT || 5555
const PRIVATE_KEY = process.env.PRIVATE_KEY

const app = express()

const corsOptions = {
    origin: "*",
    credentials: true,
}

app.use(cors({ origin: "*" }))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Utils
const connectDB = require("./utils/connectDB")

// Routers
const electionRouter = require("./routes/election.router")
const voterRouter = require("./routes/voter.router")

async function main() {
    connectDB()

    console.log("Hello")
    app.use("/election", electionRouter)
    app.use("/voter", voterRouter)

    app.get("/", (req, res) => {
        res.status(200).send("Hello World")
    })
    app.listen(PORT, () => {
        console.log(`Server started on the url http://localhost:${PORT}/`)
    })
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
