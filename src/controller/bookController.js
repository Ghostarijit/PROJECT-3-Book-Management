const bookModel = require("../model/bookModel")
const userModel = require("../model/userModel")
const input = require("../controller/validator/inputValidator")
const client = require("./validator/regexValidator")
const mongoose = require("mongoose")

createBook = async (req, res) => {

    try {
        if (!input.isValidReqBody(req.body))
            return res.status(400).send({ status: false, message: "Please enter Book Details" })

        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = req.body

        const allInputValid = input.allString({ title, excerpt, category, ISBN })
        if (!allInputValid[0])
            return res.status(400).send({ status: false, message: allInputValid[1] })


        if (!client.isValid(ISBN, client.regex.isbn))
            return res.status(400).send({ status: false, message: client.error.isbn })

        const validSbucategory = input.arrHasString({ subcategory });
        if (!validSbucategory[0])
            return res.status(400).send({ status: false, message: validSbucategory[1] })

        if (!userId || !mongoose.Types.ObjectId.isValid(userId.trim()))
            return res.status(400).send({ status: false, message: "Enter a valid userId" })

    //title, 


        res.send("dummy response")
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { createBook }