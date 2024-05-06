require('dotenv').config()

const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT;  //! custom port for cloud deployment
const connectMongoDB = require("./connection");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const {checkForAuthenticationCookie} = require("./middlewares/authentication");
const cookieParser = require("cookie-parser");
const BLOG = require("./model/blog");


//! connect to mongoDB
connectMongoDB(process.env.MONGO_URL)   //! custom url for cloud deployment
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log("Error occured in connecting database"));


//! default middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//! user defined middleware
app.use(checkForAuthenticationCookie("token"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


//! routes
app.use("/user", userRoutes);
app.use("/blogs", blogRoutes);
//! to use files from public folder as urls
// app.use(express.static(path.resolve('./public')));
app.use(express.static('public'))




app.get("/", async (req, res) => {
    const allBlogs = await BLOG.find({});
    res.render("home", {
        user: req.user,
        allBlogs,
    });
});


app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
