import fs from 'fs-extra'
import path from 'path'
import { spawnSync } from 'child_process'
import { gitSparseClone } from '../../src/git/gitSparseClone.js'

describe('gitSparseClone', () => {
  const baseTempDir = '/tmp'
  const testId = `nubitools-test-${Date.now()}`
  const tempDir = path.join(baseTempDir, testId)
  const repoDir = path.join(baseTempDir, `${testId}-repo`)
  const repoUrl = 'https://github.com/octocat/Hello-World.git'
  const sparsePaths = ['README']

  /**
   * Runs a Git command in the specified working directory.
   *
   * @param {string[]} args - The arguments to pass to Git.
   * @param {string} cwd - The working directory where Git should run.
   * @throws {Error} Throws if the Git command fails.
   */
  const runGit = (args, cwd) => {
    const result = spawnSync('git', args, {
      cwd,
      stdio: 'inherit',
    })

    if (result.status !== 0) {
      throw new Error(`Git command failed: git ${args.join(' ')}`)
    }
  }

  /**
   * Creates a temporary Git repository with files used to test sparse checkout patterns.
   *
   * @returns {void}
   */
  const createTestRepo = () => {
    fs.mkdirSync(repoDir, { recursive: true })
    runGit(['init'], repoDir)
    runGit(['config', 'user.email', 'test@example.com'], repoDir)
    runGit(['config', 'user.name', 'Test User'], repoDir)

    fs.mkdirSync(path.join(repoDir, 'web/public'), { recursive: true })
    fs.writeFileSync(path.join(repoDir, 'README.md'), 'README')
    fs.writeFileSync(
      path.join(repoDir, 'web/public/environment.php'),
      'environment',
    )
    fs.writeFileSync(
      path.join(repoDir, 'web/public/environment.dev.php'),
      'environment dev',
    )
    fs.writeFileSync(path.join(repoDir, 'web/public/index.php'), 'index')

    runGit(['add', '.'], repoDir)
    runGit(['commit', '-m', 'Initial test repository'], repoDir)
  }

  beforeEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.removeSync(tempDir)
    }
    if (fs.existsSync(repoDir)) {
      fs.removeSync(repoDir)
    }

    fs.mkdirSync(tempDir)
  })

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.removeSync(tempDir)
    }
    if (fs.existsSync(repoDir)) {
      fs.removeSync(repoDir)
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

  test('clones a repo with a sparse checkout pattern', () => {
    createTestRepo()

    expect(() => {
      gitSparseClone(repoDir, ['web/public/environment*.php'], tempDir)
    }).not.toThrow()

    expect(
      fs.existsSync(path.join(tempDir, 'web/public/environment.php')),
    ).toBe(true)
    expect(
      fs.existsSync(path.join(tempDir, 'web/public/environment.dev.php')),
    ).toBe(true)
    expect(fs.existsSync(path.join(tempDir, 'web/public/index.php'))).toBe(
      false,
    )
    expect(fs.existsSync(path.join(tempDir, 'README.md'))).toBe(false)
  })

  test('clones a repo with mixed sparse checkout paths', () => {
    createTestRepo()

    expect(() => {
      gitSparseClone(
        repoDir,
        ['web/public/environment*.php', 'README.md'],
        tempDir,
      )
    }).not.toThrow()

    expect(
      fs.existsSync(path.join(tempDir, 'web/public/environment.php')),
    ).toBe(true)
    expect(
      fs.existsSync(path.join(tempDir, 'web/public/environment.dev.php')),
    ).toBe(true)
    expect(fs.existsSync(path.join(tempDir, 'README.md'))).toBe(true)
    expect(fs.existsSync(path.join(tempDir, 'web/public/index.php'))).toBe(
      false,
    )
  })
})
