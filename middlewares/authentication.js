const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];

        if (!tokenCookieValue) return next();

        try {
            const userPayload = validateToken(tokenCookieValue);
            console.log("userPayload: ", userPayload);
            req.user = userPayload;
        } catch {
            console.log('kuch to gadbad hai')   
        }

        return next();
    };
}

module.exports = {
    checkForAuthenticationCookie,
};
