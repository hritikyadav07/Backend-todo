const express = require('express');
const {UserModel, TodoModel} = require('./db');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const {auth, JWT_SECRET} = require('./auth');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb+srv://Azmo:v9EVgustnUtyMIE8@cluster0.egfji.mongodb.net/backen-todo')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Database connection error:', err));

const app = express();
app.use(express.json());

app.post('/signup',async function(req, res){
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({
            name: name,
            email:email,
            password: hashedPassword
        });

        res.json({
            message:"User Is created Proceed to Login"
        });
    } catch(e){
        res.status(500).json({
            message:"Error while signing up"
        })
    }
});

app.post('/login', async function(req, res){
    
    const email = req.body.email;
    const password = req.body.password;

    const response = await UserModel.findOne({
        email:email,
    });

    const passwordMatch = await bcrypt.compare(password, response.password);

    if(response && passwordMatch){
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

//auth function decodes token and adds userId to req

app.post('/todo', auth, async function(req, res){
    //req.userId already in req by auth function
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
    }).populate('userId').exec();

    res.json({
        todos
    })
});

app.listen(3000);