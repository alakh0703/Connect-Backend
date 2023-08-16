const PORT = process.env.PORT || 3000;

const userRouter = require('./routes/user.router');
const connectMongoDB = require('./DB/connectDB');

const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const mailRouter = require('./routes/cmail.router');

const app = express();


app.use(cors());


app.use(express.json());


connectMongoDB();

app.use((req,res,next) => {
    const start = Date.now();
    
    next();
    
    const delta = Date.now() - start;
    console.log(`${req.method} ${req.baseUrl} ${req.url} ${delta}ms`);
    }
    );


app.get('/',(req,res) => {
    res.send('Hello World');
    });

app.use('/connect/users', userRouter);

app.use('/connect/email', mailRouter);
app.listen(PORT, () => {
    console.log('Server listening on port 3000');
    } 
);


