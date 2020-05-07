export default file => {
  const splitterRegex = /^(-|M){5}$/gm
  const instructionsRegex = /(?:\n\n(.?)\n\n).?/
  const recipeString = file
    .toString('utf-8')
    .split(splitterRegex)
    .filter(recipe => !['-', 'M'].includes(recipe))
  const recipeJSON = []

  recipeString.pop()

  parseRecipe(recipeString[1])
}

const parseRecipe = recipe => {
  const recipeStack = recipe.replace(new RegExp('\r', 'g'), '').split('\n')

  const mealMasterRegexp = /^(-|m)+\sRecipe via Meal-Master(.+)$/
  const titleRegex = /(?:Title\:\s)(.+)$/
  const categoryRegex = /(?:Categories\:\s)(.+)$/
  const servingRegex = /(?:Servings\:\s)(.+)$/
  const recipeRegex = /^(?:\s)*(?<quantity>(\d+\s?\d+(\/|\.)\d+)|(\d+(\/|\.)\d+)|\d+)?(?:\s)*(?<units>[a-z]*(?:\s))?(?<ingredient>.+)?/

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

      const ingredients = { main: []}
      shiftedValue = recipeStack.shift()

      recipeJSON = { title, category, servings }
      console.dir(recipeJSON, { depth: null, colors: true })

      let leftColumn = shiftedValue.slice(0, 41).trim()
      let rightColumn = shiftedValue.slice(41).trim()

      const leftColumnIngredients = leftColumn.match(recipeRegex)
      console.log(leftColumnIngredients)

      ingredients.main.concat(leftColumn, rightColumn)
    }
  } catch (e) {
    console.log(e)
  }
}

