const express = require('express')
const { register, login } = require('./router_handle/user')
const expressJoi = require('@escook/express-joi')
const { register_schema } = require('../schema/user')

const router = express.Router()

router.post('/register', expressJoi(register_schema), register)

router.post('/login', expressJoi(register_schema), login)

module.exports = router