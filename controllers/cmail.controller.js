const { getIdFromToken} = require('./user.controller.js')
const ObjectId = require('mongodb').ObjectId;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://0.0.0.0/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.1"



async function sendEmail(req, res) {
  try {
    const {unique_id, from, to, subject, body, token, fromName } = req.body;
    

    // verify token
    const userId = await getIdFromToken(token);
    // console.log("USER ID: ", userId)

    if(!userId){
        res.status(401).send("Invalid token");
        return;
    }
    else {
        console.log(userId)
    }

    const client = new MongoClient(uri);
    await client.connect();

    await addMailToSender(client, unique_id, userId, from, to, subject, body);
    await addMailToReceiver(client,unique_id, to, from, subject, body, fromName);

    client.close();

    res.send("Email sent");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
}

async function addMailToSender(client, unique_id, senderId, from, to, subject, body) {
  const database = client.db("Connect");
  const userCollection = database.collection("users");

  const sendEmail = {
    from: from,
    to: to,
    subject: subject,
    body: body,
    read: false,
    unique_id: unique_id
  };

  const senderSentResult = await userCollection.findOne({ _id: new ObjectId(senderId) }, { projection: { cmail: 1 } });
  const senderSent = senderSentResult.cmail.sent;
  senderSent.push(sendEmail);

  await userCollection.updateOne({ _id: new ObjectId(senderId) }, { $set: { 'cmail.sent': senderSent } });
}

async function addMailToReceiver(client,unique_id, receiverEmail, from, subject, body, fromName) {
  const database = client.db("Connect");
  const userCollection = database.collection("users");

  const receiveEmail2 = {
    from: from,
    to: receiverEmail,
    subject: subject,
    body: body,
    imp: false,
    deleted: false,
    fromName: fromName,
    unique_id: unique_id
  };
  // console.log(receiveEmail2)

  const receiverResult = await userCollection.findOne({ email: receiverEmail }, { projection: { cmail: 1 } });
  
  // console.log(receiverResult)
  const receiverReceived = receiverResult.cmail.received;
  // const po = []
  // po.push(receiverReceived[3])
  // po.push(receiverReceived[4])
  // po.push(receiverReceived[5])
  // receiverReceived = po;
  receiverReceived.push(receiveEmail2);

  await userCollection.updateOne({ email: receiverEmail }, { $set: { 'cmail.received': receiverReceived } });
}


// async function sendEmail(req, res) {
//     try {
//       const { from, to, subject, body, token } = req.body;
  
//       const id = "64c35980c9e2d236ae5fd078";
//       const id2 = "64c359f5c9e2d236ae5fd079";
  
//       const client = new MongoClient(uri);
  
//       await client.connect();
//       const database = client.db("Connect");
//       const userCollection = database.collection("users");
  
//       const sendEmail = {
//         from: from,
//         to: to,
//         subject: subject,
//         body: body,
//         read: false,
//       };
  
//       const receiveEmail = {
//         from: from,
//         to: to,
//         subject: subject,
//         body: body,
//         imp: false,
//         deleted: false,
//       };
  
//       // Update sender's sent emails
//       const senderSentResult = await userCollection.findOne({_id: new ObjectId(id)}, { projection: { cmail: 1 } });
//       const senderSent = senderSentResult.cmail.sent;
//       senderSent.push(sendEmail);
//       await userCollection.updateOne({_id: new ObjectId(id)}, {$set: { 'cmail.sent': senderSent }});
  
//       // Update receiver's received emails
//       const receiverResult = await userCollection.findOne({ email: to }, { projection: { cmail: 1 } });
//       const receiverReceived = receiverResult.cmail.received;
//       receiverReceived.push(receiveEmail);
//       await userCollection.updateOne({ email: to }, { $set: { 'cmail.received': receiverReceived } });
  
//       client.close();
  
//       res.send("Email sent");
//     } catch (error) {
//       console.error("Error sending email:", error);
//       res.status(500).send("Error sending email");
//     }
//   }
// async function sendEmail(req, res) {
//     // console.log(req.body);
//     const {from, to, subject, body, token} = req.body;

//     const id = "64c35980c9e2d236ae5fd078"
//     const id2 = "64c359f5c9e2d236ae5fd079"
//     // console.log(from, to, subject, body, id)
//     const client = new MongoClient(uri);
//     try {
//         const database = await client.db("Connect");
//         const userCollection = await database.collection("users");
//         const sendEmail = {
//             from: from,
//             to: to,

//             subject: subject,
//             body: body,
//             read: false,
//         }
//         const receiveEmail = {
//             from: from,
//             to: to,
//             subject: subject,
//             body: body,
//             imp: false,
//             deleted: false
//         }
        
//         const sendEmailResult = await userCollection.find({_id: new ObjectId(id2)}, { projection: { cmail: 1 } }).toArray();
//         const senderSent = sendEmailResult[0]['cmail']['sent']
//         const receiverReceived = sendEmailResult[0]['cmail']['received']

//         senderSent.push(sendEmail);
//         // console.log(sendEmailResult);

//     const resultt =  await userCollection.findOneAndUpdate({_id: new ObjectId(id2)}, {$set: {cmail: {sent: senderSent, received: receiverReceived}}});

//        const receiverID = await userCollection.find({email: to}).toArray();
//        const receiverID2 = (receiverID[0]._id).toString();
//         // console.log(receiverID)
//        const resultReceiver = await userCollection.find({_id: new ObjectId(receiverID2)}, {projection: {cmail: 1}}).toArray();
//        const senderSent2 = resultReceiver[0]['cmail']['sent']
//        const receiverReceived2 = resultReceiver[0]['cmail']['received']


//        receiverReceived2.push(receiveEmail);

//     //    console.log(receiverReceived2)
//         //  console.log(resultReceiver);   
//          const resultt2 =  await userCollection.findOneAndUpdate({_id: new ObjectId(receiverID2)}, {$set: {cmail: {sent: senderSent2,received: receiverReceived2}}});
//         //  console.log(resultt2)



//     //    console.log(resultt)
//     } finally {
//         client.close();
//     }
    
//     res.send("Email sent");
// }

async function clear(req,res){
    const client = new MongoClient(uri);

    const database = await client.db("Connect");
    const userCollection = await database.collection("users");

    await userCollection.findOneAndUpdate({_id: new ObjectId("64c35980c9e2d236ae5fd078")}, {$set: {cmail: {sent: [],received: []}}});
    await userCollection.findOneAndUpdate({_id: new ObjectId("64c359f5c9e2d236ae5fd079")}, {$set: {cmail: {sent: [],received: []}}});

    res.send("Cleared");

}


async function markImportant(req,res){

    const {token, unique_id} = req.body;
    const userId = await getIdFromToken(token);
    const client = new MongoClient(uri);
    
    const database = await client.db("Connect");
    const userCollection = await database.collection("users");

    const result = await userCollection.findOne({_id: new ObjectId(userId)}, {projection: {cmail: 1}});
    const received = result.cmail.received;
    const sent = result.cmail.sent;

    for(let i = 0; i < received.length; i++){

        if(received[i].unique_id == unique_id){
            received[i].imp = true;
            break;
        }
    }

    for(let i = 0; i < sent.length; i++){

        if(sent[i].unique_id == unique_id){
            sent[i].imp = true;
            break;
        }
    }



    await userCollection.findOneAndUpdate({_id: new ObjectId(userId)}, {$set: {cmail: {sent: sent,received: received}}});

    res.send("Marked important");

}

async function markUnimportant(req,res){


    const {token, unique_id} = req.body;
    const userId = await getIdFromToken(token);
    const client = new MongoClient(uri);
    
    const database = await client.db("Connect");
    const userCollection = await database.collection("users");
    
    const result = await userCollection.findOne({_id: new ObjectId(userId)}, {projection: {cmail: 1}});

    const received = result.cmail.received;
    const sent = result.cmail.sent;

    for(let i = 0; i < received.length; i++){


        if(received[i].unique_id == unique_id){

            received[i].imp = false;
            break;
        }
    }

    for(let i = 0; i < sent.length; i++){

        if(sent[i].unique_id == unique_id){
            sent[i].imp = false;
            break;
        } 
    }

    await userCollection.findOneAndUpdate({_id: new ObjectId(userId)}, {$set: {cmail: {sent: sent,received: received}}});

    res.send("Marked unimportant");

}

const deleteMail = async (req, res) => {
  console.log("\n\n\n\n\n\n\Deleting the Mail")
    const {token, unique_id} = req.body;
    console.log(token, unique_id)
    const userId = await getIdFromToken(token);
    console.log(userId)
    const client = new MongoClient(uri);
    
    const database = await client.db("Connect");
    const userCollection = await database.collection("users");


    const result = await userCollection.findOne({_id: new ObjectId(userId)}, {projection: {cmail: 1}});
    const received = result.cmail.received;
    const sent = result.cmail.sent;
    console.log(received)
    // console.log(sent)

    for(let i = 0; i < received.length; i++){

        if(received[i].unique_id == unique_id){
            received[i].deleted = true;
            break;
        }
    }

    for(let i = 0; i < sent.length; i++){


        if(sent[i].unique_id == unique_id){
          
          
            sent[i].deleted = true;
            break;  
        }
    }
    console.log(received)



    await userCollection.findOneAndUpdate({_id: new ObjectId(userId)}, {$set: {cmail: {sent: sent,received: received}}});

    res.status(200).send("Deleted");
}

const restoreMail = async (req, res) => {
  console.log("\n\n\n\n\n\n\ Restoring the Mail")

    const {token, unique_id} = req.body;
    console.log(token, unique_id)
    const userId = await getIdFromToken(token);
    console.log(userId)
    const client = new MongoClient(uri);
    
    const database = await client.db("Connect");
    const userCollection = await database.collection("users");


    const result = await userCollection.findOne({_id: new ObjectId(userId)}, {projection: {cmail: 1}});
    console.log(result)
    const received = result.cmail.received;
    const sent = result.cmail.sent;
    console.log(received)
    // console.log(sent)

    for(let i = 0; i < received.length; i++){


        if(received[i].unique_id == unique_id){
            received[i].deleted = false;
            break;
        }
    }

    for(let i = 0; i < sent.length; i++){


        if(sent[i].unique_id == unique_id){

            sent[i].deleted = false;
            break;
        }
    }
    console.log(received)



    await userCollection.findOneAndUpdate({_id: new ObjectId(userId)}, {$set: {cmail: {sent: sent,received: received}}});

    res.status(200).send("Restored");
}

const deleteForever = async (req, res) => {
  console.log("\n\n\n\n\n\n\ Deleting the Mail Forever")

    const {token, unique_id} = req.body;
    // console.log(token, unique_id)
    const userId = await getIdFromToken(token);
    // console.log(userId)
    const client = new MongoClient(uri);

    const database = await client.db("Connect");
    const userCollection = await database.collection("users");


    const result = await userCollection.findOne({_id: new ObjectId(userId)}, {projection: {cmail: 1}});
    const received = result.cmail.received;
    const sent = result.cmail.sent;
    // console.log(received)
    // console.log(sent)

    for(let i = 0; i < received.length; i++){


        if(received[i].unique_id == unique_id){
            received.splice(i, 1);
            break;
        }
    }

    for(let i = 0; i < sent.length; i++){ 


        if(sent[i].unique_id == unique_id){


            sent.splice(i, 1);  
            break;
        }
    }
    // console.log(received)rs
    



    await userCollection.findOneAndUpdate({_id: new ObjectId(userId)}, {$set: {cmail: {sent: sent,received: received}}});

    res.status(200).send("Deleted Forever");

}




module.exports = {
    sendEmail,
    clear,
    markImportant,
    markUnimportant,
    deleteMail,
    restoreMail,
    deleteForever

};  