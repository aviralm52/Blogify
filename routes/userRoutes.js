const express = require("express");
const router = express.Router();
const USER = require("../model/users");

router.get("/signin", (req, res) => {
    return res.render("signin");
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;
    console.log(fullName, email, password);
    await USER.create({
        fullName,
        email,
        password,
    });
    return res.redirect("/");
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await USER.matchPasswordAndGenerateToken(email, password);
        res.cookie("token", token).redirect("/");
    } catch (err) {
        res.render('signin', {
            error: 'Incorrect email or password'
        });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/')
})

module.exports = router;
