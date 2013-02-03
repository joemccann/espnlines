var util = require('util')
 , EventEmitter = require('events').EventEmitter
 ;
 
/*************************************************************/

// Just better errors...

var RadErrors = function(config){
  
    var config = config || {version: 0.1}
    
    // EventEmitters inherit a single event listener, see it in action
    this.on('newListener', function(listener) {
        console.log('Event Listener: ' + listener);
    })
    
}

// extend the EventEmitter class using our RadErrors class
util.inherits(RadErrors, EventEmitter)

module.exports = RadErrors

/*************************************************************/

