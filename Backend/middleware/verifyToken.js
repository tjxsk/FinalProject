const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    let token = req.headers.token;
    try {
        if (!token) throw 'Unauthorized Access'
        let payload = jwt.verify(token, "secretkey")
        console.log("Token payload:", payload);
        if (!payload) throw 'Unauthorized Access'
        req.userId = payload.id;
        req.name = payload.name;
        req.username = payload.username;
        next()
    } catch (error) {
        res.json({ message: error })
    }
}

module.exports = verifyToken;