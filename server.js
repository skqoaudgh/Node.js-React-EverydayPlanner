const express = require('express');
const mongoose = require('mongoose');

const app = express();

const authRouter = require('./routers/auth');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/auth', authRouter);

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