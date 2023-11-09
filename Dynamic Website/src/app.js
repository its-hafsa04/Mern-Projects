const exxpress = require('express');
const app = exxpress();
require("../src/db/conn");
const User = require("./model/usermessage");
const path = require('path');
const hbs = require('hbs');
const port = process.env.PORT || 3000;

//setting path

const staticpath = path.join(__dirname, "../public");
const templatepath = path.join(__dirname, "../templates/views");
const partialpath = path.join(__dirname, "../templates/partials");

//middleware
app.use('/css',exxpress.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use('/js',exxpress.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use('/jq',exxpress.static(path.join(__dirname, "../node_modules/jquery/dist")));
app.use(exxpress.urlencoded({extended:false}));
app.use(exxpress.static(staticpath));
app.set('view engine', "hbs");
app.set('views', templatepath);
hbs.registerPartials(partialpath);

//routing
app.get("/", (req,res) =>{
res.render("index");
});

    app.post("/contact", async(req,res) =>{
        try{

//res.send(req.body);
const userData = new User(req.body);
await userData.save();
res.status(201).render("index");

        }catch(e){
            res.status(501).send(e);
        }
        });
    

app.listen(port, () =>{
    console.log(`connected at ${port}`);
})