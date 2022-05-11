const isValidReqBody = obj => (!obj || Object.keys(obj).length == 0) ? false : true

const isString = st => (typeof st != "string" || st.trim().length === 0) ? false : true


const isOptionalString = st => (typeof st != "undefined" && (typeof st != "string" || st.trim().length === 0)) ? false : true

const isNumber = num => (typeof num != "number") ? false : true

const isParticularString = (st, arr) => (!isString(st) || !arr.includes(st)) ? false : true


// to check the values present in obj are coming or not,should be string, 
//if optional is true then it will check datatype should be string only if values are comming otherwise ignore that field 
const allString = (obj, optional) => {
    let error = "", error2 = "";
    for (let key in obj) {
        if (!optional) {
            if (!obj[key]) error += key + " "
            if (!isString(obj[key])) error2 += key + " "
        }
        if (optional == true && isOptionalString(obj[key]))
            error2 += key + " "
    }
    return error.length != 0 ? [false, "You'r missing Mandatory fields :- " + error] :
        (error2.length != 0) ? [false, error2 + " should have valid string datatype and should be non-empty"]
            : [true]
}
// here obj can be contatin one or more array
// we are cheking the elements of array should have string datatype
// and should not contain empty strings
const arrHasString = (obj) => {
    for (let key in obj) {
        if (!obj[key] || !Array.isArray(obj[key]))
            return [false, key + " is a mandatory field and should be an array"]
        for (let i = 0; i < obj[key].length; i++) {
            if (typeof (obj[key][i]) !== "string")
                return [false, "please enter a valid " + key + " with array of strings"]
            if (obj[key][i].trim().length == 0)
                return [false, "In " + key + " empty strings not allowed"]
        }
    }
    return [true];
}



module.exports = { isValidReqBody, isString, isParticularString, allString, isNumber, arrHasString, isOptionalString }