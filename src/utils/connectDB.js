const mongoose = require("mongoose")

const dbUrl = process.env.DB_URL || ""

const connectDB = async () => {
    if (dbUrl === "") {
        console.error("DB_URL not found in .env file. Please add DB_URL to .env file. Exiting....")
        process.exit(1)
    }
    try {
        await mongoose.connect("mongodb://localhost:27017/hyp")
    } catch (err) {
        console.error(err)
        return
    }

    console.log("Successfully connected to DB")
}

module.exports = connectDB
