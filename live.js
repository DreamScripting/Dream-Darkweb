const express = require("express");
const http = require("http");
var app = express();

// Ping The Apps.
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
    response.sendStatus(200);
});

// Request Listeners.
var listener = app.listen(process.env.PORT, function () {
    console.log(`Your app is listening on port${listener.address().port}`.bgBlue);
});