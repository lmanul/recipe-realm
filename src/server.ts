import express from "express";
import ejs from "ejs";
import { RecipeStore } from "./model/recipeStore";

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

// Initialize our data before getting ready to serve anything.
const recipeStore = RecipeStore.getInstance();
recipeStore.initializeFromStoredData();

// Static routes

app.use('/img', express.static('img'));
app.use('/css', express.static('css'));

app.get('/', (request, response) => {
    response.render('home', { recipes: recipeStore.getSlice(0, 100) });
});

app.listen(port, () => { console.log(`Listening on port ${port}. Ctrl-C to exit.`) });
