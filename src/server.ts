import express from "express";
import { readFile } from "fs";
import RecipeStore from "./model/recipeStore";
import webpack from 'webpack';
import webpackConfig from '../webpack.config.js';
import webpackDevMiddleware from "webpack-dev-middleware";

const BUNDLE_FILE_NAME = "bundle.js";

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

// In production, we rely on the pre-compiled bundles (one per
// language). In development, recompile on the fly.
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

// Initialize our data before getting ready to serve anything.
const recipeStore = RecipeStore.getInstance();
recipeStore.initializeFromStoredData();

// Static routes

app.use('/img', express.static('img'));
app.use('/css', express.static('css'));

app.get('/', (request, response) => {
    response.render('home', { bundleUrl: '/' + BUNDLE_FILE_NAME, recipes: recipeStore.getSlice(0, 100) });
});

app.listen(port, () => { console.log(`Listening on port ${port}. Ctrl-C to exit.`) });
