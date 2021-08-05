const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueSchema = new Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee'
    },
    status: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        default: 0
    },  
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prodcut'
    },
    issueTime: {
        type: Date,
        default: Date.now()
    }
});

const Issue = mongoose.model('issue',issueSchema);

module.exports = Issue;