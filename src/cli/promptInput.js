import inquirer from 'inquirer'

/**
 * generic prompt for user input with optional custom validation
 *
 * @param {string} message The message to display.
 * @param {(input: string) => boolean | string} [validate] Validation function (optional).
 *
 * @returns {Promise<string>} User input.
 */
export async function promptInput(message, validate) {
  const { input } = await inquirer.prompt([
    {
      type: 'input',
      name: 'input',
      message,
      validate,
    },
  ])

  return input
}
