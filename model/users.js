const mongoose = require("mongoose");
const randomBytes = require("randombytes");
const { createHmac } = require("crypto");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        salt: {
            type: String,
            // required: true,
        },
        password: {
            type: String,
            required: true,
        },
        profileImageUrl: {
            type: String,
            default: "/images/avatar.png",
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    { timestamps: true }
);


//! This code will run automatically when we try to save any new value to the schema
userSchema.pre("save", function (next) {
    const user = this;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
        .update(this.password)
        .digest("hex");

    console.log("hashed pswd: ", hashedPassword);
    this.salt = salt;
    this.password = hashedPassword;
    if (!user.isModified("password")) return;
    next();
});


//! This is emthod attached to the userSchema
userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email});
    if (!user) throw new Error("User not found");

    const userPassword = user.password;
    const salt = user.salt;
    const hashedPassword = createHmac("sha256", salt)
        .update(password)
        .digest("hex");

    if (userPassword !== hashedPassword) throw new Error("Incorrect password");
    
    const token = createTokenForUser(user);
    return token;
});

const USER = mongoose.model("user", userSchema);

module.exports = USER;
