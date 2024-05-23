const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/itemPost', authenticateToken, itemController.createItem);
router.get('/itemGetAll', authenticateToken, itemController.getAllItems);
router.get('/itemGetOne/:id', authenticateToken, itemController.getItemById);
router.patch('/itemUpdate/:id', authenticateToken, itemController.updateItem);
router.delete('/itemDelete/:id', authenticateToken, itemController.deleteItem);

module.exports = router;
