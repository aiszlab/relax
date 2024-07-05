import PackageJson from '@npmcli/package-json'
import { satisfies } from 'semver'

const PackageManagers = new Set(['pnpm', 'npm', 'yarn', 'node'])

const whoAmI = (userAgent?: string) => {
  if (!userAgent) return null

  const [name, version] = userAgent.split(' ')[0].split('/')

  return {
    name,
    version
  }
}

// dog `wang`!
const wang = (s: string) => {
  const lines = s.trim().split('\n')
  const width = lines.reduce((a, b) => Math.max(a, b.length), 0)
  const surround = (x: string) => '║   \x1b[0m' + x.padEnd(width) + '\x1b[31m   ║'
  const bar = '═'.repeat(width)
  const top = '\x1b[31m╔═══' + bar + '═══╗'
  const pad = surround('')
  const bottom = '╚═══' + bar + '═══╝\x1b[0m'

  console.log([top, pad, ...lines.map(surround), pad, bottom].join('\n'))
}

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
  const {
    content: { engines }
  } = await PackageJson.load('./')
  if (!engines) return

  // check `node` version
  if (engines.node && !satisfies(process.version, engines.node)) {
    wang(`Can not use "node@${process.version}" for installation in this project`)
    process.exit(1)
  }

  // check pm
  if (Array.from(PackageManagers).every((pm) => !engines[pm])) return

  const runner = whoAmI(process.env.npm_config_user_agent)
  if (!runner) {
    wang('Unknow package manager, pls try install again')
    process.exit(1)
  }

  const allowedRunnerVersion = engines[runner.name]
  if (!allowedRunnerVersion || !satisfies(runner.version, allowedRunnerVersion)) {
    wang(`Can not use "${runner.name}@${runner.version}" for installation in this project

Pls view allowd package manager@version in package.json engines settings
`)
    process.exit(1)
  }
}
