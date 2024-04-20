import express from "express";
import { RecipeStore } from "./model/recipeStore";

export const app = express();
const port = process.env.PORT || 3000;

// Initialize our data before getting ready to serve anything.
const recipeStore = RecipeStore.getInstance();
recipeStore.initializeFromStoredData();

app.get('/', (request, response) => {
    response.send(`Oh hello there, interested in my ${recipeStore.getCount()} recipes?`);
});

app.listen(port, () => { console.log(`Listening on port ${port}. Ctrl-C to exit.`) });
