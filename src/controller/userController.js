const userModel = require("../model/userModel")
const input = require("./validator/inputValidator")
const userValidator = require("./validator/userValidator")


const createuser = async (req, res) => {
    try {

        // validating request body
        if (!input.isValidReqBody(req.body))
            return res.status(400).send({ status: false, msg: "plz enter some data" })

        //extracting variables from request body
        let { phone, name, title, email, password, address } = req.body

        //input validations    // isValid function is defined in userValidator 
        if (!userValidator.isValid(name,userValidator.regex.name))
            return res.status(400).send({ status: false, msg: "Please enter valid full Name" })

        if (!input.isParticularString(title, ["Mr", "Miss", "Mrs"]))
            return res.status(400).send({ status: false, msg: "plz enter valid title one of Mr,Miss or Mrs" })

        if (!userValidator.isValid(email,userValidator.regex.email))
            return res.status(400).send({ status: false, msg: "please enter valid email" });

        if (!userValidator.isValid(password,userValidator.regex.password))
            return res.status(400).send({ status: false, msg: "enter valid password with following conditions 1.At least one digit, 2.At least one lowercase character,3.At least one uppercase character,4.At least one special character, 5. At least 8 characters in length, but no more than 16" });

        if (!input.isString(address.street))
            return res.status(400).send({ status: false, msg: "in address  please enter valid street" })

        if (!input.isString(address.city))
            return res.status(400).send({ status: false, msg: "in address  please enter valid city" })

        if (!userValidator.isValid(address.pincode,userValidator.regex.pincode))
            return res.status(400).send({ status: false, msg: "in address pincode must be present present & 6 digit long" })


        // email & mobile unique or not
        let mail = await userModel.findOne({ email: email.toLowerCase() }).count()
        if (mail == 1) return res.status(400).send({ status: false, msg: "this email is already present" })

        if (!userValidator.isValid(phone,userValidator.regex.mobile)) {
            return res.status(400).send({ status: false, msg: " phone number should have 10 digits only starting with 6,7,8,9" });
        }
        let call = await userModel.findOne({ phone: phone }).count()
        if (call == 1) return res.status(400).send({ status: false, msg: "this phone is already present" })

        //creating new document in database
        let user = await userModel.create(req.body)

        return res.status(201).send({ status: true, data: user })
    } catch (err) {
        res.status(500).send({ status: "false", msg: err.message })
    }
}




module.exports.createuser = createuser