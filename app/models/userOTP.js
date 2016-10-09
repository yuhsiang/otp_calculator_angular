var mongoose = require('mongoose');
var schema = mongoose.Schema;
var userId = schema.ObjectId;

var key = new schema({
    name: String,
    key: String,
    interval: Number
});

var userSchema = new schema({
    text: {
        type: String,
        default: ''
    },
    keys: [key]
    
})

module.exports = mongoose.model('UserOTP', userSchema);
