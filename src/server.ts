/** @file The server-side entry point. */

import express from 'express';
import RecipeListStore from './model/recipeListStore';
import RecipeStore from './model/recipeStore';
import webpack from 'webpack';
import webpackConfig from '../webpack.config.js';
import webpackDevMiddleware from "webpack-dev-middleware";
import { checkAuthenticated, setUpAuthentication, users } from './authentication';
import { readFile } from "fs";
import { RecipeList, RecipeListBundle } from './model/recipeList';
import { seedRecipeData, seedUserListData } from './dataSeed';

const BUNDLE_FILE_NAME = "bundle.js";

const app = express();
const port = process.env.PORT || 3000;

setUpAuthentication(app);

app.set('view engine', 'ejs');

// In production, we rely on the pre-compiled bundle. In development,
// recompile on the fly.
const isProd = process.env.MODE === 'production';
if (isProd) {
    app.get("/" + BUNDLE_FILE_NAME, async (req, res) => {
        res.setHeader('Content-Type', 'text/javascript');
        readFile('dist/' + BUNDLE_FILE_NAME, (err, data) => {
            res.send(data);
        });
    });
} else {
    webpackConfig['mode'] = 'development';
    app.use(webpackDevMiddleware(webpack(webpackConfig)));
}

// Initialize our data first.
let recipeListData;
seedRecipeData().then(() => {
    // Construct an initial piece of data for the client to render immediately.
    // All recipes in a "summary" state add up to ~60 kb so it's not worth
    // doing paging/slicing and load more when scrolling.
    recipeListData = recipeStore.getAll().map(
        recipe => recipe.serialize(true /* summaryOnly */)).join('#');
});
const recipeStore = RecipeStore.getInstance();

seedUserListData();

const populateCommonTemplateData = (request, dataObj?: Object) => {
    const userListData = request.user ?
        RecipeListStore.getInstance().bundleForUser(request.user)?.serialize() : '';
    return {
        bundleUrl: '/' + BUNDLE_FILE_NAME,
        recipeListData,
        recipeDetailsData: '',
        userListData,
        user: request?.user || '',
        ...(dataObj || {}),
    }
};

///////////////////////////                   //////////////////////////
///////////////////////////   Static routes   //////////////////////////
///////////////////////////                   //////////////////////////

app.use('/img', express.static('img'));
app.use('/css', express.static('css'));
app.use('/s', express.static('static'));

////////////////////////                         ///////////////////////
////////////////////////   User-visible routes   ///////////////////////
////////////////////////                         ///////////////////////

// Home page
app.get('/', (request, response) => {
    response.render('home', populateCommonTemplateData(request));
});

app.get('/lists', checkAuthenticated, (request, response) => {
    response.render('home', populateCommonTemplateData(request));
});

app.get('/login', (request, response) => {
    response.render('login', populateCommonTemplateData(request, {
        availableUsers: users,
    }));
});


app.get('/logout', function(req, res, next) {
    req.logout((err) => {
      if (err) { return next(err); }
      res.redirect('/');
    });
});

// Recipe page as initial page load
app.get('/:recipeId', (request, response) => {
    const recipe = recipeStore.getById(request.params.recipeId);
    if (recipe) {
        response.render('home', populateCommonTemplateData(request, {
            recipeDetailsData: recipe.serialize(),
         }));
    } else {
        response.status(404).end();
    }
});

/////////////////////////                      ////////////////////////
/////////////////////////   Data-only routes   ////////////////////////
/////////////////////////                      ////////////////////////

app.get('/r/:recipeId', (request, response) => {
    const recipe = recipeStore.getById(request.params.recipeId);
    if (recipe) {
        response.send(recipe.serialize());
    } else {
        response.status(404);
    }
});

// Fetches the lists for the logged in user.
app.get('/d/lists', checkAuthenticated, (request, response) => {
    response.send(RecipeListStore.getInstance().bundleForUser(
        request.user)?.serialize());
});

// Creates a new list for the logged in user, optionally containing a first recipe.
app.get('/d/newlist', checkAuthenticated, (request, response) => {
    const query = request.query;
    RecipeListStore.getInstance().newListForUser(
        request.user, decodeURI(query.listname), query.listid,
        query.firstrecipeid);
    response.status(200).end();
});

app.get('/d/removefromlist/:listId/:recipeId', checkAuthenticated, (request, response) => {
    const list: RecipeList = RecipeListStore.getInstance().bundleForUser(
        request.user).getListById(request.params.listId);
    if (!list) {
        response.status(404).end();
    } else {
        list.remove(request.params.recipeId);
        response.status(200).end();
    }
});

app.get('/d/addtolist/:listId/:recipeId', checkAuthenticated, (request, response) => {
    const list: RecipeList = RecipeListStore.getInstance().bundleForUser(
        request.user).getListById(request.params.listId);
    if (!list) {
        response.status(404).end();
    } else {
        list.add(request.params.recipeId);
        response.status(200).end();
    }
});

app.get('/d/deletelist/:listId', checkAuthenticated, (request, response) => {
    RecipeListStore.getInstance().deleteList(request.user, request.params.listId);
    response.status(200).end();
});

app.listen(port, () => { console.log(`Listening on port ${port}. Ctrl-C to exit.`) });
