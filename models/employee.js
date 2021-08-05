const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    ename: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    enumber: {
        type: String,
        required: true
    },
    cnumber: {
        type: String,
        required: true
    },
    desig: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    }
});

const Employee = mongoose.model('employee',employeeSchema);

module.exports = Employee;