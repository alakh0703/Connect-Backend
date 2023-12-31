const users = require('../models/user.model');
// require bcrypt
const bcrypt = require('bcryptjs');
const {User, ReceiveEmail, SendEmail, Task, Taskk, SQs} = require('../DB/Schema');
const jwt = require('jsonwebtoken');
const { get } = require('mongoose');
const secretKey = "secretKey";

const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb://0.0.0.0/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.1";
const uri = "mongodb+srv://alakh7:Al%40070303@cluster0.5cu8i8d.mongodb.net/"

const ObjectId = require('mongodb').ObjectId;




async function register(req,res) {
    console.log(req.body)
    const {name, email, password, securityQuestion1, securityQuestion2, securityAnswer1, securityAnswer2} = req.body;
 
    
    // res.send(user);
    const newUser = new User({
        email: email,
        password: password,

        name: name,
        cmail: {
            sent: Array(),
            received: Array()
        }

    });



  

    console.log("Connecting to MongoDB")
    const client = new MongoClient(uri)

        try {
    const database = client.db("Connect");
    const userCollection = database.collection("users");
    // create a document to insert
    console.log("New User: ",newUser)

    const result = await userCollection.insertOne(newUser);

    const result2 = await userCollection.find({}).toArray();

    console.log(result2);
    // res.send(result2);
    console.log("ID: " + result.insertedId)
    // convert ObjectID to string
    const id_ = result.insertedId.toString();

    console.log("Adding securityy questions to database...")

    const newSQ = new SQs({
        userID: id_,
        sq1: securityQuestion1,
        sq2: securityQuestion2,
        sa1: securityAnswer1,
        sa2: securityAnswer2
    });

    const SQCollection = database.collection("SQs");
    const result4 = await SQCollection.insertOne(newSQ);
    console.log("SQ: ",result4)

    
    // id, secret key, options, callback
    console.log("Creating new Task...")
    console.log("ID: ",id_)
    const newTask = new Task({
        pendingTask: Array(),
        completedTask: Array(),
        UserID: id_
    });
    console.log("New Task: ",newTask)
    const TaskCollection = database.collection("tasks");
    const result3 = await TaskCollection.insertOne(newTask);
    console.log("TASK: ",result3)
    


    jwt.sign({id : result.insertedId}, secretKey,{expiresIn: 60*30}, (err, token) => {
        if(err) throw err;
        console.log("TOKEN: ",token)
        res.json({
            token
        });
    });

    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  }  
   finally {
    await client.close();
  }
}



async function login(req,res) {
    
    const {email, password} = req.body;

    const client = new MongoClient(uri)
    

    try {
            const database = client.db("Connect");
            const userCollection = database.collection("users");
// create a document to insert

            const result = await userCollection.findOne({email: email});
            if(!result){
                res.status(404).send("User not found");
            }
            else {
                const isMatch = await bcrypt.compare(password, result.password);
                if(isMatch){
                    jwt.sign({id : result._id}, secretKey,{expiresIn: 60*30}, (err, token) => {
                        if(err) throw err;
                        console.log("TOKEN: ",token)
                        res.json({
                            result,token
                        });
                    });
                    // res.send(result);
                }
                else {
                    res.status(400).send("Wrong password");
                }
            }


           
} finally {
await client.close();
}


   
    // const salt = bcrypt.genSaltSync(10);

    // console.log("Original Hash: " + user.password + " New Hash: " + hash) 
  
    
  
}
function createPacket(result) {
    const packet = {
        
        name: result.name,
        email: result.email
    }
    return packet;
}

function createPacket2(result) {

    const packet = {
        id: result._id,
        name: result.name,
        email: result.email,
        cmail: result.cmail,

    }
    return packet;
}
async function verifyToken(req,res) {
    // console.log(req)
    
    const token = req.rawHeaders[11].split(" ")[1];
    // remove first and last character
    const token2 = token.slice(1, -1);
    // console.log(req)
    // console.log("\n\n\nTOKEN: " + token2)
    if(!token2){
       
        return res.status(401).send('Access Denied');
    } 
    try {
        // console.log("TOKEN 2: " + token2)
        const verified = jwt.verify(token2, secretKey, (err, decoded) => {
            if(err) {
                console.log(err)
                return res.status(401).send('Access Denied');
            }
            else {
                // console.log("DECODED: ",decoded)
                return decoded;
            }
        });

        const id = verified.id;
        // console.log("ID: " + id)
        const client = new MongoClient(uri)
        try {

            const database = await client.db("Connect");

            const userCollection = await database.collection("users");
// get a document
        // console.log("first")
            const objID = new ObjectId(id);
            const query = { _id: objID };

            // console.log("Query: ",query)
            // {"_id": ObjectId('64c0c40562dda2c9b3b806ae')}
            await userCollection.find(query).toArray()
            .then(result => res.send(createPacket(result[0])))
            .catch(err => console.error(`Failed to find document: ${err}`))
            .finally(() => client.close());

        // console.log("second")
}  catch (error) {
        res.status(400).send('Invalidd Token');
    }
    finally {
        await client.close();
        }
    
    }
catch (error) {
        res.status(400).send('Invalcdsavid Token');
    }
}

async function getIdFromToken(token){
     
       if(!token){
          
           return;
       } 
       try {
        if(token.startsWith('"') && token.endsWith('"')) {
            token = token.slice(1, -1);
  
        }
        else {
            token = token;
        }

 
            
           const verified = jwt.verify(token, secretKey, (err, decoded) => {
               if(err) {
                   console.log(err)
               }
               else {
                   return decoded;
               }
           });
   
           const id = verified.id;
            return id;

         }
    catch (error) {
        console.log("ERROR: ",error)
        return null;
    }
   
} 

// async function retriveMails(req,res){
//     console.log("\n\n\nGetting Token from query...")
//     const token = req.query.token;
//     console.log("\n\n\n")
//     const id = await getIdFromToken(token)
//     const client = await new MongoClient(uri)
//     try {

//         const database = await client.db("Connect");

//         const userCollection = await database.collection("users");
//         console.log(id)
//         const objID = new ObjectId(this.id);
//         console.log("objid: "+objID)

//         const query = { _id: id };
//         console.log("\n\n\nGetting Mails from database...")
//         await userCollection.findOne(query).toArray()
//         .then(result => res.send(createPacket2(result[0])))
//         .catch(err => console.error(`Failed to find document: ${err}`))
        
//     }
//     catch (error) {
//         res.status(400).send('Invalcdsavid Token');
//     }
//     finally {
//         await client.close();
//         }


// }
async function deleteMyAccount(req,res){
    console.log("Deleting Account...")
    console.log(req.body)
    const {token} = req.body;
    console.log(token)
    const id = await getIdFromToken(token);
    console.log("ID: ",id)
    const client = new MongoClient(uri)

    try {
        // Assuming `uri` is defined somewhere with the MongoDB connection string
        await client.connect();

        const database = client.db("Connect");
        const userCollection = database.collection("users");

        const query = { _id: new ObjectId(id) };
        console.log("Deleting Account from database...");

        const result = await userCollection.deleteOne(query);
        
        if (result) {
            res.send("Account Deleted");
        } else {
            res.status(404).send("User not found.");
        }
    }

    catch (error) {
        console.error(`Error deleting account: ${error}`);
        res.status(400).send('Invalid Token');
    }
    finally {
        if (client) {
            await client.close();
        }
    }
}

async function retriveMails(req, res) {
    console.log("Getting Token from query...");
    const token = req.query.token;
    let client;

    try {
        // Assuming `uri` is defined somewhere with the MongoDB connection string
        client = new MongoClient(uri);
        await client.connect();

        const id = await getIdFromToken(token);

        const database = client.db("Connect");
        const userCollection = database.collection("users");

        const query = { _id: new ObjectId(id) };
        console.log("Getting Mails from database...");

        const result = await userCollection.findOne(query);
        
        if (result) {
            res.send(createPacket2(result));
        } else {
            res.status(404).send("User not found.");
        }
    } catch (error) {
        console.error(`Error retrieving mails: ${error}`);
        res.status(400).send('Invalid Token');
    } finally {
        if (client) {
            await client.close();
        }
    }
}
async function getSQs(ids) {
    console.log("Getting Security Questions...",ids)
    /// convert object to string
    const id = ids.toString();
  console.log(id)
    const client = new MongoClient(uri)
    try {

        const database = await client.db("Connect");

        const SQCollection = await database.collection("SQs");
// get a document


        const query = { userID: id };
        console.log("Query: ",query)
        // {"_id": ObjectId('64c0c40562dda2c9b3b806ae')}
     
        const result = await SQCollection.find({userID: id}).toArray()

        return result[0];

}  catch (error) {
            
            console.error(`Failed to find document: ${error}`);
        }

        finally {
            await client.close();
            }

}

        
        
async function checkExistingUser(req,res) {
    console.log("Checking if user exists...")
    const {email} = req.body;
    console.log(req)
    const client = new MongoClient(uri)
    try {

        const database = await client.db("Connect");
        
        const userCollection = await database.collection("users");
// get a document
        console.log("first")
        const query = { email: email };
        console.log("Query: ",email)
        // {"_id": ObjectId('64c0c40562dda2c9b3b806ae')}
        await userCollection.find(query).toArray()
        .then(async (result)=>{
            console.log(result)
            const id = result[0]._id;
            console.log("ID: ",id)
          const SQ2 = await getSQs(id);
        
       
           res.send(SQ2);
            
        })
        .catch(err => console.error(`Failed to find document: ${err}`))
        .finally(() => client.close());

        console.log("second")
}  catch (error) {

        console.error(`Failed to find document: ${error}`);
    }
    finally {
        await client.close();
        }

}

const resetPassword = async (req, res) => {
    console.log("Resetting Password...")
    const {email, password} = req.body;
    console.log(req)
    const client = new MongoClient(uri)
    try {

        const database = await client.db("Connect");
        
        const userCollection = await database.collection("users");

// get a document
        // find user with email and update password

        // hash the password
        const query = { email: email };
        const update = { $set: {password: password} };
        const options = { upsert: true };
        console.log("Query: ",query)
        // {"_id": ObjectId('64c0c40562dda2c9b3b806ae')}
        await userCollection.updateOne(query, update, options)
        .then(result => res.send(result))
        .catch(err => console.error(`Failed to find document: ${err}`))
        .finally(() => client.close());

        console.log("PASSWORD RESET")
}


catch (error) {
        console.error(`Failed to find document: ${error}`);
    }
    finally {
        await client.close();
        }
}


const updatePassword = async (req, res) => {
    console.log("Updating Password...")
    const {oldPass, newPass, newName, token} = req.body;
    console.log(req)

    // get id from token
    const id = await getIdFromToken(token);
    console.log("ID: ",id)

    const client = new MongoClient(uri)
    try {

        const database = await client.db("Connect");
        
        const userCollection = await database.collection("users");

// get a document

        // get 
        const query = { _id: new ObjectId(id) };
        const update = { $set: {password: newPass, name: newName} };
        const options = { upsert: true };
        var verified = false;
        // {"_id": ObjectId('64c0c40562dda2c9b3b806ae')}
        const z = await userCollection.findOne(query);

        console.log("Z: ",z)
        const actualPass = z.password;
        const isMatch = await bcrypt.compare(oldPass, actualPass);
        console.log(isMatch)
        if(isMatch) {
            verified = true;
        }
        else {
            verified = false;
        }

        if(verified) {
            await userCollection.updateOne(query, update, options)
            .then(result => res.send(result))
            .catch(err => console.error(`Failed to find document: ${err}`))
            .finally(() => client.close());
        }
        else {
            res.send("Password Incorrect");
        }
       
        console.log("PASSWORD UPDATED")
}


catch (error) {
        console.error(`Failed to find document: ${error}`);
    }
    finally {
        await client.close();
        }
}


// getting all already taken emails
const getAllEmails = async (req,res) => {
    const client = new MongoClient(uri)
    try {

        const database = await client.db("Connect");
        
        const userCollection = await database.collection("users");

// get a document
        console.log("avonwro")
        const query = {};
        const result = await userCollection.find(query, {projection: {email: 1}}).toArray();
        const emails = [];
        result.forEach(element => {
            emails.push(element.email);
        });
        console.log(emails)
        res.send(emails);
}


catch (error) {
        console.error(`Failed to find document: ${error}`);
    }
    finally {
        await client.close();
        }
}

module.exports = {
    register,
    login,
    verifyToken,
    getIdFromToken,
    retriveMails,
    deleteMyAccount,
    checkExistingUser,
    resetPassword,
    updatePassword,
    getAllEmails
};