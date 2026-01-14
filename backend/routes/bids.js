const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createBid, getBidsForGig, hireBid, getMyBids } = require('../controllers/bidController');

router.post('/', auth, createBid);
// 'me' must be before ':gigId' to avoid route parameter collision
router.get('/me', auth, getMyBids);
router.get('/:gigId', auth, getBidsForGig);
router.patch('/:bidId/hire', auth, hireBid);

module.exports = router;
