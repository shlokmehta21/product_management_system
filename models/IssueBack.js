const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueBackSchema = new Schema({
    remarks: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        default: 0
    },  
    issue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'issue'
    },
    returnTime: {
        type: Date,
        default: Date.now()
    }
});

const IssueBack = mongoose.model('issueBack',issueBackSchema);

module.exports = IssueBack;