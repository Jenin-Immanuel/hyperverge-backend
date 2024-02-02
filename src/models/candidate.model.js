const mongoose = require("mongoose")

const CandidateSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    imgUrl: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    voteCount: {
        type: Number,
        required: true,
    },
})

const CandidateModel = mongoose.model("Candidate", CandidateSchema)

module.exports = { CandidateModel, CandidateSchema }
