const sequelize = require('../DB')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    authId: {type: DataTypes.STRING, allowNull:false, unique: true},
    name: {type: DataTypes.STRING, allowNull:false},
    role: {type: DataTypes.STRING, defaultValue: "user"},
    likes: {type: DataTypes.INTEGER},
    createdAt: {type: DataTypes.DATE},
    updatedAt: {type: DataTypes.DATE},
}, { timestamps: false })

const Rating = sequelize.define('rating', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    reviewScore: {type: DataTypes.BOOLEAN},
    contentScore: {type: DataTypes.INTEGER},
}, { timestamps: false })

const Review = sequelize.define('review', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    category: {type: DataTypes.STRING, allowNull:false},
    tags: {type: DataTypes.STRING},
    title: {type: DataTypes.STRING, allowNull:false},
    text: {type: DataTypes.TEXT, allowNull:false},
    authorScore: {type: DataTypes.INTEGER, allowNull:false},
    usersReviewScore: {type: DataTypes.INTEGER},
    usersContentScore: {type: DataTypes.INTEGER},
    createdAt: {type: DataTypes.DATE},
})

const ReviewImage = sequelize.define('review_image', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    imageLink: {type: DataTypes.STRING, allowNull:false},
}, { timestamps: false })


User.hasMany(Review)
Review.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

Review.hasMany(Rating)
Rating.belongsTo(Review)

Review.hasMany(ReviewImage)
ReviewImage.belongsTo(Review)

module.exports = {
    User,
    Rating,
    Review,
    ReviewImage
}

