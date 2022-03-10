const ApiError = require("../error/ApiError");
const {User} = require("../models/Models");

class UserController {


    async registration (req, res, next) {
        const {authId, name, picture} = req.body
        console.log('user.sub, user.name, user.picture ', authId, name, picture)
        if (!name || !authId) {
            return next(ApiError.badRequest('There is no authId or user name!', ' user.sub, user.name, user.picture ', authId, name, picture))
        }
        const candidate = await User.findOne({where: {authId}})
        if (candidate) {
            return res.status(200).json({message: 'User was successfully logged in!'})
        }
        console.log('pic', picture)
        const user = await User.create({authId, name, profilePictureUrl:picture})
        return res.status(200).json({message: 'User was successfully registered!'})
    }



    async getUser(req, res, next) {
        const {id} = req.body
        const user = await User.findOne({where: {id: id}})
        return res.json(user)
    }

    async reactDropzonePlug(req, res, next) {

        return res.status(200).json({message: 'just imitation of server answer that file was uploaded'})
    }

    async getUserByAuth(req, res, next) {
        const {authId} = req.body
        const user = await User.findOne({where: {authId}})
        return res.json(user)
    }

}

module.exports = new UserController()
