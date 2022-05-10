
const input = require('./inputValidator')


const regex = {
    email: /^([a-zA-Z0-9\._]+)@([a-zA-Z])+\.([a-z]+)(.[a-z])?$/,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[!@#\$%\^&\*])(?=.*[A-Z]).{8,16}$/,
    mobile: /^[6789][0-9]{9}$/,
    pincode: /^[0-9]{6}$/,
    name: /^[a-zA-z ]{2,30}$/,
    isbn: /^\d{13}$/,
    releaseDate: /^\d{4}-\d{1,2}-\d{1,2}/
}

const isValid = (field, regex) => {
    if (!input.isString(field) || !regex.test(field.trim()))
        return false
    return true;
}

const error = {
    email: {
        invalid: "Please enter valid email address",
        already: "Entered Email already present"
    },
    password: {
        invalid: "enter valid password with following conditions 1.At least one digit, 2.At least one lowercase character,3.At least one uppercase character,4.At least one special character, 5. At least 8 characters in length, but no more than 16",
        shortInvalid: " Invalid Password"
    },
    mobile: {
        invalid: "phone number should have 10 digits only starting with 6,7,8,9",
        already: "Entered Mobile Number already present"
    },
    title: "plz enter valid title one of Mr,Miss or Mrs",
    name: "Please enter valid full Name",
    address: {
        street: "in address  please enter valid street",
        city: "in address  please enter valid city",
        pincode: "in address pincode must be present present & 6 digit long"
    },
    login: {
        invalidCred: "You have entered invalid credentials "
    },
    isbn: " please enter a 13 digit long valid ISBN",
    releaseDate: "releaseAt should have date in XXXX-XX-XX format"
}


module.exports = { isValid, regex, error };

