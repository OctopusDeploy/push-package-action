import { summary } from '@actions/core'
import { Client, PackageRepository } from '@octopusdeploy/api-client'
import glob from 'glob'
import { promisify } from 'util'
import { InputParameters } from './input-parameters'

const globp = promisify(glob)

export async function pushPackageFromInputs(client: Client, parameters: InputParameters): Promise<string[]> {
  const packages = await expandGlobs(parameters.packages)

  const repository = new PackageRepository(client, parameters.space)
  await repository.push(packages, parameters.overwriteMode)

  return packages
}

async function expandGlobs(packages: string[]): Promise<string[]> {
  const files: string[] = []

  for (const pkg of packages) {
    for (const pkgName of pkg.split(',')) {
      if (glob.hasMagic(pkgName)) {
        const pkgPaths = await globp(pkgName)
        for (const pkgPath of pkgPaths) {
          files.push(pkgPath)
        }
      } else {
        files.push(pkgName)
      }
    }
  }

  return files
}

export async function createBuildSummary(pushedPackages: string[]): Promise<void> {
  if (pushedPackages.length > 0) {
    await summary
      .addHeading(`🎉 Package${pushedPackages.length > 1 ? 's' : ''} successfully pushed to Octopus Deploy`, 3)
      .addCodeBlock(pushedPackages.map(pkg => `📦 ${pkg}`).join('\n'))
      .write()
  }
}
