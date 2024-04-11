/*
COMP 2406 Final Term Project
By Ibraheem Refai
101259968
April 10, 2024
*/

const http = require ('http')
const express = require('express')
const path = require('path')
const morganLogger = require('morgan')
const hbs = require('hbs') 
const routes = require('./routes/index') //Requiring custom module for routes
const session = require('express-session')

//Requiring custom module chat server
const chatServer = require('./routes/chatServer')


const app = express() //Create express middleware dispatcher
const PORT = process.env.PORT || 3000
const ROOT_DIR = '../client' //Root directory to serve static client side files from

app.locals.pretty = true //To generate pretty view-source code in browser


//Middleware for logging request methods and URLs
function methodLogger(request, response, next){
    console.log("METHOD LOGGER")
    console.log("================================")
    console.log("METHOD: " + request.method)
    console.log("URL:" + request.url)
    next() //Call next middleware registered
}

//Middleware for logging request headers
function headerLogger(request, response, next){
    console.log("HEADER LOGGER:")
    console.log("Headers:")
    for(k in request.headers) {console.log(k)}
    next() //Call next middleware registered
}

//Middleware to ensure user is logged in before being able to view certain pages
function confirmAuthentication(request, response, next) {
    if (request.session.loggedIn) {
      next() //Proceed to next middleware
    } else {
      response.status(403).send('Unauthorized: Ensure you are logged in.')
    }
  }
  
//Register middleware with dispatcher (ORDER MATTERS HERE)
//Middleware

//JSON parsing middleware
app.use(express.json())

//Use morgan for HTTP request logging
app.use(morganLogger('dev'))

//Use custom loggers
//app.use(methodLogger)
//app.use(headerLogger)

//Express session middleware
app.use(session({
    secret: 'secret_key', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !true }
}))


//Use routes from the routes module
app.use(routes)

//Set up Handlebars view engine
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, ROOT_DIR, 'views'))

app.use('/', routes)

app.use(chatServer)

//Static file serving middleware to serve static files from ROOT_DIR
app.use(express.static(path.join(__dirname, ROOT_DIR)))

app.get('/index.html', (request, response) => {
    response.render('index', { title: 'EduChat' }) //Will render index.hbs with layout.hbs as the layout
})

app.get('/', (request, response) => {
    response.render('index', { title: 'EduChat' }) //Will render index.hbs with layout.hbs as the layout
})

app.get('/getRegistrationForm',  (request, response) => {
    response.render('registration', { title: 'Registration Page', layout: false })  //Renders registration.hbs without using layout.hbs
})

app.get('/getLoginForm', (request, response) => {
    response.render('index', { layout: false }) //Renders without using layout.hbs
})

app.get('/chatroom', confirmAuthentication, (request, response) => {
    response.render('chatroom', { title: 'Chatroom' })
})


//404 Handler
app.use((request, response) => {
    console.log('ERROR: File Not Found');
    response.status(404).send('404: File Not Found');
})
  

//Start the server
app.listen(PORT, err => {
    if(err) console.log(err)
    else {
          console.log(`Server listening on port: ${PORT} CTRL:-C to stop`)
          console.log(`To Test:`)
          console.log('http://localhost:3000/')
          console.log('http://localhost:3000/index.html')
		  console.log('http://localhost:3000/viewUsers')
      }
  })

