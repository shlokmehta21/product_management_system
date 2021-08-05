const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { ensureAuthenticated } = require('../config/auth');

// Gets data from the database and displays into the table view.
router.get('/dashboard/:page', ensureAuthenticated, productController.product_dashboard);

//gets product category wise
router.get('/dashboard/:id/:page', productController.product_by_category);

//gets create page
router.get('/create', productController.product_create_get);

//Posting new content added by user on add blog page to homepage.
router.post('/create',productController.product_create_post);

//Shows a product in a detail view.
router.get('/:id' , productController.product_details);

//gets data and shows it in the edit page.
router.get('/:id/edit', productController.product_edit_get);

//update req
router.put("/:id", productController.product_edit_put);

//Delete req
router.delete("/:id", productController.product_delete);

module.exports = router; 