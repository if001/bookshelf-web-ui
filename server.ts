
const express = require('express');
const port = process.env.PORT || 8080;

const app = express();

app.use(express.static(__dirname + "/dist/"));

// SPA用の設定
app.get(/.*/, function(req, res) {
    res.sendfile(__dirname + "/dist/index.html");
});

app.listen(port);
// debug
console.log("Server is up");