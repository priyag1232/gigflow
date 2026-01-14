const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createGig, getGigs, getGigById } = require('../controllers/gigController');

router.get('/', getGigs);
router.get('/:id', getGigById);
router.post('/', auth, createGig);

module.exports = router;
