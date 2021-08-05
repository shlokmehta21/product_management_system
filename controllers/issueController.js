const Product = require("../models/product");
const Issue = require("../models/issue");
const IssueBack = require("../models/issueBack");
const Category = require("../models/category");
const Employee = require('../models/employee');
const mongoose = require("mongoose");

const issue_get = (req, res) => {
  const id = req.params.id;
  Product.findById(id)
    .then((product) => {
      Employee.find()
        .then((employee) => {
          res.render("products/issue/issueindex", {
            user: req.user,
            product: product,
            employee: employee,
            message: req.flash("error"),
          });
        })
    })
    .catch((err) => {
      console.log(err);
    });
};

const issue_post = (req, res) => {
  const id = req.params.id;

  Product.findById(id).then((product) => {
    const issue = new Issue({
      employee: req.body.employee,
      description: req.body.description,
      qty: req.body.qty,
      product: req.params.id,
    });
    if (req.body.qty > product.qty) {
      req.flash("error", "quantity is more than the stock quantity");
      res.redirect("/products/issue/" + id + "/issueindex");
      console.log("quantity is more than the stock quantity");
    } else {
      issue
        .save()
        .then((result) => {
          Product.findByIdAndUpdate(id, { $inc: { qty: -req.body.qty } }).then(
            (result) => {
              req.flash("success_msg", "Product Issued!");
              res.redirect("/products/issue/details/1");
              console.log("Data entered");
            }
          );
        })
        .catch((err) => {
          console.log("Data not entered");
          console.log(err);
        });
    }
  });
};

const issue_detail = (req, res) => {
  var perPage = 4;
  var page = req.params.page || 1;
  Issue.find()
  .sort({ createdAt: -1 })
  .skip((perPage * page) - perPage)
  .limit(perPage)
  .populate({ path: "product", populate: { path: "category"}})
  .populate({ path: "employee"})
  .then((issue) => {
    Issue.count().then((count) => {
      res.render("products/issue/details", {
        user: req.user,
        issue: issue,
        searchOptions: req.query,
        current : page,
        pages : Math.ceil(count / perPage),
        message: req.flash("success_msg"),
      });
    })
  })
  .catch((err) => {
    console.log(err);
  });
};

const issue_filter_detail = (req, res) => {
  var perPage = 20;
  var page = req.params.page || 1;
  Issue.find({issueTime: { $lte : req.query.issueBefore, $gte : req.query.issueAfter}})
  .sort({ createdAt: -1 })
  .skip((perPage * page) - perPage)
  .limit(perPage)
  .populate({ path: "product", populate: { path: "category"}})
  .populate({ path: "employee"})
  .then((issue) => {
    Issue.count().then((count) => {
      res.render("products/issue/filter_details", {
        user: req.user,
        issue: issue,
        searchOptions: req.query,
        current : page,
        pages : Math.ceil(count / perPage),
        message: req.flash("success_msg"),
      });
    })
  })
  .catch((err) => {
    console.log(err);
  });
}

const issue_return_get = (req, res) => {
  const id = req.params.id;
  Issue.findById(id)
    .populate({ path: "product", populate: { path: "category" }})
    .populate({ path: "employee"})
    .then((issue) => {
      console.log(issue);
      res.render("products/issue/return", {
        user: req.user,
        issue: issue,
        message: req.flash("error"),
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const issue_return_post = (req, res) => {
  const id = req.params.id;

  Issue.findById(id).then((issue) => {
    const issueBack = new IssueBack({
      remarks: req.body.remarks,
      qty: req.body.qty,
      issue: req.params.id,
    });
    if (req.body.qty > issue.qty) {
      req.flash("error", "quantity is more than the issued quantity");
      res.redirect("/products/issue/" + id + "/retrun");
    } else {
      issueBack
        .save()
        .then((result) => {
          Product.findByIdAndUpdate(issue.product, { 
            $inc: { qty: req.body.qty }
          })
          .then((result) => {
            Issue.findByIdAndUpdate(id, {
              $set: { status: true },
              $inc: { qty: -req.body.qty },
            }).then((result) => {
              req.flash("success_msg", "Product Retuned!");
              res.redirect("/products/issue/returnDetails/1");
            });
          })
        })
        .catch((err) => {
          console.log("not Retuned");
          console.log(err);
        });
    }
  });
};

const issue_return_details = (req, res) => {
    var perPage = 4;
    var page = req.params.page || 1;
    IssueBack.find()
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .populate([
      {
        "path": "issue",
        "populate": [
          {
            "path": "employee"
          },
          {
            "path": "product",
            "populate": { "path": "category" }
          }
        ]
      }
    ])
    .then((issueback) => {
      IssueBack.count().then((count) => {
        res.render("products/issue/returnDetails", {
          user: req.user,
          issueback: issueback,
          current : page,
          pages : Math.ceil(count / perPage),
          message: req.flash("success_msg"),
        });
      })
    })
    .catch((err) => {
      console.log(err);
    });
};

const issue_filter_return_details = (req, res) => {
  var perPage = 20;
  var page = req.params.page || 1;
  IssueBack.find({returnTime: { $lte : req.query.returnBefore, $gte : req.query.returnAfter}})
  .skip((perPage * page) - perPage)
  .limit(perPage)
  .populate([
    {
      "path": "issue",
      "populate": [
        {
          "path": "employee"
        },
        {
          "path": "product",
          "populate": { "path": "category" }
        }
      ]
    }
  ])
  .then((issueback) => {
    IssueBack.count().then((count) => {
      res.render("products/issue/filter_return", {
        user: req.user,
        issueback: issueback,
        searchOptions: req.query,
        current : page,
        pages : Math.ceil(count / perPage),
        message: req.flash("success_msg"),
      });
    })
  })
  .catch((err) => {
    console.log(err);
  });
};

const issue_delete = (req, res) => {
  const id = req.params.id;
  Issue.findById(id).then((issue) => {
    Product.findByIdAndUpdate(issue.product, { $inc: { qty: issue.qty } }).then(
      (result) => {
        Issue.findByIdAndRemove(req.params.id, function (err) {
          if (err) {
            res.redirect("/products/issue/details/1");
          } else {
            res.redirect("/products/issue/details/1");
          }
        });
      }
    );
  });
};

const issue_return_delete = (req, res) => {
  const id = req.params.id;
  IssueBack.findById(id).then((issueback) => {
    Issue.findByIdAndUpdate(issueback.issue, {
      $inc: { qty: issueback.qty },
      $set: { status: false }
    }).then((result) => {
      IssueBack.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
          res.redirect("/products/issue/returnDetails/1");
        } else {
          res.redirect("/products/issue/returnDetails/1");
        }
      });
    });
  });
};

module.exports = {
  issue_get,
  issue_post,
  issue_detail,
  issue_filter_detail,
  issue_return_get,
  issue_return_post,
  issue_return_details,
  issue_filter_return_details,
  issue_delete,
  issue_return_delete,
};
