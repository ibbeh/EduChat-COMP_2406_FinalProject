const http = require ('http')
const express = require('express')
const path = require('path')
const morganLogger = require('morgan')
const hbs = require('hbs') 
const routes = require('./routes/index') //Import routes

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

// Set up Handlebars view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, ROOT_DIR, 'views'));

app.use('/', routes)

//Static file serving middleware to serve static files from ROOT_DIR
app.use(express.static(path.join(__dirname, ROOT_DIR)))

app.get('/index.html', (request, response) => {
    response.render('index', { title: 'Login Page' }) //Will render index.hbs with layout.hbs as the layout
})

app.get('/', (request, response) => {
    response.render('index', { title: 'Login Page' }) //Will render index.hbs with layout.hbs as the layout
})

 
app.get('/getRegistrationForm', (request, response) => {
    //Only enter the registration form page if it is through the login page
    // if (request.headers['x-requested-with'] === 'XMLHttpRequest') {
        response.render('registration', { title: 'Registration Page', layout: false })  //Renders registration.hbs without using layout.hbs
    // } 
    // else {
        //Redirect to the home page if user tries to access the registration form page via the url
    //     response.redirect('/')
    // }
})

app.get('/getLoginForm', (request, response) => {
    if (request.headers['x-requested-with'] === 'XMLHttpRequest') {
        response.render('index', { layout: false }) //Renders without using layout.hbs
    }
    else {
        //Redirect to the home page if user tries to access this url directly
        response.redirect('/');
    }
})



//404 Handler
app.use((request, response) => {
    console.log('ERROR: File Not Found');
    response.status(404).send('404: File Not Found');
})

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

