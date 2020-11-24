var express = require('express');
var url = require('url');
var app = express();
const shortid = require('shortid');
var fs = require('fs');

//порт для heroku нужен 5000
var port = 5000;

app.set('port', process.env.PORT || port);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

//редирект с http на https
app.all('*', function(req, res, next) {
	var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
	console.log("IP: " + ip + " URL: "  + fullUrl);
	next();
});

//домашняя страница
app.get('/', function(req, res) {
  res.render('index');
});

// API
app.get('/api', function(req, res) {
  let href = req.query.url;
  let regexp = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  let rnd = shortid.generate();
  if (href == undefined || regexp.test(href) == false) {
    res.json('no valid url');
  } else {
    fs.open('urls/' + rnd + '.txt', 'w', (err, data) => {
      if(err) throw err;
    });
    fs.writeFile('urls/' + rnd + '.txt', href, (err) => {
      if(err) throw err;
    });
    res.json(req.protocol + '://' + req.get('host') + '/' + rnd);
  }
});

//redirect
app.get('/:code', function(req, res, next) {
  let href = req.params.code;
  if (href == 'favicon.ico') {
    href = '123';
  }
  console.log(href);
  if (href == undefined) {
    res.json('please, write url');
  } else {
    fs.readFile('urls/' + href + '.txt', 'utf8', (err, data) => {
      if(err) {res.json('no search file =(');}
      else {
        console.log(data);
        res.redirect(data);
      }
    });
  }
});

//info
app.get('/i/:code', function(req, res, next) {
  let href = req.params.code;
  if (href == 'favicon.ico') {
    href = '123';
  }
  console.log(href);
  if (href == undefined) {
    res.json('null');
  } else {
    fs.readFile('urls/' + href + '.txt', 'utf8', (err, data) => {
      if(err) {res.json('null');}
      else {
        console.log(data);
        res.json(data);
      }
    });
  }
});

// 404 catch-all
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});

// 500 error
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
	console.log( 'Express server started on http://localhost:' +
		app.get('port') + '; press Ctrl-C to stop.' );
});
