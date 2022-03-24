const ApiError = require("../error/ApiError");
const { User } = require("../models/Models");

let userController = this;

class UserController {
  constructor() {
    userController = this;
  }

  async registration(req, res, next) {
    const { authId, name, picture } = req.body;
    let username = name;
    if (!name || name === "") {
      username = "New user";
    }
    if (!authId) {
      return next(
        ApiError.badRequest(
          "There is no authId!",
          " user.sub, user.name, user.picture ",
          authId,
          username,
          picture
        )
      );
    }
    const candidate = await User.findOne({ where: { authId } });
    if (candidate) {
      return res
        .status(200)
        .json({ message: "User was successfully logged in!" });
    }
    const user = await User.create({
      authId,
      name: username,
      profilePictureUrl: picture,
    });
    return res
      .status(200)
      .json({ message: "User was successfully registered!" });
  }

  async changeName(req, res, next) {
    const { authId, newUserName } = req.body;
    let answer = await userController.validateUserName(newUserName);
    if (answer === "") {
      const candidate = await User.findOne({ where: { authId } });
      if (candidate) {
        await candidate.update({ name: newUserName });
        return res
          .status(200)
          .json({ message: "User name was successfully changed!" });
      }
      return res.status(202).json({ message: "User was not found" });
    }
    return res.status(202).json({ message: answer });
  }

  async validateUserName(username) {
    if (username && !/\s/.test(username)) {
      const candidate = await User.findOne({ where: { name: username } });
      if (!candidate) {
        return "";
      }
      return "This username is already taken!";
    }
    return "Not valid user name. Spaces are not allowed!";
  }

  async getUser(req, res, next) {
    const { id } = req.body;
    const user = await User.findOne({ where: { id: id } });
    return res.json(user);
  }

  async getUserByAuth(req, res, next) {
    const { authId } = req.body;
    const user = await User.findOne({ where: { authId } });
    return res.json(user);
  }
}

module.exports = new UserController();
