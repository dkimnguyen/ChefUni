var express = require('express');
var url = require('url');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();
app.set('port', process.env.PORT || 8010);
app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//serve static content for the app from the 'pages'  directory in the app dir //
//app.use('/images', express.static('./img')); //
//app.use(express.static('./pages')); //

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
            shareWith: [String],
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


function retrieveAllRecipes(res) {
    console.log("in retrieveAllRecipes");
    var query = Recipes.find({});
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
    console.log('All Recipe');
    retrieveAllRecipes(res);
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
//updating the comment on a recipe
app.put('/app/recipeList/:recipeId', jsonParser, function(req, res) {
  var id = req.params.recipeId;
    return Recipes.find({recipeId: id}, function (err, recipe) {
        recipe.comments = req.body.comments;
        return Recipes.update({recipeId: id}, {comments: recipe.comments}, function (err) {
            if (!err) {
                console.log("updated");
            } else {
              console.log("in error");
                console.log(err);
            }
        });
        if(err){
          console.log(err);
        }
    });
    res.sendStatus(200);
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});