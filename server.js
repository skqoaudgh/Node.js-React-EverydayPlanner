const express = require('express');
const mongoose = require('mongoose');

const app = express();

const isAuth = require('./middleware/isAuth');
const authRouter = require('./routers/auth');
const planRouter = require('./routers/myPlan');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
    if(req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(isAuth);
app.use('/auth', authRouter);
app.use('/planner', planRouter);

app.get('/', (req, res, next) => {
    res.send('Hello World!');
});

mongoose.connect('mongodb+srv://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASSWORD + '@node-rest-shop-zqnku.mongodb.net/' + process.env.MONGO_DB + '?retryWrites=true', 
{ useNewUrlParser: true})
.then( () =>  {
    app.listen(8000, () => {
        console.log('server is opened on port 8000');
    });
})
.catch(err=> {
    console.log(err);
});