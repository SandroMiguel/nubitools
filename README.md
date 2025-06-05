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

### `gitSparseClone(repoUrl, sparsePaths, targetDir)`

Clones a Git repository using sparse checkout, so only the specified files or directories are checked out.  
This is useful to save bandwidth and disk space when you only need parts of a large repo.

- **repoUrl**: URL of the Git repository to clone.
- **sparsePaths**: Array of paths (files or directories) to include in the sparse checkout.
- **targetDir**: Directory where the repository will be cloned.

Throws an error if any git command fails during the cloning or sparse checkout process.

**Example:**

```js
import { gitSparseClone } from 'nubitools'

const repoUrl = 'https://github.com/octocat/Hello-World.git'
const sparsePaths = ['README.md', 'docs/']
const targetDir = '/tmp/hello-world'

try {
    gitSparseClone(repoUrl, sparsePaths, targetDir)
    console.log('Repository cloned with sparse checkout!')
} catch (err) {
    console.error('Failed to clone repository:', err.message)
}
```

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
