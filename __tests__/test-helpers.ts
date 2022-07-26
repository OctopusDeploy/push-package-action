import { CliOutput } from '../src/cli-util'
import { promises as fs } from 'fs'

export class CaptureOutput implements CliOutput {
  infos: string[]
  warns: string[]

  constructor() {
    this.infos = []
    this.warns = []
  }

  info(message: string): void {
    this.infos.push(message)
  }
  warn(message: string): void {
    this.warns.push(message)
  }

  getAllMessages(): string[] {
    return this.infos.concat(this.warns)
  }
}

export async function GenerateTestPackages(dirs: string[], names: string[]): Promise<void> {
  for (const dir of dirs) {
    await fs.rm(dir, {
      force: true,
      recursive: true
    })
    await fs.mkdir(dir)
  }
  for (const name of names) {
    await fs.writeFile(name, '')
  }
}
