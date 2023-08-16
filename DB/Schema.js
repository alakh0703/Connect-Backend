const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cmail: Object


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


module.exports = {User, SendEmail, ReceiveEmail};