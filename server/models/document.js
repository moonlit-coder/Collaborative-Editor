const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/docs-clone")
.then(()=>{
    console.log("Mongoose connected");
}).catch((e)=>{
    console.log("Error connecting to Mongoose");
})

const docSchema = new mongoose.Schema({
    _id:{
        type:String,
        required:true,
    },
    text:{
        type:Object,
    },
})

const document = mongoose.model('document',docSchema);
module.exports = document;