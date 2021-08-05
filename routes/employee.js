const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
//Get all employee list
router.get('/employee/create_emp/:page',  employeeController.employee_get_details);

//category Routes
// router.get('/employee/create_emp',  employeeController.employee_get);

//Create new Employee
router.post('/employee/create_emp/:page', employeeController.employee_post);

// //Edit emoloyee
 router.get('/employee/:id/edit_emp', employeeController.employee_edit_get);

// //update employee
 router.put('/employee/:id', employeeController.employee_edit_put);

// //Delete employee
 router.delete("/employee/:id", employeeController.Employee_delete);

module.exports = router; 