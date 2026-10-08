import { execSync } from 'node:child_process'

/**
 * Gets the name of the current Git branch.
 *
 * @returns {string} The current branch name.
 */
function getCurrentBranch() {
  return execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
}

/**
 * Checks if there are uncommitted changes in the working directory.
 *
 * @returns {boolean} True if there are changes, false otherwise.
 */
function hasUncommittedChanges() {
  const status = execSync('git status --porcelain').toString().trim()
  return status !== ''
}

/**
 * Ensures that the current branch is "main".
 * Exits the process with code 1 if not on the main branch.
 */
function ensureOnMainBranch() {
  const branch = getCurrentBranch()
  if (branch !== 'main') {
    console.error(
      `❌ You're on branch "${branch}". Switch to "main" before releasing.`,
    )
    process.exit(1)
  }
}

/**
 * Ensures that the working directory has no uncommitted changes.
 * Exits the process with code 1 if changes are found.
 */
function ensureCleanWorkingDirectory() {
  if (hasUncommittedChanges()) {
    console.error(
      '❌ You have uncommitted changes. Commit or stash them first.',
    )
    process.exit(1)
  }
}

/**
 * Pulls the latest changes from the remote "main" branch.
 * Uses `git pull origin main`.
 */
function pullLatestChanges() {
  console.log('🔄 Pulling latest changes...')
  execSync('git pull origin main', { stdio: 'inherit' })
}

/**
 * Ensures that the user is authenticated with npm.
 *
 * @throws {Error} Throws if the user is not authenticated with npm.
 */
function ensureNpmAuthenticated() {
  try {
    execSync('npm whoami', { stdio: 'ignore' })
  } catch {
    throw new Error(
      'You are not authenticated with npm. Run "npm login" before releasing.',
    )
  }
}

/**
 * Publishes the package to npm with public access.
 * Uses `npm publish --access public`.
 */
function publishToNpm() {
  console.log('🚀 Publishing to npm...')
  execSync('npm publish --access public', { stdio: 'inherit' })
}

/**
 * Executes the full release process:
 * - Verifies current branch is "main"
 * - Ensures working directory is clean
 * - Pulls latest changes
 * - Ensures npm authentication
 * - Publishes to npm
 */
function release() {
  try {
    ensureOnMainBranch()
    ensureCleanWorkingDirectory()
    pullLatestChanges()
    ensureNpmAuthenticated()
    publishToNpm()
    console.log('✅ Release complete!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Release failed:', err.message)
    process.exit(1)
  }
}

release()
