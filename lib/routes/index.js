'use strict';
const Signup = require('./signup');
const Login = require('./login');
const CreateClass = require('./create-class');
const GetClasses = require('./get-classes');
const MakeSuscription = require('./make-suscription');
const AcceptSuscription = require('./accept-suscription');
const ChangeStatusSuscription = require('./change-status-suscription');
const ChangeStatusClass = require('./change-status-class');
const GetTeacherInformation = require('./get-teacher-information');
const MyClasses = require('./my-classes');
const GetStudentInformation = require('./get-student-information');
const CreateComment = require('./create-comment');
const EditClass = require('./edit-class');
const UploadFile = require('./upload-file');
const CreateSuscription = require('./create-suscription');
const GetSuscriptions = require('./get-suscriptions');
const ValorateClass = require('./valorate-class');

module.exports = {
    GetTeacherInformation,
    Signup,
    Login,
    CreateClass,
    GetClasses,
    MakeSuscription,
    AcceptSuscription,
    ChangeStatusSuscription,
    ChangeStatusClass,
    MyClasses,
    GetStudentInformation,
    CreateComment,
    EditClass,
    UploadFile,
    CreateSuscription,
    GetSuscriptions,
    ValorateClass
};
