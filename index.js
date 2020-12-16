const mongoose = require('mongoose');
const app = require('./app').app;

// mongoose.connect(url)
// .then(()=>console.log("mongoose connected"))
// .catch((err)=> console.log(err))

app.listen(8080);