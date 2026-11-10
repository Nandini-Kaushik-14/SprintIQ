const router = require('express').Router();
const { updateStatus } = require('../controllers/storyController');
const { protect } = require('../middleware/authMiddleware');

router.patch('/:storyId/status', protect, updateStatus);
module.exports = router;
