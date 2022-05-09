const userModel = require("../model/userModel")
const input = require("./inputController")



const createuser = async(req, res) => {
    try {
        let { phone, name, title, email, password, address } = req.body

        if (!input.isValidReqBody(data)) return res.status(400).send({status: false, msg: "plz enter some data" })

        // name validation
        if (name === undefined) return res.status(400).send({ status: false, msg: "first name must be present" });
        // if(typeof fname !== "string"||fname.trim().length ===0) return res.status(400).send({ status:false, msg: "fname should be string" });
        // data.fname = data.fname.trim()
        let nname = /^[a-zA-z ]{2,30}$/.test(name)
        if (!nname) return res.status(400).send({ status: false, msg: "enter valid  name" })
        // title validation
        if (!title) return res.status(400).send({ status: false, msg: "title must be present" });
        if (typeof title !== "string") return res.status(400).send({ status: false, msg: "title should be string" });
        if (!(["Mr", "Mrs", "Miss"].includes(data.title))) return res.status(400).send({ status: false, msg: "plz write valid title" })

        // email validation
        if (!input.isEmail(email)) {
            return res.status(400).send({ status: false, msg: "please enter valid email" });
        }
        // mail unique or not
        let mail = await userModel.findOne({ email: email.toLowerCase() }).count()
        if (mail==1) return res.status(400).send({ status: false, msg: "this email is already present" })

        // password validation
        if (!input.isPassword(password) ) return res.status(400).send({ status: false, msg: "enter valid password with following conditions 1.At least one digit, 2.At least one lowercase character,3.At least one uppercase character,4.At least one special character, 5. At least 8 characters in length, but no more than 16" });

        if (!input.isMobile(phone)) {
            return res.status(400).send({ status: false, msg: " phone number should have 10 digits only starting with 6,7,8,9" });
        }
        let call = await userModel.findOne({ phone: phone }).count()
        if (call==1) return res.status(400).send({ status: false, msg: "this phone is already present" })

        // address validation 
        if (!input.isString(address.street)) return res.status(400).send({ status: false, msg: "in address  please enter valid street" })
        if (!input.isString(address.city)) return res.status(400).send({ status: false, msg: "in address  please enter valid city" })
        if (!input.isPincode(address.pincode)) return res.status(400).send({ status: false, msg: "in address pincode must be present present & 6 digit long" })

        let user = await userModel.create(data)

        return res.status(201).send({ status: true, data: user })
    } catch (err) {
        res.status(500).send({ status: "error", msg: err.message })
    }
}




module.exports.createuser = createuser