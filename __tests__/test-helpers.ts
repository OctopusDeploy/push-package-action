export class CaptureOutput {
  msgs: string[]

  constructor() {
    this.msgs = []
  }

  debug(message: string): void {
    this.msgs.push(`[DEBUG] ${message}`)
  }
  info(message: string): void {
    this.msgs.push(`[INFO] ${message}`)
  }
  warn(message: string): void {
    this.msgs.push(`[WARN]  ${message}`)
  }
  error(message: string): void {
    this.msgs.push(`[ERROR]  ${message}`)
  }

  getAllMessages(): string[] {
    return this.msgs
  }
}