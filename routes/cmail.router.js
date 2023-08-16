const express = require('express');
const mailController = require('../controllers/cmail.controller');

const userRouter = express.Router();


userRouter.post('/sendEmail', mailController.sendEmail);
userRouter.get('/clear', mailController.clear);

userRouter.post('/markImportant', mailController.markImportant);
userRouter.post('/markUnimportant', mailController.markUnimportant);
userRouter.post('/deleteMail', mailController.deleteMail);
userRouter.post('/restoreMail', mailController.restoreMail);
userRouter.post('/deleteForever', mailController.deleteForever);


module.exports = userRouter;


