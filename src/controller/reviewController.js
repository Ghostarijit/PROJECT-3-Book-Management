const bookModel = require("../model/bookModel")
const reviewModel = require("../model/reviewModel")
const input = require("../validator/inputValidator")
const mongoose = require("mongoose")

const reviewValidate = obj => {
    if (obj.rating && (!input.isNumber(obj.rating) || !(obj.rating > 0 && obj.rating < 6))) return "rating is a mandatory field and must have number 1 to 5 "
    if (!input.isOptionalString(obj.reviewedBy)) return "reviewedBy must have string datatype"
    if (!input.isOptionalString(obj.review)) return "review must have string datatype"
}

const validateReviewId = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return [400, "Please Enter valid review Id "]
    const reviewDocument = await reviewModel.findOne({ _id: id, isDeleted: false }).lean()
    if (!reviewDocument) return [404, "No Review found"]
}

const createReview = async (req, res) => {
    try {
        if (!input.isValidReqBody(req.body))
            return res.status(400).send({ status: false, message: "Please provide review details" })
        const data = { reviewedBy, rating, review } = req.body
        const result = reviewValidate(data)
        if (result)
            return res.status(400).send({ status: false, message: result })
        data.bookId = req.book._id
        data.reviewedAt = new Date()
        await reviewModel.create(data)
        const bookData = await bookModel.findOneAndUpdate({ _id: data.bookId, isDeleted: false }, { $inc: { reviews: 1 } }, { new: true }).lean()
        bookData.reviewsData = await reviewModel.find({ bookId: data.bookId, isDeleted: false }).select({ bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 }).lean();
        res.status(201).send({ status: true, message: "Success", data: bookData })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}

const updateReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId.trim()
        const isValid = await validateReviewId(reviewId)
        if (isValid) return res.status(isValid[0]).send({ status: false, message: isValid[1] })

        const {rating,review,reviewedBy} = req.body
        let data = {rating,review,reviewedBy} 
        data = JSON.parse(JSON.stringify(data))
        if (!input.isValidReqBody(data))
            return res.status(400).send({ status: false, message: "please provide rating,review,reviewedBy to update" })

        const result = reviewValidate(data)
        if (result)
            return res.status(400).send({ status: false, message: result })

        await reviewModel.updateOne({ _id: reviewId, isDeleted: false }, data, { new: true })
        const bookData = req.book;
        bookData.reviewsData = await reviewModel.find({ bookId: req.book._id, isDeleted: false }).select({ bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 }).lean();
        return res.status(200).send({ status: true, message: "Success", data: bookData })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const deleteReviews = async (req, res) => {
    try {
        const reviewId = req.params.reviewId.trim()
        const isValid = await validateReviewId(reviewId)
        if (isValid) return res.status(isValid[0]).send({ status: false, message: isValid[1] })

        await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { isDeleted: true, deletedAt: new Date() })
        await bookModel.updateOne({ _id: req.book._id, isDeleted: false }, { $inc: { reviews: -1 } })
        res.status(200).send({ status: true, message: "Success" })
    } catch (error) {
        res.status(500).send({ status: true, message: error.message })
    }
}

module.exports = { createReview, updateReview, deleteReviews }