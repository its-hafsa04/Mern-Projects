require('dotenv').config();
const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const register = require("./models/registers");
const hbs = require('hbs');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const auth = require("./middleware/auth");

const port = process.env.PORT || 3000;
require("../src/db/conn");

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

//console.log(process.env.SECRET_KEY);

app.get("/", (req, res) => {
    res.render('index');
});

app.get("/Secret", auth, (req, res) => {
    //console.log(req.cookies.jwt);
    res.render('Secret');
});

app.get("/logout",auth , async(req, res)=>{
    try{
console.log(req.user);

//single logout

/*req.user.tokens = req.user.tokens.filter((curElem) => {
return curElem.token !== req.token;
})*/

//for all devices logout

req.user.tokens = [];

        res.clearCookie("jwt");
        console.log('logout successful');

        await req.user.save();
        res.render('login');

    }catch(error){
        res.status(500).send(error);
    }
})

app.get("/login", (req, res) => {
    res.render('login');
});

app.get("/register", (req, res) => {
    res.render('register');
});

// Create a new user
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;

        if (password === cpassword) {
            const reg = new register({
                name: req.body.name,
                gender: req.body.gender,
                email: req.body.email,
                password: req.body.password,
                cpassword: req.body.cpassword,
            });

            const token = await reg.generateAuthToken();

            //cookie
            res.cookie("jwt", token, {
                expires : new Date(Date.now() + 30000),
                httpOnly:true,
            });

            const registered = await reg.save();
            res.status(201).render("index");
        } else {
            res.status(400).json({ error: "Passwords do not match" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error" });
    }
});

//login post
app.post("/login", async(req, res) => {
    try{

const email = req.body.email;
const password = req.body.password;

const userEmail = await register.findOne({email});

const isMatch = await bcrypt.compare(password, userEmail.password);
const token = await userEmail.generateAuthToken();

 //cookie
 res.cookie("jwt", token, {
    expires : new Date(Date.now() + 50000),
    httpOnly:true,
});



   if(isMatch){
    res.status(201).render("index");
   }else{
    res.send('Invalid login details');
   }

    }catch{
        res.status(500).send("Invalid login details");
    }
});

app.listen(port, () => {
    console.log(`Connected at port no ${port}`);
});
