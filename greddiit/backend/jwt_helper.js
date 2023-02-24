const JWT=require('jsonwebtoken')
const createError = require('http-errors')

module.exports={
    signAccessToken: (username)=>{
        return new Promise((resolve,reject)=>{
            const payload={}
            const secret='its a top secrete'
            const options={
                expiresIn:'1h',
                // issuer:''
                audience:username,
            }
            JWT.sign(payload,secret, options,(err,token)=>{
                if(err){
                    console.log(err)
                    reject(createError.InternalServerError())
                }
                resolve(token)
            })
        })
    }
}