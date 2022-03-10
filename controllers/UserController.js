const ApiError = require("../error/ApiError");
const {User} = require("../models/Models");

class UserController {


    async registration (req, res, next) {
        const {authId, name, picture} = req.body
        let username = name
        if(!name){
            username='New user'
        }
        console.log('user.sub, user.name, user.picture ', authId, username, picture)
        if (!authId) {
            return next(ApiError.badRequest('There is no authId!', ' user.sub, user.name, user.picture ', authId, username, picture))
        }
        const candidate = await User.findOne({where: {authId}})
        if (candidate) {
            return res.status(200).json({message: 'User was successfully logged in!'})
        }
        console.log('pic', picture)
        const user = await User.create({authId, username, profilePictureUrl:picture})
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
