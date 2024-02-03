const express = require("express")

const verifyToken = require("../middleware/verifyToken")

const {
    createVoter,
    getVoters,
    deleteAllVoters,
    createTokenForVoter,
    getVoterByMail,
    login,
    isVoterAdmin,
    getVoterByToken,
    validateToken,
} = require("../controllers/voter.controller")

const router = express.Router()

router.route("/").post(createVoter)
router.route("/").get(getVoters)
router.route("/deleteAll").delete(deleteAllVoters)
router.route("/getToken").post(verifyToken, createTokenForVoter)
router.route("/getVoterByMail").post(getVoterByMail)
router.route("/login").post(login)
router.route("/isVoterAdmin").post(isVoterAdmin)
router.route("/getVoterByToken").get(verifyToken, getVoterByToken)
router.route("/validateToken").post(validateToken)

module.exports = router
