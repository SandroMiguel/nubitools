import fs from 'fs'

/**
 * Reads and parses a JSON file from the given path.
 *
 * @param {string} filePath - The path to the JSON file.
 *
 * @returns {object} Parsed JSON content.
 *
 * @throws {Error} If the file does not exist or contains invalid JSON.
 */
export function readJsonFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}
