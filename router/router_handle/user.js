const db = require('../../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config')

exports.register = async (req, res) => {
    const userInfo = req.body;
    // 对密码进行加密
    userInfo.password = bcrypt.hashSync(userInfo.password, 10)
    try {
        await db.addUser(userInfo)
        return res.send('register success')
    } catch (err) {
        if (err.code === 11000) {
            return res.send({ status: 400, msg: 'username already exists' })
        }
        return res.send({ status: 500, msg: 'Server exception, please try again later' })
    }
}
exports.login = async (req, res) => {
    const userInfo = req.body;
    const result = await db.findUser(userInfo.username)
    if (!result) {
        return res.send({
            status: 400,
            msg: 'username or password is invalid'
        })
    }
    // 对比密码
    const isVaild = bcrypt.compareSync(userInfo.password, result.password)
    if (!isVaild) {
        return res.send({
            status: 400,
            msg: 'login failed'
        })
    }
    const user = { _id: result._id, username: result.username, password: '', avatar: '' }
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
    res.send({
        status: 200,
        msg: 'login success',
        token: 'Bearer ' + tokenStr
    })
}