const express = require('express');
const mongoose = require('mongoose');

const app = express();

const isAuth = require('./middleware/isAuth');
const authRouter = require('./routers/auth');
const planRouter = require('./routers/myPlan');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(isAuth);
app.use('/auth', authRouter);
app.use('/my', planRouter);

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