const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authenticate = async (req, res, next) => {
    let token = req.headers.authorization;
    console.log("token >_", token);
    if (!token) {
        return res.status(401);
    }
    token = token.split(" ")[1];
    let isVerified = jwt.verify(token, process.env.JWT_SECRET);
    if (!isVerified) {
        return res.status(401).json({ msg: "Invalid Auth Token", status: false })
    }
    console.log(" middleware user ", isVerified);
    req.user = isVerified;
    next();
}