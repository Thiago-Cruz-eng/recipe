const express = require("express");
const z = require("zod");
const router = express.Router();
const auth = require('../middleware/auth')
const {
    saveRecipe,
    getAllRecipes,
    getRecipesById,
    updateRecipe,
    deleteRecipe,
    recipeByUser
}  = require("../database/recipes")
const {ZodError} = require("zod");

const recipeSchema = z.object({
    name: z.string({
        required_error: "name is required",
        invalid_type_error: "name have to be a string"
    }),
    description: z.string({
        required_error: "description is required",
        invalid_type_error: "description have to be a string"
    }),
    timeToFinish: z.number({
        required_error: "time is required"
    }).min(1)
})

router.get("/recipes", auth, async (req, res) => {
    const timeToFinish = req.query.time_to_finish ? Number(req.query.time_to_finish) : 0;
    const recipes = await getAllRecipes(timeToFinish)
    res.json({
        recipes
    })
})

router.get("/recipes/:id", auth,async (req, res) => {
    const id = Number(req.params.id);
    const recipe = await getRecipesById(id)
    res.json({
        recipe
    })
})

router.post("/recipes", auth, async(req, res, next) => {
    try {
        const newRecipe = recipeSchema.parse(req.body)
        const recipeOnDb = await saveRecipe(newRecipe)
        res.json({
            recipe: recipeOnDb
        })
    } catch(err) {
        next(err)
    }

})

router.post("/recipe/create", auth, async (req, res) => {
    const user = req.permission
    const recipes = req.body.recipes
    console.log(user)
    for(let rec of recipes) {
        console.log(rec.id, user.userId)
        await recipeByUser(user.userId, rec.id)
    }
    res.json(
        recipes
    )
})

router.put("/recipes/:id", auth,async (req, res) => {
    const id = Number(req.params.id);
    const recipe = recipeSchema.parse(req.body)
    const updatedRecipe = await updateRecipe(id, recipe)
    res.json({
        updatedRecipe
    })
})

router.delete("/recipes/:id", auth,async (req, res) => {
    const id = Number(req.params.id);
    await deleteRecipe(id)
    res.status(204).send();
})

module.exports = {
    router
}