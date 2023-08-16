const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb://0.0.0.0/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.1";

async function connectMongoDB(){
    

    // create a connection to our MongoDB database
    // mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    // .then(() => {
    //     console.log("Connected to MongoDB");
    // }
    // )
    // .catch((err) => {
    //     console.log(err);
    // }
    // );
    
    const client = new MongoClient(uri)


    


}


module.exports = connectMongoDB;