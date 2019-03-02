const express = require("express");
const mongoose = require("mongoose");
const bcrypt   = require('bcrypt-nodejs');
const passportLocal = require("passport-local-mongoose")

const flatSchema= new mongoose.Schema({
    local            : {
        flatname     :String,
        email        : String,
        password     : String,
    }

});
// flatSchema.plugin(passportLocal);
// methods ======================
// generating a hash
flatSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
flatSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = new mongoose.model('flat', flatSchema,"flat");
