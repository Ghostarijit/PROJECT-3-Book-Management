const bookModel = require("../model/bookModel")
const userModel = require("../model/userModel")
const input = require("../controller/validator/inputValidator")

createBook = async (req,res)=> {

    try{
        if(!input.isValidReqBody(req.body))
      return  res.status(400).send({status:false,message:"Please enter Book Details"})

      



    }
    catch(error) {
        res.status(500).send({status:false,message:error.message})
    }
}