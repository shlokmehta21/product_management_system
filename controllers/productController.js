const Product = require("../models/product");
const Category = require("../models/category");
const Issue = require("../models/issue");
const IssueBack = require("../models/issueBack");
const User = require('../models/User');
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];
//product_dashboard , product_details , product_create_get ,product_create_post, product_edit_get, product_edit_put, product_delete

const product_dashboard = (req, res) => {
  var perPage = 5;
  var page = req.params.page || 1;
  Product.find()
    // .sort({ createdAt: -1 })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .populate("category")
    .then((product) => {
      Category.find()
        .then((catogories) => {
          Product.count().then((count) => {
            Issue.find().then((icount) => {
              IssueBack.find().then((ibcount) => {
                res.render("products/dashboard", {
                  catogories: catogories,
                  user: req.user,
                  product: product,
                  current : page,
                  count: count,
                  icount : icount,
                  ibcount: ibcount,
                  pages : Math.ceil(count / perPage),
                });
              })
            })
          })
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

const product_by_category = (req, res) => {
  var perPage = 5;
  var page = req.params.page || 1;
  const id = req.params.id;
  Category.findById(id)
    .then((category) => {
      Product.find({ category: category })
        .sort({ createdAt: -1 })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .populate("category") 
        .then((product) => {
          Category.find().then((catogories) => {
            Product.count().then((count) => {
              Issue.find().then((icount) => {
                IssueBack.find().then((ibcount) => {
                  res.render("products/cat_dashboard", {
                    catogories: catogories,
                    product: product,
                    user: req.user,
                    current : page,
                    count: count,
                    icount : icount,
                    ibcount: ibcount,
                    pages : Math.ceil(count / perPage),
                  });
                })
              })
            })
            .catch((err) => {
              console.log(err);
            })
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

const product_details = (req, res) => {
  const id = req.params.id;
  Product.findById(id)
  .populate({ path: "category"})
  .populate({ path: "user"})
    .then((product) => {
      res.render("products/details", { product: product, user: req.user });
    })
    .catch((err) => {
      console.log(err);
    });
};

const product_create_get = (req, res) => {
  Category.find()
    .then((catogories) => {
      res.render("products/create", {
         catogories: catogories, 
         user: req.user,
         message : req.flash('error') 
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

const product_create_post = (req, res) => {
const prodid = req.body.prodid;
  Product.findOne({ prodid: prodid }, (err, product) => {
    if(err) {
      console.log(err);
    }

    if(product){
       req.flash("error", "Product Already Exists");
       res.redirect('/products/create');
       console.log('product already exists');
    } else {
      const product = new Product({
        prodid: req.body.prodid,
        title: req.body.title,
        manufacturer: req.body.manufacturer,
        qty : req.body.qty,
        status: req.body.status,
        category: req.body.category,
        prange: req.body.prange,
        pdate: req.body.pdate,
        wdate: req.body.wdate,
        desc : req.body.desc,
        user: req.user._id
      });
    
      //For image saving.
      saveCover(product, req.body.cover);
    
      product
        .save()
        .then((result) => {
          req.flash("success_msg", "Product Saved!");
          res.redirect("/products/dashboard/1");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  })

};

const product_edit_get = (req, res) => {
  const id = req.params.id;
  Product.findById(id)
    .then((product) => {
      Category.find().then((catogories) => {
        res.render("products/edit", {
          product: product,
          products: product.coverImage,
          user: req.user,
          catogories: catogories,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const product_edit_put = (req, res) => {
  const id = req.params.id;
  Product.findById(id).then((product) => {
    product.prodid = req.body.prodid;
    product.title = req.body.title;
    product.manufacturer = req.body.manufacturer;
    product.qty = req.body.qty;
    product.status = req.body.status;
    product.category = req.body.category;
    product.prange = req.body.prange;
    product.pdate = req.body.pdate;
    product.wdate = req.body.wdate;
    product.desc = req.body.desc;

    if (req.body.cover != null && req.body.cover !== "") {
      saveCover(product, req.body.cover);
    }

    product.save().then((updateProduct) => {
      //console.log(`The pr ${updateProduct.title} has been updated`);
      res.redirect("/products/dashboard/1");
    });
  });
};

const product_delete = (req, res) => {
  Product.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/products/dashboard/1");
    } else {
      req.flash("error", "Product Deleted!");
      res.redirect("/products/dashboard/1");
    }
  });
};

function saveCover(product, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    product.coverImage = new Buffer.from(cover.data, "base64");
    product.coverImageType = cover.type;
  }
}

module.exports = {
  product_dashboard,
  product_by_category,
  product_details,
  product_create_get,
  product_create_post,
  product_edit_get,
  product_edit_put,
  product_delete
};
