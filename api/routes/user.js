const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

// Handle incoming requests to /user
router.post('/signup' , UserController.create_user);

router.post('/login', UserController.user_login);

router.delete('/:userId', UserController.delete_user);

module.exports = router;