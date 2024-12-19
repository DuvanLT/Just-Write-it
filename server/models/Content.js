import mongoose from "mongoose"

//Esquema y modelo para el contenido dentro de una historia
const contentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        maxlength: 200,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    approved: {
        type: Boolean,
        default: false,
    }
})

export default contentSchema