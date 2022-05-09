
const input= require('./inputController')

const isEmail = email => {
const regex = /^([a-zA-Z0-9\._]+)@([a-zA-Z])+\.([a-z]+)(.[a-z])?$/
if( typeof email != "string" || !regex.test(email.trim()))
return false
return true;
}

const isPassword = pswd => {
const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#\$%\^&\*])(?=.*[A-Z]).{8,16}$/
if( !input.isString(pswd) || !regex.test(pswd.trim()))
return false
return true
}

const isMobile = mobile => {
const regex= /^[6789][0-9]{9}$/
if(!input.isString(mobile) || !regex.test(mobile.trim()) )
return false;
return true;
}

const isPincode = pincode => {
const regex = /^[0-9]{6}$/  
if(!input.isString(pincode) || !regex.test(pincode.trim()))
return false;
return true
}

const isName = name => {
    const regex=/^[a-zA-z ]{2,30}$/
    if(!input.isString(name) || !regex.test(name.trim()))
    return false
    return true
}



module.exports = { isEmail,isPassword, isString:input.isString,isValidReqBody:input.isValidReqBody,isMobile,isPincode, isName,isParticularString:input.isParticularString};

