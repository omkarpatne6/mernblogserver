const mongoose  = require('mongoose');
const validator = require('validator');

const schema = new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        required: true
    },
    email : {
        type: String,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("This is not a correct email format")
            }
        },
        unique: [true, "This email already exists"],
        required: true,
        trim: true
    },
    slug : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String,
        required : true,
        trim : true
    },
    date : String,
    datestring : String
})

const Mydatabase = new mongoose.model('blogDatabase', schema);

module.exports = Mydatabase;