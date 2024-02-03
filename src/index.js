require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const jwt = require("jsonwebtoken")

const ethers = require("ethers")
const ABI = require("./voting.json")

const PORT = process.env.PORT || 5555
const PRIVATE_KEY = process.env.PRIVATE_KEY

const app = express()

const ElectionModel = require("./models/election.model")

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
const verifyToken = require("./middleware/verifyToken")

async function main() {
    connectDB()

    console.log("Hello")
    app.use("/election", electionRouter)
    app.use("/voter", voterRouter)

    app.get("/", (req, res) => {
        res.status(200).send("Hello World")
    })

    app.get("/data", verifyToken, async (req, res) => {
        try {
            const candidates = (await ElectionModel.findOne()).candidates
            res.json(candidates)
        } catch (err) {
            res.status(500).json({ message: "Error" })
        }
    })
    app.listen(PORT, () => {
        console.log(`Server started on the url http://localhost:${PORT}/`)
    })

    const voting = "0x79866015cEb447c7827790830c3458C389FF1c39"
    const provider = new ethers.WebSocketProvider(process.env.ALCHEMY_WEBSOCKET)
    const contract = new ethers.Contract(voting, ABI, provider)

    contract.on("NewVote", async (name, event) => {
        console.log("Event triggered")
        const election = await ElectionModel.findOne()
        if (election === null) {
            console.log("No election found")
            return
        }
        await ElectionModel.findOneAndUpdate(
            { _id: election._id }, // Query to find the election
            {
                $inc: {
                    "candidates.$[candidate].voteCount": 1, // Increment voteCount
                },
            },
            {
                arrayFilters: [
                    { "candidate.name": name }, // Filter for the specific candidate
                ],
            }
        )
        console.log("New Vote for ", name)
    })
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
