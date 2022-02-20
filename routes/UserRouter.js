const Router = require('express')
const router = new Router()
const userController = require('../controllers/UserController')
const JWTCheck = require("../utils/JWTCheck");

router.post('/registration', JWTCheck, userController.registration)

//router.get('/users', userController.getUsers)
router.get("/profile/:id", userController.getUser);
router.post("/getUser", userController.getUserByAuth);

module.exports = router