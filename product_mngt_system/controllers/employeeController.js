const Employee = require('../models/employee');
const employee_get_details = (req, res) => {
    var perPage = 3;
    var page = req.params.page || 1;
    Employee.find()
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .then((employee) => {
        Employee.count().then((count) => {
            res.render('products/employee/create_emp', {
                employee : employee,
                user: req.user,
                current : page,
                pages : Math.ceil(count / perPage), 
                message : req.flash('error')       
              })
        })
    })
    .catch((err) => {
        console.log(err);
    })
};


// const employee_get = (req, res) => {
//     res.render('products/employee/create_emp', {user: req.user});
// }
//create new employee
const employee_post = (req, res) => {
    const enumber = req.body.enumber
    Employee.findOne({enumber: enumber}, (err, employee) => {
        if(err) {
            console.log(err);
        }
        if(employee){
            req.flash("error", "Employee Already Exists")
            res.redirect('/products/employee/create_emp/1')
            console.log('Employee Exists');
        } else {
            const employee = new Employee({
                ename: req.body.ename,
                email: req.body.email,
                enumber: req.body.enumber,
                cnumber: req.body.cnumber,
                desig: req.body.desig,
                department: req.body.department
            }) 
            employee.save().then((result) => {
                res.redirect("/products/employee/create_emp/1");
            })
            .catch((err) => {
                console.log(err);
            })

        }
    })
 };

 const employee_edit_get = (req, res) => {
     const id = req.params.id;
     Employee.findById(id)
       .then((employee) => {
           res.render('products/employee/edit_emp',
           {
               employee: employee,
               user: req.user
           })
       })
       .catch((err) => {
           console.log(err);
       })
 }

 const employee_edit_put = (req, res) => {
     const id = req.params.id;
     Employee.findById(id).then((employee) => {
        employee.ename = req.body.ename;
        employee.email = req.body.email;
        employee.enumber = req.body.enumber;
        employee.cnumber = req.body.cnumber;
        employee.desig = req.body.desig;
        employee.department = req.body.department;

        employee.save().then((updateemployee) => {
            res.redirect("/products/employee/create_emp/1");
         })
     })
 }

 const Employee_delete = (req, res) => {
    Employee.findByIdAndRemove(req.params.id, function (err) {
      if (err) {
        res.redirect("/products/employee/create_emp/1");
      } else {
        req.flash("error", "Employee Deleted!");
        res.redirect("/products/employee/create_emp/1");
      }
    });
  };
 

 module.exports = {
    //  employee_get,
     employee_post,
     employee_get_details,
     employee_edit_get,
     employee_edit_put,
     Employee_delete
 }