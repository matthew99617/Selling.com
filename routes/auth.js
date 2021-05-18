const express = require('express');
const authController = require('../database/auth');

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/updateUsername', authController.updateUsername);

router.post('/updatePassword', authController.updatePassword);

router.post('/sell', authController.sell);

router.post('/deleteFavourite/:productId', authController.deleteFavourite);

router.post('/update/:productId', authController.update);

router.post('/add-to-favourite/:productId', authController.favourite);

router.post('/edit-product/:productId', authController.edit);

router.post('/delete-product/:productId', authController.delete);

module.exports = router;