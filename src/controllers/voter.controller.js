const { VoterModel } = require("../models/voters.model")
const { signJWT } = require("../utils/jwt")
const jwt = require("jsonwebtoken")

const generateToken = require("../helpers/generateToken")
const nodemailer = require("nodemailer")
const TokenModel = require("../models/token.model")

const BASE_URL = process.env.FRONT_URL || "http://localhost:8080"

function checkIfEmailExists(voters, email) {
    let err

    for (let i = 0; i < voters.length; i++) {
        if (voters[i].email === email) {
            err = "Email already exists"
            console.log(err)
            return { error: err }
        }
    }
    return {}
}

const createVoter = async (req, res) => {
    const voters = await VoterModel.find()

    const err = checkIfEmailExists(voters, req.body.email)
    if (err.error) {
        return res.json(err)
    }

    const newVoter = new VoterModel({
        email: req.body.email,
        password: req.body.password,
        token: "",
        isAdmin: req.body.isAdmin || false,
        hasVoted: false,
    })
    const voter = await newVoter.save()
    return res.json(voter)
}

const getVoters = async (req, res) => {
    const voters = await VoterModel.find()
    return res.json(voters)
}

const deleteAllVoters = async (req, res) => {
    const voters = await VoterModel.deleteMany()
    return res.json(voters)
}

const getVoterByMail = async (req, res) => {
    const email = req.body.email
    console.log(email)
    const voter = await VoterModel.findOne({ email: email })
    if (voter === null) {
        return res.status(404).json({ error: "Voter not found" })
    }
    return res.json(voter)
}

const login = async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const voter = await VoterModel.findOne({ email: email })
    if (voter === null) {
        return res.status(404).json({ error: "Invalid user or password" })
    }
    if (voter.password !== password) {
        return res.status(401).json({ error: "Invalid user or password" })
    }

    const token = signJWT({ email: email, isAdmin: voter.isAdmin })
    return res.json({ token })
}

const createTokenForVoter = async (req, res) => {
    if (req.body.email === undefined) {
        return res.status(400).json({ error: "Email is required" })
    }
    const voter = await VoterModel.findOne({ email: req.body.email })
    if (voter === null) {
        return res.status(404).json({ error: "Voter not found" })
    }
    const token = generateToken(32)
    new TokenModel({ token: token, isUsed: false }).save()
    voter.token = token
    await voter.save()

    const url = BASE_URL + "/?token=" + token

    const message = `You can vote by clicking on the link below\n\n${url}`

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SENDER_MAIL,
            pass: process.env.SENDER_PASSWORD,
        },
    })

    const mailOptions = {
        from: process.env.SENDER_MAIL,
        to: req.body.email,
        subject: "You're ready to vote",
        text: message,
    }
    try {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err)
            } else {
                console.log("Email sent: " + info.response)
            }
        })
    } catch (err) {
        console.error(err)
        return res.json({ msg: "Failed to send email" })
    }

    return res.json({ msg: "Email sent" })
}

const validateToken = async (req, res) => {
    const token = req.body.token
    const tokenObj = await TokenModel.findOne({ token: token })
    if (tokenObj === null) {
        return res.status(404).json({ error: "Token not found" })
    }
    if (tokenObj.isUsed) {
        return res.status(401).json({ error: "Token already used" })
    }
    tokenObj.isUsed = true
    await tokenObj.save()

    return res.json({ msg: "Token validated" })
}

const isVoterAdmin = async (req, res) => {
    const email = req.body.email
    const voter = await VoterModel.findOne({ email: email })
    if (voter === null) {
        return res.status(404).json({ error: "Voter not found" })
    }
    return res.json({ isAdmin: voter.isAdmin })
}

const getVoterByToken = async (req, res) => {
    const token = req.headers["authorization"]
    const decoded = jwt.decode(token, process.env.PRIVATE_KEY)
    return res.json(decoded)
}

module.exports = {
    createVoter,
    getVoters,
    deleteAllVoters,
    createTokenForVoter,
    getVoterByMail,
    login,
    isVoterAdmin,
    getVoterByToken,
    validateToken,
}
