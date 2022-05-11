const jwt = require("jsonwebtoken");



const validateToken = async function (req, res, next) {
    try {
        let token = req.headers['x-Api-Key'] || req.headers['x-api-key']
        if (!token) {
            return res.status(401).send({ status: false, msg: "Unauthorised access, login..." });
        }
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, "project-3-group-13")
        }
        catch (error) {
            return res.status(401).send({ status: false, msg: "Unauthorised access, login..." });
        }
        req.userId = decodedToken.userId
        next()

    } catch (erre) {
        return res.status(500).send({ status: "Error", error: erre.message })

    }
}
module.exports = { validateToken }