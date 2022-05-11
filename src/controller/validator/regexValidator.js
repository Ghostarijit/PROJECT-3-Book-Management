
const input = require('./inputValidator')


const regex = {
    email: /^([a-zA-Z0-9\._]+)@([a-zA-Z])+\.([a-z]+)(.[a-z])?$/,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[!@#\$%\^&\*])(?=.*[A-Z]).{8,16}$/,
    mobile: /^[6789][0-9]{9}$/,
    pincode: /^[0-9]{6}$/,
    name: /^[a-zA-z ]{2,30}$/,
    isbn: /^\d{3}-\d{10}$/,
    releaseDate: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
}

const isValid = (field, regex) => (!input.isString(field) || !regex.test(field.trim())) ? false : true


module.exports = { isValid, regex };

