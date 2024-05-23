const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const itemController = require('../controllers/itemController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/getUser', authenticateToken, userController.getUser);
router.patch('/updateUser', authenticateToken, userController.updateUser);
router.patch('/changePassword', authenticateToken, userController.changePassword);
router.patch('/updateUser', authenticateToken, userController.updateUserDetails);
router.delete('/deleteUser', authenticateToken,itemController.deleteAllItems ,userController.deleteUser);

module.exports = router;
