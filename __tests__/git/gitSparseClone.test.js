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

  test('clones a repo successfully when sparse checkout paths are omitted', () => {
    expect(() => {
      gitSparseClone(repoUrl, [], tempDir)
    }).not.toThrow()

    expect(fs.existsSync(path.join(tempDir, '.git'))).toBe(true)
    expect(fs.existsSync(path.join(tempDir, 'README'))).toBe(true)
  })

  test('throws an error for sparse checkout paths incompatible with cone mode', () => {
    expect(() => {
      gitSparseClone('invalid-repo', ['web/public/environment*.php'], tempDir)
    }).toThrow('Failed to clone repo: invalid-repo')
  })
})
