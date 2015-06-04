var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , ejs = require('ejs')
  , http = require('http')
  , morgan = require('morgan')
  , bodyParser = require('body-parser')
  , methodOverride = require('method-override')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , FacebookStrategy = require('passport-facebook').Strategy;
var url = require('url');
var mongoose = require('mongoose');
//var bodyParser = require('body-parser');
var http = require('http');
var app = express();


// configure Express
//app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.engine('html', ejs.renderFile);
  //  app.use(express.logger());
  app.use(morgan('combined'));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extend: false}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.Router());
  //app.use(express.static(__dirname + '/public'));
//});



var FACEBOOK_APP_ID = "1594882817465749";
var FACEBOOK_APP_SECRET = "03e409705ea84562888c6f4147821562";



passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://chefuni.azurewebsites.net/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Windows Live profile is returned
      // to represent the logged-in user.  In a typical application, you would
      // want to associate the Windows Live account with a user record in your
      // database, and return that user instead.
      return done(null, profile);
    });
  }
));



app.set('port', process.env.PORT || 8010);

var Recipes;
var Chefs;

//put config url behind file to hide passwords and username
var mongoDBConnection = require('./db.chefUni.config');
console.log(mongoDBConnection.uri);

mongoose.connect(mongoDBConnection.uri);
mongoose.connection.on('open', function () {
    var RecipeSchema = mongoose.Schema(
        {
            name: String,
            recipeId: String,
            chefName: String,
            chefID: String,
            ingredients: [String],
            prep: String,
            description: String,
            cooktime: String,
            servings: String,
            image: String,
            instructions: [String],
            sharedWith: [String],
            comments: [String]
        },
        {collection: 'recipes'}
    );
    var ChefSchema = mongoose.Schema(
        {
            chefID: String,
            image: String,
            chefName: String,
            restaurant: String,
            description: String,
            recipeID: [String]
        },
        {collection: 'chefs'}
    );
    Recipes = mongoose.model('Recipes', RecipeSchema);
    Chefs = mongoose.model('Chefs', ChefSchema);
    console.log('models have been created');
});


function retrieveAllRecipes(res, query) {
    console.log("in retrieveAllRecipes of user id : " + query);
    var query = Recipes.find({'chefID' : query });
    query.exec(function (err, itemArray) {
        res.json(itemArray);
    });
}
function retrieveRecipeDetails( res, query){
    var query = Recipes.findOne(query);
    query.exec(function (err, recipe){
        res.json(recipe);
    });
}

function retrieveChefsList(res) {
    console.log("in retrieveChefList");
    var query = Chefs.find({});
    query.exec(function (err, itemArray){
        res.json(itemArray);
    });
}

function retrieveChefDetails( res, query){
    var query = Chefs.findOne(query);
    query.exec(function (err, chef){
        res.json(chef);
    });
}


app.use('/', express.static('./pages'));
app.use('/app/json/', express.static('./app/json'));


app.get('/app/recipeList/', function (req, res){

 if (req.isAuthenticated()) {
    console.log('\n' + '\n' + '==========================>user authenticated');

    console.log(' The user name is : ' + req.user.displayName);
    console.log(' The user id is : ' + req.user.id + '\n' + '\n' + '\n' + '\n');

     console.log('All Recipe');

    retrieveAllRecipes(res, req.user.id);
  }
  else {

    console.log('\n' + '\n' + '=========================>user UN-authenticated' + '\n' + '\n');
    res.render('/', {});
  }







});

app.get('/app/recipeList/:recipeId', function (req, res){
    var id = req.params.recipeId;
    console.log('Query one recipe with id: ' + id);
    retrieveRecipeDetails(res, {recipeId: id});
});
app.get('/app/ChefList/', function (req, res){
    console.log('All Chef');
    retrieveChefsList(res);
});

app.get('/app/ChefList/:chefId', function (req, res){
    var id = req.params.chefId;
    console.log('Query one chef with id: ' + id);
    retrieveChefDetails(res, {chefId: id});
});


http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

//----------------------------------------------------------------------------------------------------------------


//serve static content for the app from the 'pages'  directory in the app dir //
//app.use('/images', express.static('./img')); //
//app.use(express.static('./pages')); //


app.get('/layout', function(req, res){
  if (req.isAuthenticated()) {
    res.render('layout', { user: req.user });
  }
  else {
    res.render('error', {});
  }
});

//app.get('/account', ensureAuthenticated, function(req, res){
app.get('/account', function(req, res){
    if (req.isAuthenticated()) {
    console.log('=============>user authenticated');
      res.render('account', { user: req.user });
      var u = req.user;
      Object.keys(u).forEach(function (key) {
        console.log("Key:" + key);
        console.log("Value:" + u[key]);
      });
  }
  else {
    console.log('=============>user authenticated');
    res.render('error', {});
  }
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user } );
});

// Route authentication through facebook
app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['public_profile', 'email'] }),
  function(req, res){
       // this function will not be called.
  });

// Use passport to authenticate request, if fail redirect to login, else redirect to home
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// Middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
