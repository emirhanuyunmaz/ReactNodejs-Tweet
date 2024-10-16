const jwt = require("jsonwebtoken")


const authControl = async(req,res,next) => {
    console.log("AUTH CONTROL");
    try{

        // console.log(req.headers);
    
        const token = req.headers.token
        const refreshToken = req.headers.refreshtoken
        // console.log("Refres Token : ",refreshToken);
        // console.log("ACCESS Token : ",token);
        
        if(!token){
            res.status(401).json({
                succeded:false,
                message:"Error",            
            })
        }else{
            jwt.verify(token,process.env.TOKEN_SECRET,async(err,decodedToken) => {
                if(err){
                    //Refresh token kontrol edilecek.
                    console.log("Token Süresi geçmiş");
                }else{
                    console.log("DECODED TOKEN:",decodedToken);
                    req.headers.id = decodedToken.id
                }
            })
        }
        // console.log("Kullaıcı token bilgisi:",token);
    }catch(err){
        res.status(401).json({message:err,succes:false})
    }
    
    next()
}

module.exports = authControl