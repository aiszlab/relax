import { createRequire } from 'module'
import PackageJson from '@npmcli/package-json'

const require = createRequire(import.meta.url)

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
  const pkgJson = await PackageJson.load('./')

  console.log(' process.version=====', process.version)
}
