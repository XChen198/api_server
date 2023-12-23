const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
mongoose.connect('mongodb://localhost:27017/users')
mongoose.connection.once('open', () => {
    console.log('数据库连接成功')
})
mongoose.connection.on('error', () => {
    console.log('数据库连接失败')
})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true

    },
    avatar: {
        type: String,
        default: ''
    },
    nickname: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
})
const userModel = mongoose.model('users', userSchema)
// 添加用户
function addUser(userInfo) {
    const { username, password, avatar, nickname, email } = userInfo
    const user = new userModel({
        username,
        password,
        avatar: avatar || '',
        nickname: nickname || '',
        email: email || '',
    })
    return user.save()
}
// 查找用户
function findUser(username) {
    return userModel.findOne({ username })
}
// 查找用户（根据id）
function findUserById(_id) {
    return userModel.findById({ _id })
}
// 获取用户信息
function getUserInfo(_id) {
    return userModel.findById({ _id }).select({ password: 0, __v: 0 })
}
// 获取用户密码
function getUserPwd(_id) {
    return userModel.findById({ _id }).select({ password: 1 })
}

// 更新用户信息
function updateUserInfo(_id, userInfo) {
    return userModel.updateOne({ _id }, userInfo)

}

module.exports = {
    addUser,
    findUser,
    findUserById,
    getUserInfo,
    getUserPwd,
    updateUserInfo
}
