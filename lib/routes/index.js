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
    UploadFile
};
