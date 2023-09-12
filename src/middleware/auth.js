const jwt = require("jsonwebtoken");
const { sendErrorResponse } = require("../helpers/helper");



function authMiddleware(req, res, next){
    const stringToken = req.headers['authorization']|| req.query.token;
   
    if(!stringToken){
        return sendErrorResponse(res, "Authentication token missing", 401);
    }
     // get token Bearer tokenString 
    const token = stringToken.split(" ")[1]

    // verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            return sendErrorResponse(res, "Invalid Token", 401)
        }
        req.user = decoded;
        next();
    });
}



module.exports = authMiddleware;