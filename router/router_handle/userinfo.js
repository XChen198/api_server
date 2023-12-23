const db = require('../../db/index')
const bcrypt = require('bcryptjs')

exports.getUserInfo = async (req, res) => {
    const id = req.user._id;
    await db.getUserInfo(id).then(result => {
        console.log(result);
        result.avatar = result.avatar ? `http://47.251.69.199:3000/public/avatar?avatar=${result.avatar}` : ''
        console.log(result);
        res.send({
            status: 200,
            msg: 'ok',
            data: result
        })
    }).catch(err => {
        if (err.name === 'CastError') {
            return res.send({
                status: 400,
                msg: 'id is invalid'
            })
        }
        res.send({
            status: 500,
            msg: 'Server exception, please try again later'
        })
    })
}
exports.updateUserInfo = async (req, res) => {
    const id = req.user._id;
    const userInfo = req.body;
    const result = await db.findUserById(id)
    if (!result) {
        return res.send({
            status: 400,
            msg: 'id is invalid'
        })
    }
    await db.updateUserInfo(id, userInfo).then(result => {
        res.send({
            status: 200,
            msg: result.modifiedCount === 1 ? 'update success' : 'update fail(not modified)',
            data: result.modifiedCount === 1 ? userInfo : {}
        })
    }).catch(err => {
        // 输入的userInfo不合法
        if (err.name === 'ValidationError') {
            return res.send({
                status: 400,
                msg: 'userInfo is invalid'
            })
        }
        res.send({
            status: 500,
            msg: 'Server exception, please try again later'
        })
    })

}
exports.updatePwd = async (req, res) => {
    const id = req.body.id;
    const result = await db.findUserById(id)
    if (!result) {
        return res.send({
            status: 400,
            msg: 'id is invalid'
        })
    }
    const dboldpwd = await db.getUserPwd(id).then(result => {
        return result.password
    })
    const comparePwd = bcrypt.compareSync(req.body.oldPwd, dboldpwd)
    if (!comparePwd) {
        return res.send({
            status: 400,
            msg: 'oldPwd is invalid'
        })
    }
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
    db.updateUserInfo(id, { password: newPwd }).then(result => {
        res.send({
            status: 200,
            msg: result.modifiedCount === 1 ? 'reset password success' : 'reset password fail',
        })
    }).catch(err => {
        res.send({
            status: 500,
            msg: 'Server exception, please try again later'
        })
    })
}

exports.updateAvatar = (req, res) => {
    if (req.file) {
        const id = req.body.id;
        db.updateUserInfo(id, { avatar: `avatar/${req.file.filename}` }).then(result => {
            res.send({
                status: 200,
                msg: result.modifiedCount === 1 ? 'update avatar success' : 'update avatar fail',
                data: result.modifiedCount === 1 ? req.file.filename : ''
            })
        }).catch(err => {
            res.send({
                status: 500,
                msg: 'Server exception, please try again later'
            })
        })
    } else {
        res.status(400).send({
            status: 400,
            msg: 'avatar is invalid'
        })
    }
}
