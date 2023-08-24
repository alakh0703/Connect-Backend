const express = require('express');
const tasksController = require('../controllers/tasks.controller');

const taskRouter = express.Router();

// userRouter.get('/low',(req,res) => {
//     res.send('ur high');
//     }
//     );
    
taskRouter.post('/addTask', tasksController.addTask);
taskRouter.post('/deleteTask', tasksController.deleteTask);
taskRouter.post('/completeTask', tasksController.completeTask);

taskRouter.post('/restoreTask', tasksController.restoreTask);
taskRouter.post('/deleteTask2', tasksController.deleteTask2);
taskRouter.post('/getTasks', tasksController.getTasks2);

module.exports = taskRouter;