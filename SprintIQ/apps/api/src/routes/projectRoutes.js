const router = require('express').Router();
const { list, create, getOne } = require('../controllers/projectController');
const { listByProject, create: createStory } = require('../controllers/storyController');
const { summary } = require('../modules/analytics/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', list);
router.post('/', create);
router.get('/:projectId', getOne);
router.get('/:projectId/stories', listByProject);
router.post('/:projectId/stories', createStory);
router.get('/:projectId/analytics/summary', summary);

module.exports = router;
