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

const isNumber = num =>{
if( typeof num!= "number" ) 
return false
return true
}

const isParticularString= (st,arr) =>  // string array
{
    if( !isString(st) || !arr.includes(st))
    return false
    return true
}

const allString = (obj) =>{
    let error= ""
    for(let key in obj)
    { 
        if(!isString(obj[key]))
        error+= key +" "
    }
    if(error.length!=0)
    return [false,"please enter valid "+error]
    return [true]
}

const arrHasString = obj =>
{
    for (let key in obj)
    {
        if(typeof obj[key] == 'undefined' || !Array.isArray(obj[key]) )
        return [false, key+" is a mandatory field and should be an array"] 
        for(let i=0;i<obj[key].length;i++)
        {
            if(!isString(obj[key][i]))
            return [false, "please enter a valid "+key +" with array of strings"] 
        }
    }
    return [true];
}



module.exports = { isValidReqBody,isString,isParticularString,allString,isNumber,arrHasString}