'use strict';
const Signup = require('./signup');
const Login = require('./login');
const CreateClass = require('./create-class');
const GetClasses = require('./get-classes');
const MakeSuscription = require('./make-suscription');
const AcceptSuscription = require('./accept-suscription');
const ChangeStatusSuscription = require('./change-status-suscription');

module.exports = {
    Signup,
    Login,
    CreateClass,
    GetClasses,
    MakeSuscription,
    AcceptSuscription,
    ChangeStatusSuscription
};
