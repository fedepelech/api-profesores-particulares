'use strict';
const Signup = require('./signup');
const Login = require('./login');
const CreateClass = require('./create-class');
const GetClasses = require('./get-classes');
const MakeSuscription = require('./make-suscription');
const AcceptSuscription = require('./accept-suscription');
const ChangeStatusSuscription = require('./change-status-suscription');
const ChangeStatusClass = require('./change-status-class');

module.exports = {
    Signup,
    Login,
    CreateClass,
    GetClasses,
    MakeSuscription,
    AcceptSuscription,
    ChangeStatusSuscription,
    ChangeStatusClass
};
