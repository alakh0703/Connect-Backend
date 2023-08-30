const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cmail: Object


});
const sqSchema = new mongoose.Schema({
    userID: String,
    sq1: String,
    sq2: String,
    sa1: String,
    sa2: String

});
const TaskSchema = new mongoose.Schema({
    UserID: String,
    pendingTask: Array,
    completedTask: Array
});

const TaskkSchema = new mongoose.Schema({
    description: String,
    completed: Boolean
});

const SendEmailSchema = new mongoose.Schema({
    from: String,
    to: String,
    subject: String,
    body: String,
    read: Boolean,
    
});

const receiveEmailSchema = new mongoose.Schema({
    from: String,
    to: String,
    subject: String,
    body: String,
    imp: Boolean,
    deleted: Boolean,
});


const User = mongoose.model('User', UserSchema);
const SendEmail = mongoose.model('SendEmail', SendEmailSchema);
const ReceiveEmail = mongoose.model('ReceiveEmail', receiveEmailSchema);
const Task = mongoose.model('Task', TaskSchema);
const Taskk = mongoose.model('Taskk', TaskkSchema);
const SQs = mongoose.model('SQ', sqSchema);


module.exports = {User, SendEmail, ReceiveEmail, Task, Taskk, SQs};