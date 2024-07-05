import { createRequire } from 'module'
import PackageJson from '@npmcli/package-json'
import { join } from 'path'
import spawn from 'cross-spawn'
import { SemVer } from 'semver'

const require = createRequire(import.meta.url)

const PackageManagers = new Set(['pnpm', 'npm', 'yarn', 'node'])

/**
 * @description
 * at preinstall step
 * we need to check 2 items:
 * 1. node version
 * 2. package manager & package manager version
 *
 * we use package.json `engines` settings to resolve
 */
export const preinstall = async () => {
  const pkgJson = await PackageJson.load('./package.json')

  const isAllowed = Array.from(PackageManagers).reduce((_isAllowed, pm) => {
    if (!pkgJson.content.engines?.['pm']) {
      return _isAllowed
    }

    const pmVersion = spawn.sync(pm, ['-v'], {
      stdio: 'inherit'
    })

    return _isAllowed && se
  }, true)

  //

  console.log('pmVersion====', pmVersion)
  console.log(' process.version=====', process.version)
}
