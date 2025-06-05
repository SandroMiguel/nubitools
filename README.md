# Nubitools

**Node utilities.**

Reusable utility functions for my Node.js projects — and maybe yours too.

[![license](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](LICENSE)
[![npm version](https://img.shields.io/npm/v/nubitools)](https://www.npmjs.com/package/nubitools)
[![Dependencies](https://img.shields.io/librariesio/release/npm/nubitools)](https://libraries.io/npm/nubitools)

## Project Goals

- **Dogfood first** – Only add features actively used in real-world projects.
- **Simplicity** – Focus on small, composable functions that solve practical problems.
- **Modular** – Organized by domain (e.g., file system, git, CLI).
- **No TypeScript** – Plain JavaScript for fast prototyping and hacking.
- **MIT Licensed** – Made for personal use, but open to everyone.

## Out of Scope

- No browser or frontend utilities
- No TypeScript support or type annotations
- Not dependency-free (uses practical packages like `inquirer`)

## Installation

```bash
npm install nubitools
```

## Usage

### `promptInput(message, validate?)`

Prompt the user for input in the terminal using [Inquirer.js](https://github.com/SBoudrias/Inquirer.js), with optional input validation.

**Example:**

```js
import { promptInput } from 'nubitools'

async function main() {
    const name = await promptInput(
        'What is your name?',
        (input) => input.trim().length > 0 || 'Name cannot be empty',
    )
    console.log(`Hello, ${name}!`)
}

main()
```

### `readJsonFile(filePath)`

Reads and parses a JSON file from the given path.

- Throws if the file does not exist.
- Throws if the JSON is invalid.

```js
import { readJsonFile } from 'nubitools'

const config = readJsonFile('./config.json')
console.log(config.setting)
```

## Contributing

Want to contribute? All contributions are welcome. Read the [contributing guide](CONTRIBUTING.md).

## Questions

If you have questions tweet me at [@sandro_m_m](https://twitter.com/sandro_m_m) or [open an issue](../../issues/new).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

**~ sharing is caring ~**
