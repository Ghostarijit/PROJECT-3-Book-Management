const bookModel = require("../model/bookModel")
const userModel = require("../model/userModel")
const reviewModel = require("../model/reviewModel")
const input = require("../controller/validator/inputValidator")
const client = require("./validator/regexValidator")
const mongoose = require("mongoose")

const createBook = async (req, res) => {

    try {
        if (!input.isValidReqBody(req.body))
            return res.status(400).send({ status: false, message: "Please enter Book Details" })

        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = req.body

        const allInputValid = input.allString({ title, excerpt, category, ISBN, releasedAt, userId })
        if (!allInputValid[0])
            return res.status(400).send({ status: false, message: allInputValid[1] })

        if (!userId || !mongoose.isValidObjectId(userId.trim()))
            return res.status(400).send({ status: false, message: "Enter a valid userId" })
        //authorisation 
        if (req.userId !== userId.trim())
            return res.status(400).send({ status: false, message: "Use your own userId" })

        if (!client.isValid(ISBN, client.regex.isbn))
            return res.status(400).send({ status: false, message: " please enter a 13 digit long valid ISBN and in format like XXX-XXXXXXXXXX" })

        const validSbucategory = input.arrHasString({ subcategory });
        if (!validSbucategory[0])
            return res.status(400).send({ status: false, message: validSbucategory[1] })

        if (!client.isValid(releasedAt, client.regex.releaseDate))
            return res.status(400).send({ status: false, message: "releaseAt should have date in YYYY-MM-DD format  " })

        // checking title,isbn,userid unique or not
        const isUniqueISBN = await bookModel.findOne({ ISBN: ISBN }).count()
        if (isUniqueISBN == 1)
            return res.status(400).send({ status: false, message: "ISBN is already present,please enter unique one" })

        const isUniqueTitle = await bookModel.findOne({ title: title }).count()
        if (isUniqueTitle == 1)
            return res.status(400).send({ status: false, message: "title is already present,please enter unique one" })

        const isValidUserId = await userModel.findOne({ _id: userId }).count()
        if (isValidUserId == 0)
            return res.status(404).send({ status: false, message: "Author Not Found" })

        const data = await bookModel.create({ title, excerpt, category, ISBN, releasedAt, subcategory, userId })
        return res.status(201).send({ status: false, message: "Success", data: data })

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const getBooks = async (req, res) => {

    const filter = {
        userId: req.query?.userId,
        category: req.query?.category,                        // by concat [1,2] [4,5] => [1,2,4,5]
        subcategory: req.query?.subcategory && { $all: [].concat(req.query.subcategory) },
        isDeleted: false
    }

    if (filter.userId && !mongoose.isValidObjectId(filter.userId))
        return res.status(400).send({ status: false, message: "Please Enter valid userId" })

    filterData = JSON.parse(JSON.stringify(filter))

    const books = await bookModel.find(filterData).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 }).lean()

    if (books.length == 0)
        return res.status(404).send({ status: false, message: "No book found" })

    res.status(200).send({ status: true, message: "Success", data: books })

}

const getBookById = async (req, res) => {
    try { // req.book coming from bookcheck.js middleware
        req.book.reviewData = await reviewModel.find({ bookId: req.book._id, isDeleted: false }).select({ bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 }).lean()
        res.status(200).send({ status: true, message: "Book List", data: req.book })
    }
    catch (error) {
        return res.status(500).send({ status: true, data: error.message })
    }
}

const updateBooks = async (req, res) => {
    try {
        let data = {
            title: req.body?.title,
            excerpt: req.body?.excerpt,
            releasedAt: req.body?.releasedAt,
            ISBN: req.body?.ISBN
        }
        data = JSON.parse(JSON.stringify(data))
        if (!input.isValidReqBody(data))
            return res.status(400).send({ status: false, message: "Atleast enter one of these : title,excrpt,releasedAt,ISBN  to update Data" })

        if (data.releasedAt)
            if (!client.isValid(data.releasedAt, client.regex.releaseDate))
                return res.status(400).send({ status: false, message: "please enter release date in YYYY-MM-DD format" })
        if (data.ISBN)
            if (!client.isValid(data.ISBN, client.regex.isbn))
                return res.status(400).send({ status: false, message: "please enter 13 digit long ISBN and in format like XXX-XXXXXXXXXX  " })

        const isUniqueISBN = await bookModel.findOne({ ISBN: data.ISBN }).count()
        if (isUniqueISBN == 1)
            return res.status(400).send({ status: false, message: "ISBN is already present,please enter unique one" })

        const isUniqueTitle = await bookModel.findOne({ title: data.title }).count()
        if (isUniqueTitle == 1)
            return res.status(400).send({ status: false, message: "title is already present,please enter unique one" })

        const updatedBook = await bookModel.findOneAndUpdate({ _id: req.book._id, isDeleted: false }, data, { new: true })

        res.status(200).send({ status: true, message: "Success", data: updatedBook })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


const deleteBooks = async (req, res) => {
    try {
        const date = new Date();
        const book = await bookModel.findOneAndUpdate({ _id: req.book._id, isDeleted: false }, { isDeleted: true, deletedAt: date })
        res.status(200).send({ status: true, message: "Success" })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createBook, getBooks, getBookById, updateBooks, deleteBooks }