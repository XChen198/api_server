const cors = require('cors')
const express = require('express')
const useRouter = require('./router/user')
const userInfoRouter = require('./router/userinfo')
const joi = require('joi')
const config = require('./config')
const expressJWT = require('express-jwt')
const app = express()

// 配置cors跨域
app.use(cors())
app.use(express.urlencoded({ extended: false }))

app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] }))

app.use('/api', useRouter)
app.use('/user', userInfoRouter)

app.use((err, req, res, next) => {
    if (err instanceof joi.ValidationError) {
        return res.send({ status: 400, msg: err.message })
    }
    if (err.name === 'UnauthorizedError') {
        return res.send({ status: 401, msg: 'token is invalid' })
    }
    res.send({ status: 500, msg: err })
})


app.listen(80, () => {
    console.log('http://127.0.0.1');
})