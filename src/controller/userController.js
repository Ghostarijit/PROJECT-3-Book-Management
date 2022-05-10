const userModel = require("../model/userModel")
const input = require("./validator/inputValidator")
const client = require("./validator/userValidator")


const createuser = async (req, res) => {
    try {

        // validating request body
        if (!input.isValidReqBody(req.body))
            return res.status(400).send({ status: false, message: "plz enter some data" })

        //extracting variables from request body
        const { phone, name, title, email, password, address } = req.body

        //input validations    // isValid function is defined in client 
        if (!client.isValid(name, client.regex.name))
            return res.status(400).send({ status: false, message: "Please enter valid full Name" })

        if (!input.isParticularString(title, ["Mr", "Miss", "Mrs"]))
            return res.status(400).send({ status: false, message: "plz enter valid title one of Mr,Miss or Mrs" })

        if (!client.isValid(email, client.regex.email))
            return res.status(400).send({ status: false, message: "please enter valid email" });

        if (!client.isValid(phone, client.regex.mobile)) {
            return res.status(400).send({ status: false, message: " phone number should have 10 digits only starting with 6,7,8,9" });
        }

        if (!client.isValid(password, client.regex.password))
            return res.status(400).send({ status: false, message: "enter valid password with following conditions 1.At least one digit, 2.At least one lowercase character,3.At least one uppercase character,4.At least one special character, 5. At least 8 characters in length, but no more than 16" });

        if (!input.isString(address.street))
            return res.status(400).send({ status: false, message: "in address  please enter valid street" })

        if (!input.isString(address.city))
            return res.status(400).send({ status: false, message: "in address  please enter valid city" })

        if (!client.isValid(address.pincode, client.regex.pincode))
            return res.status(400).send({ status: false, message: "in address pincode must be present present & 6 digit long" })


        // email & mobile unique or not
        const isEmailUnique = await userModel.findOne({ email: email.toLowerCase() }).count()
        if (isEmailUnique == 1) return res.status(400).send({ status: false, message: "this email is already present" })


        const isMobileUnique = await userModel.findOne({ phone: phone }).count()
        if (isMobileUnique == 1) return res.status(400).send({ status: false, message: "this phone is already present" })

        //creating new document in database
        const user = await userModel.create(req.body)

        return res.status(201).send({ status: true, message: "Success", data: user })
    } catch (err) {
        res.status(500).send({ status: "false", message: err.message })
    }
}


const loginUser = async function (req, res) {
    try {
        if (!input.isValidReqBody(req.body))
            return res.status(400).send({ status: false, msg: "Please enter  mail and password" })

        let { email, password } = req.body
        
        if (!client.isValid(email,client.regex.email)) { 
            return res.status(400).send({ status: false, msg: "please enter valid email" })
        }

        if (!client.isValid(password, client.regex.password))
            return res.status(400).send({ status: false, msg: "Invalid Password" })

        let user = await userModel.findOne({ email: email.trim().toLowerCase(), password: password }).select({ _id: 1 }).lean();
        if (!user)
            return res.status(404).send({ status: false, msg: "Please enter a valid email address and password" });

        const token = jwt.sign({ authorId: user._id.toString() }, "project-3-group-13", { expiresIn: "1h" });

        res.setHeader("x-api-key", token);
        return res.status(200).send({ status: true, message: "Success", data: token });

    } catch (err) {
        return res.status(500).send({ status: "error", message: err.message })
    }
}

module.exports = { loginUser, createuser }
