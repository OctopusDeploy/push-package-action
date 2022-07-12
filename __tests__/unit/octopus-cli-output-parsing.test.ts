import { info } from 'console'
import { makeInputParameters } from '../../src/input-parameters'
import { OctopusCliWrapper } from '../../src/octopus-cli-wrapper'

var infoMessages: string[]
var warnMessages: string[]
var w: OctopusCliWrapper

beforeEach(() => {
  infoMessages = []
  warnMessages = []
  w = new OctopusCliWrapper(
    makeInputParameters(),
    {},
    msg => infoMessages.push(msg),
    msg => warnMessages.push(msg)
  )
})

afterEach(() => {
  expect(warnMessages).toEqual([]) // none of our tests here should generate warnings
})

test('standard commandline processing', () => {
    w.stdline('Octopus Deploy Command Line Tool version 123')
    w.stdline('Handshaking with Octopus Server')
    w.stdline('Authenticated as: magic user that should not be revealed')
  
    expect(infoMessages).toEqual([
        '🐙 Using Octopus Deploy CLI 123...',
        '🤝 Handshaking with Octopus Deploy',
        '✅ Authenticated'
    ])
})

test('thing pushed successfully', () => {
    w.stdline('Push successful')

    expect(infoMessages).toEqual(['🎉 Push successful!'])
})

test('other lines just get passed through', () => {
    w.stdline('Push successful!') // note trailing ! means the earlier thing doesn't matc
    w.stdline('foo')
    w.stdline('bar')
    w.stdline('baz')
  
    expect(infoMessages).toEqual(['Push successful!', 'foo', 'bar', 'baz'])
  })
  
  test('filters blank lines', () => {
    w.stdline('')
    w.stdline('foo')
    w.stdline('')
  
    expect(infoMessages).toEqual(['foo'])
  })