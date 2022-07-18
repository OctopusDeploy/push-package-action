import { OctopusCliOutputHandler } from '../../src/octopus-cli-wrapper'
import { CaptureOutput } from '../test-helpers'

var output: CaptureOutput
var w: OctopusCliOutputHandler

beforeEach(() => {
  output = new CaptureOutput()
  w = new OctopusCliOutputHandler(output)
})

afterEach(() => {
  expect(output.warns).toEqual([]) // none of our tests here should generate warnings
})

test('standard commandline processing', () => {
  w.stdline('Octopus Deploy Command Line Tool version 123')
  w.stdline('Handshaking with Octopus Server')
  w.stdline('Authenticated as: magic user that should not be revealed')

  expect(output.infos).toEqual([
    '🐙 Using Octopus Deploy CLI 123...',
    '🤝 Handshaking with Octopus Deploy',
    '✅ Authenticated'
  ])
})

test('standard error processing also removes blank lines', () => {
  w.errline('')
  w.errline('FAILED')
  w.errline('')

  expect(output.infos).toEqual([])
  expect(output.warns).toEqual(['FAILED'])
  output.warns = [] // so the afterEach doesn't trip
})

describe('pushing a single package', () => {
  test('using only filename', () => {
    w.stdline('Pushing package: MyPackage.1.0.0.zip...')

    expect(output.infos).toEqual(['📦 Pushing MyPackage.1.0.0.zip'])
  })

  test('using full path', () => {
    w.stdline('Pushing package: /path/to/package/MyPackage.1.0.0.tar.gz...')

    expect(output.infos).toEqual(['📦 Pushing /path/to/package/MyPackage.1.0.0.tar.gz'])
  })

  test('successfully', () => {
    w.stdline('Push successful')

    expect(output.infos).toEqual(['🎉 Push successful!'])
  })
})

describe('pushing multiple packages', () => {
  test('using only filename', () => {
    w.stdline('Pushing package: MyPackage.1.0.0.zip...')
    w.stdline('Pushing package: MyOtherPackage.1.1.0.tar.gz...')

    expect(output.infos).toEqual(['📦 Pushing MyPackage.1.0.0.zip', '📦 Pushing MyOtherPackage.1.1.0.tar.gz'])
  })

  test('using full path', () => {
    w.stdline('Pushing package: /path/to/package/MyPackage.1.0.0.tar.gz...')
    w.stdline('Pushing package: /path/to/package/MyOtherPackage.1.1.0.zip...')

    expect(output.infos).toEqual([
      '📦 Pushing /path/to/package/MyPackage.1.0.0.tar.gz',
      '📦 Pushing /path/to/package/MyOtherPackage.1.1.0.zip'
    ])
  })
})

test('other lines just get passed through', () => {
  w.stdline('Creating release...!') // note trailing ! means the earlier thing doesn't match
  w.stdline('foo')
  w.stdline('bar')
  w.stdline('baz')

  expect(output.infos).toEqual(['Creating release...!', 'foo', 'bar', 'baz'])
})

test('filters blank lines', () => {
  w.stdline('')
  w.stdline('foo')
  w.stdline('')

  expect(output.infos).toEqual(['foo'])
})
