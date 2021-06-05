require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const dns = require('dns');
const urlparser = require('url');
const app = express();
const shortUrl = require('./models/shortUrl');

// Basic Configuration
const port = process.env.PORT || 3000;
const dbUri = process.env['DB_URI'];

/**
 * Connects to mongo db logs connected if connection successfull
 * else logs fail
 */
try {
  mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, () =>
    console.log("connected"));
    mongoose.set('useFindAndModify', false);
} catch (error) {
  console.log("could not connect");
}
//  console.log(mongoose.connection.state);

let resObject = {};

// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

/**
 * POST API for adding new URL for shortening 
 */
app.post('/api/shorturl/new', function (req, res) {
  var urlToShorten = req.body.url;
  var body = req.body;
  console.log(body);
  // use regex to check validity of url
  var regex = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  if (regex.test(urlToShorten) === true) {
    // use dns lookup to parse and check hostname validity
    console.log(urlToShorten);
    dns.lookup(urlparser.parse(urlToShorten).hostname, (error, address) => {
      if(!address) {
        res.json({error: 'invalid url'});
      } else {
      let inputShortUrl = 1;
      resObject['original_url'] = urlToShorten;
      //sort mongo db collection by desc order to get the highest shortenurl number 
      //add by one
      shortUrl.findOne({})
                .sort({short_url: 'desc'})
                .exec((error, result) => {
                  if(!error && result != undefined) {
                    inputShortUrl = result.short_url + 1;
                  }
                  //update the entry shortenUrl number with new incremented number if already exist 
                  if(!error) {
                    shortUrl.findOneAndUpdate(
                      {original_url: urlToShorten},
                      {original_url: urlToShorten, short_url: inputShortUrl},
                      {new: true, upsert: true},
                      (error, savedUrl) => {
                        if(!error){
                          resObject['short_url']  =  savedUrl.short_url;  
                          res.json(resObject);
                        }
                      }
                    );
                  }
                });     
      } 
    })

   
  } else {
    //if regex on url fails, send invalud url response
    return res.json({error: 'invalid url'});
  }
});

/**
 * GET API call for retreiving url 
 * replace <input> with shortenUrl number
 * <project host address>/api/shorturl/<input>
 */
app.get('/api/shorturl/:input', (req, res) => {
  let input = req.params.input;

  shortUrl.findOne({short_url: input}, (error, result) => {
    if(!error && result != undefined) {
      res.redirect(result.original_url);
    } else {
      res.json('Url not found');
    }
  })
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
