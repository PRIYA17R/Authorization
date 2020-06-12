//jshint esversion:6
require('dotenv').config();
const express = require ("express");
const bodyParser = require ("body-parser");
const ejs = require ("ejs");
const mongoose = require ("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

app.use(express.static ("public"));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended :true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true} );

const userSchema = new mongoose.Schema({
    email : String,
    password :String
});

//console.log(process.env.API_KEY)

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields : ["password"] });

const User = new mongoose.model("User", userSchema);

app.post("/register", function(req, res){
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    });
newUser.save(function (err){
    if(!err){
        res.render("secrets");
    }
    else{
        res.send(err);
    }
})
});


app.post("/login", function(req,res){
    const userName =  req.body.username;
    const password =  req.body.password;

    User.findOne({email : userName }, function (err, founduser){
        if(err)
        console.log(err);
        else
        {
            if(founduser){
                if(founduser.password ===password)
                res.render("secrets");
            }
        }
    });

});


app.get("/", function (req, res){
    res.render("home")
})

app.get("/login", function (req, res){
    res.render("login")
})

app.get("/register", function (req, res){
    res.render("register")
})

app.get("/submit", function (req, res){
    res.render("submit")
})

app.get("/secrets", function (req, res){
    res.render("secrets")
})


app.listen(3000, function(){
    console.log("server started at port 3000");
})