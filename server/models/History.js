import mongoose from "mongoose";
import contentSchema from './Content.js'
//Esquema y modelo para las historias
const historySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: [contentSchema], 
        default: [],
    },
    status: {
        type: String,
        enum: ['in progress', 'completed'],
        default: 'in progress',
    }
}, { timestamps: true })

const History = mongoose.model('History', historySchema)

export default History