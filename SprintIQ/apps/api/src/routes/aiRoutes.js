const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { estimateStory, sprintAdvisor, blockerAssistant } = require('../controllers/aiController');

router.use(protect);
router.post('/estimate-story', estimateStory);
router.post('/sprint-advisor', sprintAdvisor);
router.post('/blocker-assistant', blockerAssistant);

module.exports = router;
