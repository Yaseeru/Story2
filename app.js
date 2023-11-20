//jshint esversion:6
require('dotenv').config() ;
const express = require("express");
const ejs = require('ejs');
const bodyParser = require('body-parser');  
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();


app.use(express.static('public'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema =  new mongoose.Schema ({
    email: String,
    password: String
}) ;

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptionFields: ["password"], excludeFromEncryption: ["email"] }) ;

const User = new mongoose.model("User", userSchema);


app.get("/", async function (req, res) {
    res.render("home");
});
app.get("/login", async function (req, res) {
    res.render("login");
});
app.get("/register", async function (req, res) {
    res.render("register");
});


app.post("/register", async function (req, res) {
    try {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });
        newUser.save();
        res.render("secrets");
    } catch (err) {
        console.error(err)
    }
});
app.post("/login", async function (req, res) {
    try{
        const username = req.body.username;
        const password = req.body.password;
        const foundUser = await User.findOne({email: username}) ;
        if(foundUser) {
            if(foundUser.password === password) {
                res.render("secrets")
            } else {
                res.send("Invalid Password")
            }
        } else {
            res.send("User Not Found")
        }
    } catch(err) {
        console.error(err)
    }
});




app.listen(3000, function () {
    console.log("Server Started on port 3000")
});