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
    let { authId, newUserName } = req.body;
    const answer = await userController.validateUserName(newUserName);
    if (answer === "") {
      const candidate = await User.findOne({ where: { authId } });
      if (candidate) {
        newUserName = newUserName.trim();
        await candidate.update({ name: newUserName });
        return res
          .status(200)
          .json({ message: "Name was successfully changed!" });
      }
      return res.status(202).json({ message: "User was not found" });
    }
    return res.status(202).json({ message: answer });
  }

  async validateUserName(username) {
    if (!username) return "Not valid user name.";
    const candidate = await User.findOne({ where: { name: username } });
    if (candidate) return "This username is already taken!";
    if (username.length > 30) return "Name max length is 30 symbols!";
    return "";
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
  async getUsers(req, res, next) {
    return res.json(
      await User.findAll({ attributes: ["id", "name", "profilePictureUrl"] })
    );
  }
}

module.exports = new UserController();
