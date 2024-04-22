import express from 'express';
import RecipeStore from './model/recipeStore';
import seedData from './dataSeed';
import webpack from 'webpack';
import webpackConfig from '../webpack.config.js';
import webpackDevMiddleware from "webpack-dev-middleware";
import { checkAuthenticated, setUpAuthentication, users } from './authentication';
import { readFile } from "fs";

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
seedData().then(() => {
    // Construct an initial piece of data for the client to render immediately.
    // All recipes in a "summary" state add up to ~60 kb so it's not worth
    // doing paging/slicing and load more when scrolling.
    recipeListData = recipeStore.getAll().map(
        recipe => recipe.serialize(true /* summaryOnly */)).join('#');
});
const recipeStore = RecipeStore.getInstance();

const populateCommonTemplateData = (request, dataObj: Object,
        includeRecipeList?: boolean) => {
    return {
        bundleUrl: '/' + BUNDLE_FILE_NAME,
        recipeListData: includeRecipeList ? recipeListData : '',
        recipeDetailsData: '',
        user: request?.user || '',
        ...dataObj,
    }
};

// Static routes

app.use('/img', express.static('img'));
app.use('/css', express.static('css'));

// User-visible routes

// Home page
app.get('/', (request, response) => {
    response.render('home',
        populateCommonTemplateData(request, {}, true /* includeRecipeList */));
});

app.get('/lists', checkAuthenticated, (request, response) => {
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
         }, true /* includeRecipeList */));
    } else {
        response.status(404).end();
    }
});

app.get('/favicon.ico', (request, response) => {
    // TODO: Add a favicon.
    response.status(404).end();
});

// Data-only routes

app.get('/r/:recipeId', (request, response) => {
    const recipe = recipeStore.getById(request.params.recipeId);
    if (recipe) {
        response.send(recipe.serialize());
    } else {
        response.status(404);
    }
});

app.get('/d/lists', checkAuthenticated, (request, response) => {
    response.send('Booh');
});

app.listen(port, () => { console.log(`Listening on port ${port}. Ctrl-C to exit.`) });
