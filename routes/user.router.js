const express = require('express');
const userController = require('../controllers/user.controller');

const userRouter = express.Router();

userRouter.get('/low',(req,res) => {
    res.send('ur high');
    }
    );
    
userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.get('/verifyToken', userController.verifyToken);
userRouter.get('/retriveMails', userController.retriveMails);

module.exports = userRouter;