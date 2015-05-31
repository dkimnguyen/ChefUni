var express = require('express');
var url = require('url');
var mongoose = require('mongoose');
//var bodyParser = require('body-parser');
var app = express();
var port = process.env.port || 8010;


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
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain'});
    res.end('Hello World\n')''
}).listen(port);

//app.listen(8010);