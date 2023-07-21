const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    Title:{
        type: String,
    },
    Description:{
        type: String,
        required: true
    },
    Tag:{
        type: String,
        required: true,
        default: "General"
    },
    Date:{
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('notes', NotesSchema);