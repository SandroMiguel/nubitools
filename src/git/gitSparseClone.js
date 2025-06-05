import fs from 'fs'
import { spawnSync } from 'child_process'

/**
 * Clones a Git repository with sparse checkout enabled and checks out only specified paths.
 *
 * @param {string} repoUrl - The URL of the Git repository to clone.
 * @param {string[]} sparsePaths - Array of file or directory paths to sparse checkout.
 * @param {string} targetDir - The target directory where the repo will be cloned.
 *
 * @throws {Error} Throws if any git command fails during clone, sparse checkout init, set, or checkout.
 */
export function gitSparseClone(repoUrl, sparsePaths, targetDir) {
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true })
  }
  console.log(`🌀 Cloning ${repoUrl} into ${targetDir}...`)
  const clone = spawnSync(
    'git',
    ['clone', '--filter=blob:none', '--no-checkout', repoUrl, targetDir],
    { stdio: 'inherit' },
  )
  if (clone.status !== 0) {
    throw new Error(`Failed to clone repo: ${repoUrl}`)
  }

  const sparseInit = spawnSync('git', ['sparse-checkout', 'init', '--cone'], {
    cwd: targetDir,
    stdio: 'inherit',
  })
  if (sparseInit.status !== 0) {
    throw new Error('Failed to init sparse checkout')
  }

  const sparseSet = spawnSync(
    'git',
    ['sparse-checkout', 'set', ...sparsePaths],
    { cwd: targetDir, stdio: 'inherit' },
  )
  if (sparseSet.status !== 0) {
    throw new Error('Failed to set sparse checkout paths')
  }

  const checkout = spawnSync('git', ['checkout'], {
    cwd: targetDir,
    stdio: 'inherit',
  })
  if (checkout.status !== 0) {
    throw new Error('Failed to checkout files')
  }
}
