
const isValidReqBody = (obj) => {
        if(obj == "undefined" || Object.keys(obj).length==0 )
         return false;
       
        return true
}
const isString = st =>{
    if( typeof st!= "string" ||st.trim().length === 0)
    return false
    return true
}

const isEmail = email => {
    const regex = /^([a-zA-Z0-9\._]+)@([a-zA-Z])+\.([a-z]+)(.[a-z])?$/
    if( typeof email != "string" || !regex.test(email.trim()))
    return false
    return true;
}

const isPassword = pswd => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#\$%\^&\*])(?=.*[A-Z]).{8,16}$/
    if( !isString(pswd) || !regex.test(pswd.trim()))
    return false
    return true
}

const isMobile = mobile => {
    const regex= /^[6789][0-9]{9}$/
    if(!isString(mobile) || !regex.test(mobile.trim()) )
    return false;
    return true;
}

const isPincode = pincode => {
    const regex = /^[0-9]{6}$/
    if(!isString(pincode) || !regex.test(pincode.test))
    return false;
    return true
}

module.exports = {isValidReqBody, isEmail,isPassword, isString,isMobile};

