import express from "express";
import { RecipeStore } from "./model/recipeStore";

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

// Initialize our data before getting ready to serve anything.
const recipeStore = RecipeStore.getInstance();
recipeStore.initializeFromStoredData();

// Static routes

app.use('/img', express.static('../img', {}));

app.get('/', (request, response) => {
    response.render('base', { content:  `Oh hello there, interested in my ${recipeStore.getCount()} recipes?`});
});

app.listen(port, () => { console.log(`Listening on port ${port}. Ctrl-C to exit.`) });
