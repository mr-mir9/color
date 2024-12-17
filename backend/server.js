const express = require('express')
const cors = require('cors')
const app = express()
const port = 35101

app.use(cors())

const middleware = require('./config/Middleware')
app.use(middleware)

const routes = require('./config/Routes')
app.use(routes)

app.listen(port, () => {
    console.log(`REST API программного комплекса\nдля обработки информации и оценки цветового отклонения\nполимерной пленки от эталона запущен по адресу localhost:${port}`)
})