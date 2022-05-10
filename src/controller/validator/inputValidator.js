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
// to check the values present in obj are coming or not,should be string, 
//if optional is true then it will check datatype should be string only if values are comming otherwise ignore that field 
const allString = (obj, optional) => {
    let error = "",error2 ="";
    for (let key in obj) {
        if ( optional === undefined) {
            if ((obj[key]) === undefined)  error += key + " "     
            if (typeof (obj[key]) !== "string")  error2 += key + " "       
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
// here obj can be contatin one or more array
// we are cheking the elements of array should have string datatype
// and should not contain empty strings
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



module.exports = { isValidReqBody, isString, isParticularString, allString, isNumber, arrHasString, isOptionalString }