const userModel = require("../model/userModel")
const input = require("./validator/inputValidator")
const client = require("./validator/regexValidator")


const createuser = async (req, res) => {
    try {

        // validating request body
        if (!input.isValidReqBody(req.body))
            return res.status(400).send({ status: false, message: "plz enter some data" })

        //extracting variables from request body
        const { phone, name, title, email, password, address } = req.body
        
        const allInputValid = input.allString({ title, name, phone, email,password,"street_in_address ":address.street,"city_in_address ":address.city,"pincode_in_address ":address.pincode })
        if (!allInputValid[0])
            return res.status(400).send({ status: false, message: allInputValid[1] })

        let output;
        //input validations    // isValid function is defined in client 
        if (!client.isValid(name, client.regex.name))
            return res.status(400).send({ status: false, message: client.error.name })

        if (!input.isParticularString(title, ["Mr", "Miss", "Mrs"]))
            return res.status(400).send({ status: false, message:client.error.title })

        if (!client.isValid(email, client.regex.email))
            return res.status(400).send({ status: false, message: client.error.email.invalid });

        if (!client.isValid(phone, client.regex.mobile)) {
            return res.status(400).send({ status: false, message: client.error.mobile.invalid });
        }

        if (!client.isValid(password, client.regex.password))
            return res.status(400).send({ status: false, message:client.error.password.invalid });

        if (!input.isString(address.street))
            return res.status(400).send({ status: false, message:client.error.address.street })

        if (!input.isString(address.city))
            return res.status(400).send({ status: false, message:client.error.address.city })

        if (!client.isValid(address.pincode, client.regex.pincode))
            return res.status(400).send({ status: false, message:client.error.address.pincode })


        // email & mobile unique or not
        const isEmailUnique = await userModel.findOne({ email: email.toLowerCase() }).count()
        if (isEmailUnique == 1) return res.status(400).send({ status: false, message: client.error.email.already })


        const isMobileUnique = await userModel.findOne({ phone: phone }).count()
        if (isMobileUnique == 1) return res.status(400).send({ status: false, message: client.error.mobile.already })

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
            return res.status(400).send({ status: false, msg: client.error.email.invalid })
        }

        if (!client.isValid(password, client.regex.password))
            return res.status(400).send({ status: false, msg: client.error.password.shortInvalid })

        let user = await userModel.findOne({ email: email.trim().toLowerCase(), password: password }).select({ _id: 1 }).lean();
        if (!user)
            return res.status(404).send({ status: false, msg:client.error.login.invalidCred});

        const token = jwt.sign({ authorId: user._id.toString() }, "project-3-group-13", { expiresIn: "1h" });

        res.setHeader("x-api-key", token);
        return res.status(200).send({ status: true, message: "Success", data: token });

    } catch (err) {
        return res.status(500).send({ status: "error", message: err.message })
    }
}

module.exports = { loginUser, createuser }
