const Product = require('../models/product');
const Category = require('../models/category');

//category routes
// get all categories
const category_get = (req, res) => {
    Category.find()
    .then((catogories) => {
        res.render('products/category/categoryindex', {
            user: req.user,
            catogories: catogories,
            message : req.flash('error') 
          })
    })
    .catch((err) => {
        console.log(err);
    })
};

//create new category
const category_post = (req, res) => {
   
   const title = req.body.title
   Category.findOne({ title: title}, (err, category) => {
       if(err) {
           console.log(err);
       }

       if(category) {
        req.flash("error", "Category Already Exists");
        res.redirect('/products/category/categoryindex');
        console.log('Category Exits');
       } else {
        const category = new Category(req.body);
    
        category.save()
           .then((result) => {
               res.redirect('/products/category/categoryindex');
           })
           .catch((err) => {
               console.log(err);
           })
       }
   }) 
   
};

const category_edit_get = (req, res) => {
    const id = req.params.id;
    Category.findById(id)
      .then((category) => {
          res.render('products/category/edit', { category: category, user: req.user });
      })
      .catch((err) => {
          console.log(err);
      });
};

const category_edit_put = (req, res) => {
    const id = req.params.id;
    Category.findById(id)
      .then((category) => {
        category.title = req.body.title;
        category.save().then( updateCategory => {
              res.redirect('/products/category/categoryindex');
          })
        .catch((err) => {
            console.log(err);
        })
      })
};

const category_delete = (req, res) => {
    Category.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/products/category/categoryindex");
        }else{
            res.redirect("/products/category/categoryindex");
        }
    });
};


module.exports ={
    category_get,
    category_post,
    category_edit_get,
    category_edit_put,
    category_delete
}