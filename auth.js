const jwt = require('jsonwebtoken');
const JWT_SECRET = "yAHOOO";

function auth(req, res, next){
    const token = req.headers.token;

    const decodedData = jwt.verify(token, JWT_SECRET);

    if(decodedData){
        req.userId = decodedData.userId;
        next();
    } else {
        res.status(403).json({
            message:"Invalid Creds"
        })
    }
}

module.exports = {
    auth,
    JWT_SECRET
}