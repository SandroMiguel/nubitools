import { readJsonFile } from '../../src/fs/readJsonFile.js'
import fs from 'fs'
import path from 'path'

const tempFile = path.join(process.cwd(), 'test-temp.json')
const invalidFile = path.join(process.cwd(), 'invalid-temp.json')
const missingFile = path.join(process.cwd(), 'missing-temp.json')

describe('readJsonFile', () => {
  beforeAll(() => {
    fs.writeFileSync(tempFile, JSON.stringify({ hello: 'world' }), 'utf8')
    fs.writeFileSync(invalidFile, '{ invalidJson: true', 'utf8') // missing closing brace
  })

  afterAll(() => {
    fs.unlinkSync(tempFile)
    fs.unlinkSync(invalidFile)
  })

  it('reads and parses a valid JSON file', () => {
    const data = readJsonFile(tempFile)
    expect(data).toEqual({ hello: 'world' })
  })

  it('throws an error if the file does not exist', () => {
    expect(() => readJsonFile(missingFile)).toThrow(/File not found/)
  })

  it('throws an error if the JSON is invalid', () => {
    expect(() => readJsonFile(invalidFile)).toThrow(SyntaxError)
  })
})
