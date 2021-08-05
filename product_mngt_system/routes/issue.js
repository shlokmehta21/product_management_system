const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const Issue = require('../models/issue');
const Prodcut = require('../models/product');

router.get('/issue/details/:page',issueController.issue_detail);

router.get('/issue/filter_details/:page',issueController.issue_filter_detail);

router.get('/issue/returnDetails/:page', issueController.issue_return_details);

router.get('/issue/filter_return/:page', issueController.issue_filter_return_details);

router.get('/issue/:id/issueindex',issueController.issue_get);

router.post('/issue/:id/issueindex',issueController.issue_post);

router.get('/issue/:id/retrun',issueController.issue_return_get);

router.post('/issue/:id/retrun',issueController.issue_return_post);

router.delete('/issue/:id',issueController.issue_delete);

router.delete('/issue/:id/returnDetails',issueController.issue_return_delete);


module.exports = router; 