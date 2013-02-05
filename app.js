
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , request = require('request')
  , util = require('util')
  , colors = require('colors')
  
var app = express()

var server = http.createServer(app)
  , io = require('socket.io').listen(server)

/***************  Espn Fetching Module ***************/

var EspnFetch = require('./lib/espn.js')

var espn = new EspnFetch()

espn.buildUrl({limit: 25, apikey: '2a55fz6gkydr3hk9am36wsyy'})

/***************  End Espn Fetching Module ***********/

// Configure express app
app.configure(function(){
  app.set('port', process.env.PORT || 3000)
  app.set('views', __dirname + '/views')
  app.set('view engine', 'ejs')
  app.use(express.favicon())
  app.use(express.logger('dev'))
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(express.cookieParser('your secret here'))
  app.use(app.router)
  app.use(require('stylus').middleware(__dirname + '/public'))
  app.use(express.static(path.join(__dirname, 'public')))
})

app.configure('development', function(){
  app.use(express.errorHandler())
})

// Init socket.io
io.sockets.on('connection', function (socket){
  
  // emit init-headlines
  socket.emit('init-headlines', espn.cache)
  
  // Create interval to fetch new headlines...
  var f = setInterval(function(){

    espn.fetchFeed(function(json){
      
      console.log(json.headlines[0].headline + " is newest headline".blue)

      // emit headlines event
      socket.emit('headlines', json)
      
    })     
    
  }, 15000)  
  
})

io.set('log level', 1)


// Routes
app.get('/', routes.index)

server.listen(80)