const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authMiddleware, roleMiddleware } = require('../middleware/');
const { createStudentValidators, updateStudentValidators } = require('../validators/studentValidator');

router.get('/', authMiddleware, roleMiddleware(['admin', 'mahasiswa']), studentController.index);
router.post('/', authMiddleware, roleMiddleware(['unknown']), createStudentValidators, studentController.create);
router.get('/:id', authMiddleware, roleMiddleware(['admin']), studentController.read);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'mahasiswa']), updateStudentValidators, studentController.update);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), studentController.delete);

module.exports = router;
