const express = require('express');
const { getUserInfo, updateUserInfo, updatePwd, updateAvatar } = require('./router_handle/userinfo');
const expressJoi = require('@escook/express-joi')
const { update_userinfo_schema, update_pwd_schema, update_avatar_schema } = require('../schema/user')
const multer = require('multer')
const path = require('path')
const router = express.Router();

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/'),
    filename: function (req, file, cb) {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/gif') {
            return cb(new Error('File type not supported!'))
        }
        const filename = Date.now() + path.extname(file.originalname)
        cb(null, filename)
    }
})
const upload = multer({ storage })


router.get('/userinfo', getUserInfo)
router.post('/userinfo', expressJoi(update_userinfo_schema), updateUserInfo)
router.post('/updatepwd', expressJoi(update_pwd_schema), updatePwd)
router.post('/updateavatar', upload.single('avatar'), express.static(path.join(__dirname, 'public/avatar')), updateAvatar)

module.exports = router;