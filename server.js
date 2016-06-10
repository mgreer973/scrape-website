var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(express.static('public'));

//Database configuration
mongoose.connect('mongodb://localhost/scrapenhl');
var db = mongoose.connection;

db.on('error', function (err) {
console.log('Mongoose Error: ', err);
});
db.once('open', function () {
console.log('Mongoose connection successful.');
});

//Require Schemas
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');

// Routes
app.get('/', function(req, res) {
  res.send(index.html);
});

app.get('/scrape', function(req, res) {
	console.log('get scrape');
  request('https://www.nhl.com/', function(error, response, html) {
    var $ = cheerio.load(html);
    $('h4.headline-link').each(function(i, element) {
		var title = $(this).text();
    var summary = $(this).next().text();
  	console.log('title ', title);
		var result = {};
		result.title = title;
		result.summary = summary;
		var entry = new Article (result);
		Article.count({"title": title}, function (err, count){
		console.log('count ', count); 
    if (count==0){
    		console.log('result ', result);
        //document not exists });
        entry.save(function(err, doc) {
				  if (err) {
				    console.log('save err ' , err);
				  } else {
				    console.log('save doc', doc);
				  }
				});
    }
}); 			

    });
  });
  var returnJson = {"scrape" : "Complete"};
  res.json(returnJson);
});

app.get('/articles', function(req, res){
	Article.find({}, function(err, doc){
		if (err){
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});

app.get('/articles/:id', function(req, res){
	Article.findOne({'_id': req.params.id})
	.populate('note')
	.exec(function(err, doc){
		if (err){
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});

app.post('/articles/:id', function(req, res){
	var newNote = new Note(req.body);

	newNote.save(function(err, doc){
		if(err){
			console.log(err);
		} else {
			Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
			.exec(function(err, doc){
				if (err){
					console.log(err);
				} else {
					res.send(doc);
				}
			});
		}
	});
});

//app.get('/delete/:id', function(req, res){
app.get('/delete', function(req, res){
	console.log('b ', req.query);
	console.log('in delete');
req.query.articleIdte = req.query.articleId

	Article.update({'_id': req.query.articleId},{$unset: {note:1}}, function(err, user) {
	
		if (err){
			console.log(err);
		} else {
			console.log('done')
//			res.json(doc);
				var delJson = {"delete" : "Complete"};
  			res.json(delJson);
		}
	});

	Note.findByIdAndRemove(req.query.noteId, function(err) {
  if (err) throw err;

  // we have deleted the user
  console.log('User deleted!');
});


});


app.listen(3000, function() {
  console.log('App running on port 3000!');
});
