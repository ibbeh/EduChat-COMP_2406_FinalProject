const http = require ('http')
const express = require('express')
const path = require('path')
const morganLogger = require('morgan')
const routes = require('./routes/index') //Import routes

const app = express() //Create express middleware dispatcher
const PORT = process.env.PORT || 3000

app.locals.pretty = true //To generate pretty view-source code in browser


//Middleware for logging request methods and URLs
function methodLogger(request, response, next){
    console.log("METHOD LOGGER")
    console.log("================================")
    console.log("METHOD: " + request.method)
    console.log("URL:" + request.url)
    next(); //Call next middleware registered
}

//Middleware for logging request headers
function headerLogger(request, response, next){
    console.log("HEADER LOGGER:")
    console.log("Headers:")
    for(k in request.headers) {console.log(k)}
    next() //Call next middleware registered
}

//Register middleware with dispatcher (ORDER MATTERS HERE)
//Middleware

//Use morgan for HTTP request logging
app.use(morganLogger('dev'))
//Use custom loggers
app.use(methodLogger)
app.use(headerLogger)
//Use routes from the routes module
app.use(routes)

//Start the server
app.listen(PORT, err => {
    if(err) console.log(err)
    else {
          console.log(`Server listening on port: ${PORT} CTRL:-C to stop`)
          console.log(`To Test:`)
      }
  })

