const isValidReqBody = (obj) => {
    if (obj == "undefined" || Object.keys(obj).length == 0)
        return false;
    return true
}

const isString = st => {
    if (typeof st != "string" || st.trim().length === 0)
        return false
    return true
}

const isOptionalString = st => {
    if (typeof st != "undefined" && (typeof st != "string" || st.trim().length === 0))
        return false
    return true
}

const isNumber = num => {
    if (typeof num != "number")
        return false
    return true
}

const isParticularString = (st, arr) =>  // string array
{
    if (!isString(st) || !arr.includes(st))
        return false
    return true
}

const allString = (obj, optional) => {
    let error = ""
    let error2 = ""
    for (let key in obj) {
        if (typeof optional === "undefined") {
            if (typeof (obj[key]) === "undefined")
                error += key + " "
            if (typeof (obj[key]) !== "string")
                error2 += key + " "
        }
        if (optional == true) {
            if (optional != undefined && typeof (obj[key]) !== "string")
                error2 += key + " "
        }
    }
    if (error.length != 0)
        return [false, "You'r missing Mandatory fields :- " + error]
    if (error2.length != 0)
        return [false, error2 + " should have valid string datatype"]
    return [true]
}

const arrHasString = (obj) => {
    for (let key in obj) {
        if (typeof obj[key] == 'undefined' || !Array.isArray(obj[key]))
            return [false, key + " is a mandatory field and should be an array"]
        let arr = []
        for (let i = 0; i < obj[key].length; i++) {
            if (typeof (obj[key][i]) !== "string")
                return [false, "please enter a valid " + key + " with array of strings"]
            if (obj[key][i].trim().length == 0)
                return [false, "In " + key + " empty strings not allowed"]
        }
    }
    return [true];
}



module.exports = { isValidReqBody, isString, isParticularString, allString, isNumber, arrHasString,isOptionalString}