const ElectionModel = require("../models/election.model")

// Helpers
const checkSingleElection = require("../helpers/checkSingleElection")

const PORT = process.env.PORT || 8080

const createElection = async (req, res) => {
    let err
    // Check if an election is alreay created
    // Only one election in allowed
    const elections = await ElectionModel.find()
    if (elections.length == 0) {
        const { name, description, startTime, endTime } = req.body
        const newElection = new ElectionModel({
            name: name,
            description: description,
            startTime: startTime,
            endTime: endTime,
            hasHosted: false,
        })
        console.log(newElection)
        const election = await newElection.save()
        return res.json(election)
    }
    err = "Election has already created!"
    console.log(err)
    return res.json({ error: err })
}

const hostElection = async (req, res) => {
    let err

    const electionArr = await ElectionModel.find()
    // Check for no elections
    if (electionArr.length == 0) {
        err = "There are no elections created now"
        console.log(err)
        return res.json({ error: err })
    }
    if (electionArr.length != 1) {
        err = "Election has already created!"
        console.log(err)
        return res.json({ error: err })
    }

    const election = electionArr[0]
    console.log(election)
    await election.updateOne({ _id: election._id }, { hasHosted: true })
    return res.json(election)
}

const getElection = async (req, res) => {
    let err

    const electionArr = await ElectionModel.find()
    // Check for no elections
    if (electionArr.length == 0) {
        err = "There are no elections created now"
        console.log(err)
        return res.json({ error: err })
    }
    if (electionArr.length != 1) {
        err = "Election has already created!"
        console.log(err)
        return res.json({ error: err })
    }

    const election = electionArr[0]
    return res.json(election)
}

const deleteElection = async (req, res) => {
    let err

    const electionArr = await ElectionModel.find()
    if (electionArr.length != 1) {
        err = "More than one election"
        console.log(err)
        return res.status(500).json({ error: err })
    }
    const deletedVal = await ElectionModel.findByIdAndDelete(electionArr[0]["_id"])
    return res.json(deletedVal)
}

const addCandidate = async (req, res) => {
    let err

    const electionArr = await ElectionModel.find()
    if (electionArr.length > 1) {
        err = "More than one election"
        console.log(err)
        return res.json({ error: err })
    }
    if (electionArr.length == 0) {
        err = "No election created"
        console.log(err)
        return res.json({ error: err })
    }

    // console.log(req.file)

    // // Check for file
    // if (req.file === undefined) res.send("Select a file")
    // const imgUrl = `http://localhost:${PORT}/file/${req.file.filename}`
    const candidate = {
        name: req.body.name,
        description: req.body.description,
        imgUrl: req.body.image,
        voteCount: 0,
    }

    const election = electionArr[0]

    const result = await election.candidates.push(candidate)
    await election.save()

    return res.json(result)
}

const getCandidates = async (req, res) => {
    const err = await checkSingleElection()
    if (err.error) {
        return res.json(err)
    }
    const election = (await ElectionModel.find())[0]
    return res.json(election.candidates)
}

module.exports = {
    createElection,
    hostElection,
    getElection,
    deleteElection,
    addCandidate,
    getCandidates,
}
