export default file => {
  const splitterRegex = new RegExp(/^(-|M){5}$/, 'gm')
  const categoryRegex = new RegExp(/(?:Categories\:\s)(.+)(?:\r\n)/)
  const servingRegex = new RegExp(/(?:Servings\:\s)(.+)(?:\r\n)/)
  const instructionsRegex = new RegExp(/(?:\n\n(.?)\n\n).?/)
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

  const mealMasterRegexp = new RegExp(/^(-|m)+\sRecipe via Meal-Master(.+)$/)
  const titleRegex = new RegExp(/(?:Title\:\s)(.+)$/)
  const categoryRegex = new RegExp(/(?:Categories\:\s)(.+)$/)
  const servingRegex = new RegExp(/(?:Servings\:\s)(.+)$/)

  let recipeJSON = {}

  try {
    let shiftedValue = recipeStack.shift()

    while (!shiftedValue.trimLeft()) {
      shiftedValue = recipeStack.shift() ?? 'undefined'
      if (shiftedValue === 'undefined') break
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

      recipeJSON = { title, category, servings }
      console.dir(recipeJSON, { depth: null, colors: true })
    }
  } catch (e) {
    console.log(e)
  }
}
