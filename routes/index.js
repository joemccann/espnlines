
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'ESPNLines - A Realtime feed of sports headlines!' });
};