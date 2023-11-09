const mongoose = require("mongoose");

//creating db
mongoose.connect("mongodb://127.0.0.1:27017/DynamicWebsite")
.then(() => {
    console.log("Connected to server");
}).catch((error) => {
    console.error("Connection to server failed:", error);
});
