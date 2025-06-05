import { promptInput } from '../src/cli/promptInput.js'

const main = async () => {
  const input = await promptInput('Say something:')
  console.log('You said:', input)
}

main()
