const express = require('express');
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const app = express();
const userRoutes = require('./routes/userRoute');
const transactionRoutes = require('./routes/transactionRoutes');
const path = require('path');

app.use(express.json())
dotenv.config();

app.use('/users' , userRoutes);
app.use('/transactions' , transactionRoutes);
app.use(express.static(path.join(__dirname , './client/build')))
app.get('*' , function (req , res) {
    res.sendFile(path.join(__dirname , "./client/build/index.html"));
})
const dburl = 'mongodb://localhost:27017/expenses';

mongoose.connect(dburl , {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.listen(8000 , ()=> {
    console.log("from port 8000");
})