const express = require('express');
const {UserModel, TodoModel} = require('./db');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const {auth, JWT_SECRET} = require('./auth');

mongoose.connect('mongodb link')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Database connection error:', err));

const app = express();
app.use(express.json());

app.post('/signup',async function(req, res){
    
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    await UserModel.create({
        name: name,
        email:email,
        password: password
    });

    res.json({
        message:"User Is created Proceed to Login"
    });
});

app.post('/login', async function(req, res){
    const email = req.body.email;
    const password = req.body.password;

    const response = await UserModel.findOne({
        email:email,
        password:password
    });

    if(response){
        const token = jwt.sign({
            userId: response._id.toString()
        },JWT_SECRET);

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message:"invalid credentials"
        })
    }


});

app.post('/todo', auth, async function(req, res){
    const userId =req.userId;
    const title = req.body.title;
    const done = req.body.done;
    console.log(req.body);
    await TodoModel.create({
        userId: userId,
        title: title,
        done: done
    });

    res.json({
        messsage: "todo created"
    })
    
});


app.get('/todos', auth, async function(req, res){
    const userId =req.userId;

    const todos = await TodoModel.find({
        userId
    })

    res.json({
        todos
    })
});

app.listen(3000);
