const express = require('express')
const app = express()
const port = 35100

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With")
    next()
})

app.use(express.static(`${__dirname}/build`))

app.use(function(req, res, next) {
    var fs = require('fs'),
        path = require('path'),
        filePath = path.join(__dirname, 'build/index.html')
        
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            console.log('received data: ' + data);
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write(data);
            res.end();
        } else {
            console.log(err);
        }
    })
})

app.listen(port, () => {
    console.log(`Frontend APP:\n-> listening on port ${port}`)
})