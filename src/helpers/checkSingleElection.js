const ElectionModel = require("../models/election.model")

const checkSingleElection = async () => {
    let err
    const electionArr = await ElectionModel.find()
    if (electionArr.length > 1) {
        err = "More than one election"
        console.log(err)
        return { error: err }
    }
    if (electionArr.length == 0) {
        err = "No election created"
        console.log(err)
        return { error: err }
    }
    return {}
}

module.exports = checkSingleElection
