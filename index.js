const express = require('express')
const app = express()

app.use(express.static(__dirname + '/public/avatar'))


app.get('/public/avatar', (req, res) => {
    console.log(req.query);
    res.sendFile(__dirname + `/public/avatar/${req.query.avatar}`)
})


app.listen(3000, () => {
    console.log('静态资源服务器启动成功')
})