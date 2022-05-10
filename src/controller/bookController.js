const bookModel = require("../model/bookModel")
const userModel = require("../model/userModel")
const input = require("../controller/validator/inputValidator")
const client = require("./validator/regexValidator")
const mongoose = require("mongoose")

const createBook = async (req, res) => {

    try {
        if (!input.isValidReqBody(req.body))
            return res.status(400).send({ status: false, message: "Please enter Book Details" })

        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = req.body

        const allInputValid = input.allString({ title, excerpt, category, ISBN, releasedAt })
        if (!allInputValid[0])
            return res.status(400).send({ status: false, message: allInputValid[1] })

        if (!client.isValid(ISBN, client.regex.isbn))
            return res.status(400).send({ status: false, message: " please enter a 13 digit long valid ISBN" })

        const validSbucategory = input.arrHasString({ subcategory });
        if (!validSbucategory[0])
            return res.status(400).send({ status: false, message: validSbucategory[1] })

        if (!userId || !mongoose.Types.ObjectId.isValid(userId.trim()))
            return res.status(400).send({ status: false, message: "Enter a valid userId" })

        if (!client.isValid(releasedAt, client.regex.releaseDate))
            return res.status(400).send({ status: false, message: "releaseAt should have date in XXXX-XX-XX format  " })

        // checking title,isbn,userid unique or not
        const isUniqueISBN = await bookModel.findOne({ ISBN: ISBN.trim() }).count()
        if (isUniqueISBN == 1)
            return res.status(400).send({ status: false, message: "ISBN is already present,please enter unique one" })

        const isUniqueTitle = await bookModel.findOne({ titile: title.trim() }).count()
        if (isUniqueTitle == 1)
            return res.status(400).send({ status: false, message: "title is already present,please enter unique one" })

        const isValidUserId = await userModel.findOne({ _id: userId }).count()
        if (isValidUserId == 0)
            return res.status(404).send({ status: false, message: "Author Not Found" })
        console.log(subcategory)
        const data = await bookModel.create({ title, excerpt, category, ISBN, releasedAt, subcategory, userId })
        return res.status(201).send({ status: false, message: "Success", data: data })

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const getBooks = async (req, res) => {

    const filter = {
        userId: req.query.userId,
        category: req.query.category,  // [1,2] [4,5] => [1,2,4,5]
        subcategory: req.query.subcategory && { $all: [].concat(req.query.subcategory) },
        isDeleted: false
    }

    if(filter.userId && !mongoose.isValidObjectId(filter.userId))
    return res.status(400).send({status:false,message:"Please Enter valid userId"})

    filterData = JSON.parse(JSON.stringify(filter))

    const books = await bookModel.find({ ...filterData }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1, subcategory: 1 }).sort({ title: 1 }).lean()

    if (books.length == 0)
        return res.status(404).send({ status: false, message: "No book found" })

    res.status(200).send({ status: true, message: "Success", data: books })

}


module.exports = { createBook, getBooks }