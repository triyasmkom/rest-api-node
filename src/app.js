const express = require('express');
const cors = require('cors');
const routes = require("./routes.js");
const response = require('./helpers/response.js')


const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get('/', async (req, res, next)=>{
    res.status(200).send({
        message: `Hallo, ini adalah REST API Backend Todo List`
    });
});

// route
routes(app);

// error handling
app.use(response.errorHandling)

app.listen(port, ()=>{
    console.log(`Server Listening on http://localhost:${port}`);
});
