const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createBid, getBidsForGig, hireBid, getMyBids } = require('../controllers/bidController');

router.post('/', auth, createBid);
router.get('/:gigId', auth, getBidsForGig);
router.get('/me', auth, getMyBids);
router.patch('/:bidId/hire', auth, hireBid);

module.exports = router;
