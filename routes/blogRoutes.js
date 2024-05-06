const express = require("express");
const router = express.Router();
const BLOG = require("../model/blog");
const COMMENT = require('../model/comments');
const multer = require("multer");

//! multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./public/uploads/`);
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage: storage });

router.get("/", (req, res) => {
    res.render("blogs");
});

router.get("/:id", async (req, res) => {
    const blog = await BLOG.findById(req.params.id).populate("createdBy");
    const comments = await COMMENT.find({blogId: req.params.id}).populate('createdBy');
    res.render("blogPage", {
        user: req.user,
        blog: blog,
        comments,
    });
});

router.post("/addNew", upload.single("coverImage"), async (req, res) => {
    const { title, content } = req.body;
    const blog = await BLOG.create({
        title,
        content,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`,
    });
    res.redirect(`/blogs/${blog._id}`);
});


router.post('/comment/:blogId', async(req, res) => {
    const comment = await COMMENT.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });
    return res.redirect(`/blogs/${req.params.blogId}`);
})

module.exports = router;
