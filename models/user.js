const express = require("express");
const mongoose = require("mongoose");
const bcrypt   = require('bcrypt-nodejs');
const passportLocal = require("passport-local-mongoose")

const userSchema= new mongoose.Schema({
    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String
    }

});
// userSchema.plugin(passportLocal);
// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = new mongoose.model('user', userSchema,"user");
