
const input= require('./inputValidator')


const regex = {
    email :/^([a-zA-Z0-9\._]+)@([a-zA-Z])+\.([a-z]+)(.[a-z])?$/,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[!@#\$%\^&\*])(?=.*[A-Z]).{8,16}$/,
    mobile:  /^[6789][0-9]{9}$/,
    pincode: /^[0-9]{6}$/  ,
    name :  /^[a-zA-z ]{2,30}$/
}

const isValid = (field,regex) => {
if( !input.isString(field)|| !regex.test(field.trim()))
return false
return true;
}

module.exports = { isValid,regex};

