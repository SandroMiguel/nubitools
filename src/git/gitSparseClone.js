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

  const hasPatterns = sparsePaths.some((sparsePath) =>
    /[*?[\]\\]/.test(sparsePath),
  )

  if (hasPatterns) {
    throw new Error(
      `Invalid sparse checkout path for cone mode: ${sparsePaths
        .filter((sparsePath) => /[*?[\]\\]/.test(sparsePath))
        .map((sparsePath) => `"${sparsePath}"`)
        .join(', ')}`,
    )
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
    throw new Error(
      `Failed to set sparse checkout paths: ${sparsePaths
        .map((sparsePath) => `"${sparsePath}"`)
        .join(', ')}`,
    )
  }

  const checkout = spawnSync('git', ['checkout'], {
    cwd: targetDir,
    stdio: 'inherit',
  })

  if (checkout.status !== 0) {
    throw new Error('Failed to checkout files')
  }
}
