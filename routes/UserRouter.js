const Router = require("express");
const router = new Router();
const userController = require("../controllers/UserController");
const JWTCheck = require("../utils/JWTCheck");

router.post("/registration", JWTCheck, userController.registration);

router.post("/getUser", userController.getUserByAuth);
router.post("/getUsers", userController.getUsers);
router.post("/getUserById", userController.getUserById);
router.post("/changeName", userController.changeName);
router.post("/changeTheme", userController.changeTheme);
router.post("/changeLanguage", userController.changeLanguage);

module.exports = router;
