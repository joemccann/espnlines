/*  Espn Fetching Module */

var request = require('request')
  , colors = require('colors')
  , RadErrors = require('./raderrors.js')

// For event emitted errors...
var raderrors = new RadErrors()

// Setup event emitter handlers...
raderrors.on('request-error', function(e){
    console.log('request-error fired')
    console.dir(e)
})

raderrors.on('no-headlines-error', function(msg){
    console.log('no-headlines-error fired')
    console.log(msg)
})

function EspnFetch(options){
  var options = options || {}
  this.apikey = options.apikey || '2a55fz6gkydr3hk9am36wsyy'
  this.limit = options.limit || '3'
  this.insider = options.insider || 'no'
  this.baseurl = options.baseurl || 'http://api.espn.com/v1/sports/'
  this.sportName = options.sportName || 'news/'
  this.url = '{baseurl}{sportName}?insider={insider}&limit={limit}&apikey={apikey}'
}

EspnFetch.prototype.buildUrl = function(options){

  // http://api.espn.com/v1/sports/football/nfl/news/?limit={limit}&apikey={apikey}

  var options = options || {}
  
  this.url = this
              .url
              .replace('{baseurl}', options.baseurl || this.baseurl)
              .replace('{sportName}', options.sportName || this.sportName)
              .replace('{insider}', options.insider || this.insider)
              .replace('{limit}', options.limit || this.limit)
              .replace('{apikey}', options.apikey || this.apikey)
  
}

EspnFetch.prototype.fetchFeed = function(cb){

  /*** This fails on purpose ***/
  // request('http://fads', function(e,r,b){
  //   if(e) return raderrors.emit('request-error',e)
  //   console.dir(b)
  // })
  
  var self = this
  
  request(self.url, function(e,r,b){
    
    if(e) return raderrors.emit('request-error', e)
    
    var json = JSON.parse(b)
    
    // If headlines and there are more than zero of them...
    if(json.headlines && json.headlines.length){
      
      // If the id is the same, don't do anything but return
      if(json.headlines[0].id === self.latestHeadlineId){
        // console.log("No new headlines at " + (new Date).toLocaleTimeString())
        self.cache = json
        return
      }
      
      console.log("New Headlines at: ".yellow + (new Date).toLocaleTimeString().green)
      
      // Stash for later
      self.latestHeadlineId = json.headlines[0].id
      self.cache = json

      // fire cb
      cb && cb(json)
      
    }
    else{
      if(e) return raderrors.emit('no-headlines-error', 'No headlines from ESPN.')
    }
    
  }) // end request()
  
}

module.exports = EspnFetch