'use strict';
import {Schema, model} from "mongoose";

const commentSchema = new Schema({
    class: {
        type: Schema.Types.ObjectId,
        ref: 'Class'
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pendiente', 'Aceptado', 'Bloqueado'],
        default: 'Pendiente'
    },
    reasonBlocked: String
})

return model('Comment', commentSchema);