export default file => {
  const splitterRegex = /^(-|M){5}$/gm
  const instructionsRegex = /(?:\n\n(.?)\n\n).?/
  const recipeString = file
    .toString('utf-8')
    .split(splitterRegex)
    .filter(recipe => !['-', 'M'].includes(recipe))
  const recipeJSON = []

  recipeString.pop()

  recipeString.forEach( recipe => recipeJSON.push(parseRecipe(recipe)))
  return recipeJSON
}

const parseRecipe = recipe => {
  const recipeStack = recipe.replace(new RegExp('\r', 'g'), '').split('\n')

  const mealMasterRegexp = /^(-|m)+\sRecipe via Meal-Master(.+)$/
  const titleRegex = /(?:Title\:\s)(.+)$/
  const categoryRegex = /(?:Categories\:\s)(.+)$/
  const servingRegex = /(?:Servings\:\s)(.+)$/

  let recipeJSON = {}

  try {
    let shiftedValue = recipeStack.shift()

    while (!shiftedValue.trimLeft()) {
      if (shiftedValue === undefined) throw new Error('Could not parse')
      shiftedValue = recipeStack.shift()
    }

    if (shiftedValue.match(mealMasterRegexp)) {
      recipeStack.shift()
      shiftedValue = recipeStack.shift()

      const title = shiftedValue.match(titleRegex)[1]
      shiftedValue = recipeStack.shift()

      const category = shiftedValue.match(categoryRegex)[1]
      shiftedValue = recipeStack.shift()

      const servings = shiftedValue.match(servingRegex)[1]
      shiftedValue = recipeStack.shift()

      const ingredients = {}

      let currentRecipeSection = 'main'

      //Iterate all the ingredients
      while (recipeStack[0].trim() || recipeStack[1].startsWith('---')) {
        const isNewCategory = line => line.match(/^-{3,}.+-{3,}$/)
        let ingredientStack = []

        // Iterate a ingredient block - stop at an empty line or a new category
        while (!isNewCategory(recipeStack[1]) && recipeStack[0].trim()) {
          ingredientStack.push(recipeStack.shift())
        }

        const parsedIngredients = parseIngredients(ingredientStack)
        ingredients[currentRecipeSection] = parsedIngredients
        if (isNewCategory(recipeStack[1])) {
          shiftedValue = recipeStack.shift()
          const sectionName = shiftedValue.match(/^(?:-{3,}).+-(?:{3,})$/)
        }
      }

      recipeStack.shift()
      const method = recipeStack.join('\n')
      recipeJSON = { title, category, servings, ingredients, method }
      return recipeJSON
    }
  } catch (e) { return {}}
}

const parseIngredients = ingredientsBlock => {
  const ingredientsRegex = /^(?:\s)*(?<quantity>(\d+\s?\d+(\/|\.)\d+)|(\d+(\/|\.)\d+)|\d+)?(?:\s)*(?<units>[a-z]*(?:\s))?(?<ingredient>.+)?/
  let leftColumn = []
  let rightColumn = []

  ingredientsBlock.forEach(line => {
    leftColumn.push(line.slice(0, 41))
    rightColumn.push(line.slice(41))
  })

  let ingredients = []
  const parseRow = row => {
    if (row.trim().startsWith('-')) {
      ingredients[ingredients.length - 1].ingredient.concat(row.trim())
    } else if (row.trim()) {
      const parsedRow = row.match(ingredientsRegex)

      const quantity = parsedRow.groups.quantity
        ? parsedRow.groups.quantity.trim()
        : null
      const units = parsedRow.groups.units
        ? parsedRow.groups.units.trim()
        : null
      const ingredient = parsedRow.groups.ingredient
        ? parsedRow.groups.ingredient.trim()
        : null

      ingredients.push({ quantity, units, ingredient })
    }
  }

  leftColumn.forEach(parseRow)
  rightColumn.forEach(parseRow)
  return ingredients
}
