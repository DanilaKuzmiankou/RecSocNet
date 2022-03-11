const Router = require('express')
const router = new Router()
const userController = require('../controllers/UserController')
const JWTCheck = require("../utils/JWTCheck");

router.post('/registration', JWTCheck, userController.registration)

//router.get('/users', userController.getUsers)
router.post("/getUser", userController.getUserByAuth);
router.post("/getUserById", userController.getUser);
router.post("/changeName", userController.changeName);
module.exports = router