const mongoose = require("mongoose");  //import mongoose

module.exports = async () => {           //arrow function
    await mongoose.connect(process.env.MONGO_URI);  //connect to mongoDB
    console.log("MongoDB Connected");
};

