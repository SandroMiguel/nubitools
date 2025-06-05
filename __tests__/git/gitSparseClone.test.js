import fs from 'fs-extra'
import path from 'path'
import { gitSparseClone } from '../../src/git/gitSparseClone.js'

describe('gitSparseClone', () => {
  const baseTempDir = '/tmp'
  const testId = `nubitools-test-${Date.now()}`
  const tempDir = path.join(baseTempDir, testId)
  const repoUrl = 'https://github.com/octocat/Hello-World.git'
  const sparsePaths = ['README']

  beforeEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.removeSync(tempDir)
    }
    fs.mkdirSync(tempDir)
  })

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.removeSync(tempDir)
    }
  })

  test('clones repo with sparse checkout and checks out given paths', () => {
    expect(() => {
      gitSparseClone(repoUrl, sparsePaths, tempDir)
    }).not.toThrow()

    const readmePath = path.join(tempDir, sparsePaths[0])
    console.log('readmePath', readmePath)
    expect(fs.existsSync(readmePath)).toBe(true)
  })
})
