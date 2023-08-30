const express = require('express');
const userController = require('../controllers/user.controller');

const userRouter = express.Router();


userRouter.get('/allMails', userController.getAllEmails)
userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.get('/verifyToken', userController.verifyToken);
userRouter.get('/retriveMails', userController.retriveMails);
userRouter.post('/deleteAccount', userController.deleteMyAccount);
userRouter.post('/check', userController.checkExistingUser);
userRouter.post('/resetPassword', userController.resetPassword);
userRouter.post('/updatePassword', userController.updatePassword);

module.exports = userRouter;