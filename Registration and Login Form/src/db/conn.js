const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/Registration")
.then(() => {
    console.log("Connected to server");
}).catch((error) => {
    console.error("Connection to server failed:", error);
});