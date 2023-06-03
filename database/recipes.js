const prisma = require('./prisma')

const saveRecipe = (recipe) => {
    return prisma.recipes.create({
        data: recipe
    })
}

const getAllRecipes = (timeToFinish) => {
    return prisma.recipes.findMany({
        where: {
            timeToFinish: {
                gt: timeToFinish
            }
        }
    })
}

const getRecipesById = (id) => {
    return prisma.recipes.findFirst({
        where: {
            id
        }
    })
}

const updateRecipe = (id, recipe) => {
    return prisma.recipes.update({
        where: {
            id
        },
        data: recipe
    })
}

const deleteRecipe = (id) => {
    return prisma.recipes.delete({
        where: {
            id
        }
    })
}

const recipeByUser = (userId, recipesId) => {
    return prisma.recipeByUser.create({
        data: {
            userId: userId,
            recipesId: recipesId
        }
    })
}

module.exports = {
    saveRecipe,
    getAllRecipes,
    getRecipesById,
    updateRecipe,
    deleteRecipe,
    recipeByUser
}