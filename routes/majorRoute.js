const express = require('express');
const router = express.Router();
const majorController = require('../controllers/majorController');
const { authMiddleware, roleMiddleware } = require('../middleware/');
const { createMajorValidators, updateMajorValidators } = require('../validators/majorValidator');

router.get('/', authMiddleware, majorController.index);
router.post('/', authMiddleware, roleMiddleware(['admin']), createMajorValidators, majorController.create);
router.get('/:id', authMiddleware, majorController.read);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateMajorValidators, majorController.update);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), majorController.delete);

module.exports = router;
