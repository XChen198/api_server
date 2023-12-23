const joi = require('joi')
const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()
const id = joi.string().required()
const nickname = joi.string()
const email = joi.string().email()
const avatar = joi.string().dataUri().required()
exports.register_schema = {
    body: {
        username,
        password,
    }
}
exports.update_userinfo_schema = {
    body: {
        id,
        nickname,
        email,
    }
}
exports.update_pwd_schema = {
    body: {
        id,
        oldPwd: password,
        newPwd: joi.not(joi.ref('oldPwd')).concat(password)
    }
}
exports.update_avatar_schema = {
    body: {
        id,
        avatar
    }
}
