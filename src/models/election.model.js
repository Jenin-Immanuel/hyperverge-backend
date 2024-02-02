const mongoose = require("mongoose")
const { CandidateSchema } = require("./candidate.model")
/*
    - Election name
    - description
    - start time
    - end time
    - candidates
*/
const ElectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    hasHosted: {
        type: Boolean,
        required: true,
    },
    candidates: [CandidateSchema],
})

const ElectionModel = mongoose.model("Election", ElectionSchema)

module.exports = ElectionModel
