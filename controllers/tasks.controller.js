const ObjectId = require('mongodb').ObjectId;
const { get } = require('mongoose');
const {getIdFromToken} = require('./user.controller');
const Taskk = require('../DB/Schema').Taskk;
const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb://0.0.0.0/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.1"
const uri = "mongodb+srv://alakh7:Al%40070303@cluster0.5cu8i8d.mongodb.net/"

async function getTasks(token) {
    console.log("Getting Tasks....")
    // console.log(req.body)

    const client = new MongoClient(uri)


        try {
    const database = client.db("Connect");
    const taskCollection = database.collection("tasks");
    // create a document to insert
    console.log("1")
    const userId = await getIdFromToken(token);
    console.log("2")
    // converting string to ObjectId
    const result = await taskCollection.findOne({UserID: userId}, {projection: {pendingTask: 1, completedTask: 1}});
    console.log("3")
// console.log("RESULT: ", result)
    return result;
        } catch (err) {
            console.log(err)
        }
        finally {
            await client.close();

        }

}
async function getTasks2(req,res) {
    console.log("Getting Tasks....")
    // console.log(req.body)
    const {token} = req.body;


    const client = new MongoClient(uri)


        try {
    const database = client.db("Connect");
    const taskCollection = database.collection("tasks");
    const userId = await getIdFromToken(token);
    const result = await taskCollection.findOne({UserID: userId}, {projection: {pendingTask: 1, completedTask: 1}});

    const a = result.pendingTask;
    const b = result.completedTask;
    const x = [a, b]
    res.send(x);
    return result;
        } catch (err) {
            console.log(err)
        }
        finally {
            await client.close();

        }

}

async function addTask(req,res) {
    console.log("Adding Task....")
    // console.log(req.body)
    const {token, newTask} = req.body;

    const client = new MongoClient(uri)

        try {
    const database = client.db("Connect");
    const taskCollection = database.collection("tasks");
    // create a document to insert
    const userId = await getIdFromToken(token);

    // converting string to ObjectId
    const userId_ = new ObjectId(userId);
 
    const AllTask = await taskCollection.findOne({UserID: userId}, {projection: {pendingTask: 1}});
    console.log(AllTask)
    var curPendingTask = AllTask.pendingTask;
    console.log(curPendingTask);

const newTask_ = new Taskk({
    description: newTask,
    completed: false
});
    curPendingTask.push(newTask_);
    const newPendingTask = curPendingTask;
    const result = await taskCollection.updateOne({UserID: userId}, {$set: {pendingTask: newPendingTask}});
    const resultt = await getTasks(token);
    const a = resultt.pendingTask;
    const b = resultt.completedTask;
    const x = [a, b]
    res.send(x);


        } catch (err) {
            res.send(err);
            console.log(err)
        }
        finally {
            await client.close();
        }
 
}
async function completeTask(req,res) {
    console.log("Completing Task....")
    // console.log(req.body)
    const {token,updatedTasks, uctasks} = req.body;
    // console.log(completedTask)

    const client = new MongoClient(uri)

        try {
    const database = client.db("Connect");
    const taskCollection = database.collection("tasks");
    // create a document to insert
    const userId = await getIdFromToken(token);
            
    console.log(updatedTasks, uctasks)

    const newPendingTask = updatedTasks.map((task) => { 
        const new1 = new Taskk({
            description: task,
            completed: false
        })

        return new1;
        })

    const newCompletedTask = uctasks.map((task) => {
        const new2 = new Taskk({
            description: task,
            completed: true
        })

        return new2;
        }
        )


    await taskCollection.updateOne({UserID: userId}, {$set: {pendingTask: newPendingTask, completedTask: newCompletedTask}});
    const resultt = await getTasks(token);
    const a = resultt.pendingTask;
    const b = resultt.completedTask;
    const x = [a, b]
    res.send(x);


        } catch (err) {

        }
        finally {
            await client.close();
        }

}

async function deleteTask(req,res) {
    console.log("Deleting Task....")
    // console.log(req.body)
    const {token, updatedTasks} = req.body;
    console.log(updatedTasks)

    const client = new MongoClient(uri)

    const newUpdatedTasks = updatedTasks.map((task) => {
        const new1 = new Taskk({
            description: task,
            completed: false
        })

        return new1;
        })
        
        console.log(newUpdatedTasks)

    


        try {
    const database = client.db("Connect");
    const taskCollection = database.collection("tasks");
    // create a document to insert
    const userId = await getIdFromToken(token);


 

    const result = await taskCollection.updateOne({UserID: userId}, {$set: {pendingTask: newUpdatedTasks}});
        // res.send(newPendingTask);
        const resultt = await getTasks(token);
        console.log(resultt)
        const a = resultt.pendingTask;
        const b = resultt.completedTask;
        const x = [a, b]
        res.send(x);


        } catch (err) {
            res.send(err);
            console.log(err)
        }
        finally {
            await client.close();
        }
}
async function deleteTask2(req,res) {
    console.log("Deleting Task....")
    // console.log(req.body)
    const {token, updatedTasks} = req.body;
    console.log(updatedTasks)

    const client = new MongoClient(uri)

    const newUpdatedTasks = updatedTasks.map((task) => {
        const new1 = new Taskk({
            description: task,
            completed: false
        })

        return new1;
        })
        
        console.log(newUpdatedTasks)

    


        try {
    const database = client.db("Connect");
    const taskCollection = database.collection("tasks");
    // create a document to insert
    const userId = await getIdFromToken(token);


 

    const result = await taskCollection.updateOne({UserID: userId}, {$set: {completedTask: newUpdatedTasks}});
        // res.send(newPendingTask);
        const resultt = await getTasks(token);
        console.log(resultt)
        const a = resultt.pendingTask;
        const b = resultt.completedTask;
        const x = [a, b]
        res.send(x);


        } catch (err) {
            res.send(err);
            console.log(err)
        }
        finally {
            await client.close();
        }
}
async function restoreTask(req,res) {

    console.log("Restoring Task....")
    // console.log(req.body)
    const {token, updatedTasks, pendingTasks} = req.body;
    console.log(updatedTasks)
    console.log(pendingTasks)
    
    const client = new MongoClient(uri)
    
    const pendingTask = pendingTasks.map((task) => {
        const new1 = new Taskk({
            description: task,
            completed: false
        })

        return new1;
        }
    
        )

    const newUpdatedTasks = updatedTasks.map((task) => {
        const new1 = new Taskk({
            description: task,
            completed: true
        })

        return new1;
        }
        
        )

            try {

    const database = client.db("Connect");
    const taskCollection = database.collection("tasks");
    // create a document to insert
    const userId = await getIdFromToken(token);

    await taskCollection.updateOne({UserID: userId}, {$set: {pendingTask: pendingTask, completedTask: newUpdatedTasks}});
    const n = [pendingTask, newUpdatedTasks]
    res.send(n);


                
            } catch (err) { 
                res.send(err);
                console.log(err)
            }

            finally {
                await client.close();
            }
}


module.exports = {addTask, deleteTask , completeTask, restoreTask, deleteTask2, getTasks2};