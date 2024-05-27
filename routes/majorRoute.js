const express = require('express');
const router = express.Router();
const majorController = require('../controllers/majorController');
const { authMiddleware, roleMiddleware } = require('../middleware/');

router.get('/', authMiddleware, majorController.index);
router.get('/:id', authMiddleware, majorController.read);
router.post('/', authMiddleware, roleMiddleware(['admin']), majorController.create);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), majorController.read);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), majorController.delete);

module.exports = router;