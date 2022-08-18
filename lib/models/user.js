'use strict';
import {Schema, model} from "mongoose";
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    surName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'teacher'],
        default: 'student'
    },
    classes: [{
        type: Schema.Types.ObjectId,
        ref: 'Class'
    }]
}, {
    timestamps: true
});

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.toToken = function() {
    return {
        id: this._id,
        email: this.email,
        firstName: this.firstName,
        surName: this.surName,
        role: this.role
    };
};

userSchema.pre('save', function(next) {
    const user = this;
    if (user.isModified('password')) {
        // user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
    }
    return next();
});

module.exports = model('User', userSchema);
