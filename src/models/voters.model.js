const mongoose = require("mongoose")

const VoterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
    hasVoted: {
        type: Boolean,
        required: true,
    },
})

const VoterModel = mongoose.model("Voter", VoterSchema)

module.exports = { VoterSchema, VoterModel }
