const express = require('express');

const app = express();

app.get('/', (req, res, next) => {
    res.send('Hello World!');
});

app.listen(5000, function() {
    console.log('express server is opened on port 5000');
});