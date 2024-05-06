const JWT = require("jsonwebtoken");
const SECRET_TOKEN_KEY = "{Aviral$7704}";


function createTokenForUser(user){
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role
    }

    const token = JWT.sign(payload, SECRET_TOKEN_KEY, {expiresIn: '1d'});
    return token;
}


function validateToken(token){
    const payload = JWT.verify(token, SECRET_TOKEN_KEY);
    return payload;
}


module.exports = {
    createTokenForUser,
    validateToken
}