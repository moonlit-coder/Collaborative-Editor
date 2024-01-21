const dotEnv = require('dot-env');
dotEnv.config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL)
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
