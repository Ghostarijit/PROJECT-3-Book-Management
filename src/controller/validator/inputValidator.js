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
const isParticularString= (st,arr) =>  // string array
{
    if( !isString(st) || !arr.includes(st))
    return false
    return true
}


module.exports = { isValidReqBody,isString,isParticularString}