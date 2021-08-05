const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { ensureAuthenticated } = require('../config/auth');


//category Routes
router.get('/category/categoryindex', categoryController.category_get);

//Create new category
router.post('/category/categoryindex', categoryController.category_post);

//Edit category
router.get('/category/:id/edit', categoryController.category_edit_get);

//update category
router.put('/category/:id', categoryController.category_edit_put);

//Delete category
router.delete("/category/:id", categoryController.category_delete);

module.exports = router; 