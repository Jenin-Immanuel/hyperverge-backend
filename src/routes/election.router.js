const express = require("express")

const router = express.Router()

// Middlewares
const upload = require("../middleware/upload")
const verifyToken = require("../middleware/verifyToken")

// Import the controllers

const {
    createElection,
    deleteElection,
    getElection,
    addCandidate,
    getCandidates,
    hostElection,
} = require("../controllers/election.controller")

router.route("/").get(verifyToken, getElection)
router.route("/").post(verifyToken, createElection)
router.route("/").delete(verifyToken, deleteElection)
router.route("/host").post(verifyToken, hostElection)

router.post("/addCandidate", verifyToken, addCandidate)
router.get("/getCandidates", verifyToken, getCandidates)

module.exports = router
