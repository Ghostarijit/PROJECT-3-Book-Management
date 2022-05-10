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

        const allInputValid = input.allString({ title, excerpt, category, ISBN, releasedAt })
        if (!allInputValid[0])
            return res.status(400).send({ status: false, message: allInputValid[1] })

        if (!client.isValid(ISBN, client.regex.isbn))
            return res.status(400).send({ status: false, message:  " please enter a 13 digit long valid ISBN" })

        const validSbucategory = input.arrHasString({ subcategory });
        if (!validSbucategory[0])
            return res.status(400).send({ status: false, message: validSbucategory[1] })

        if (!userId || !mongoose.Types.ObjectId.isValid(userId.trim()))
            return res.status(400).send({ status: false, message: "Enter a valid userId" })

        if(!client.isValid(releasedAt,client.regex.releaseDate))
            return res.status(400).send({ status: false, message: "releaseAt should have date in XXXX-XX-XX format" })

        // checking title,isbn,userid unique or not
        const isUniqueISBN = await bookModel.findOne({ ISBN: ISBN.trim() }).count()
        if (isUniqueISBN == 1)
        return res.status(400).send({ status: false, message: "ISBN is already present,please enter unique one" })

        const isUniqueTitle = await bookModel.findOne({ titile: title.trim() }).count()
        if (isUniqueTitle == 1)
        return res.status(400).send({ status: false, message: "title is already present,please enter unique one" })   
        
        const isValidUserId = await userModel.findOne({_id:userId}).count()
        if(isValidUserId==0)
        return res.status(404).send({ status: false, message: "Author Not Found" }) 

        const data = await bookModel.create({title,excerpt,category,ISBN,releasedAt,subcategory,userId})
        return res.status(201).send({ status: false, message: "Success", data:data }) 

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const getBooks = async(req,res)=>{

    const { userId,category,subcategory}= req.body



}


module.exports = { createBook }