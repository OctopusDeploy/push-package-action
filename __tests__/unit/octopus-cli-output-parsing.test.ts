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
    w.stdLine('Octopus Deploy Command Line Tool version 123')
    w.stdLine('Handshaking with Octopus Server')
    w.stdLine('Authenticated as: magic user that should not be revealed')
  
    expect(infoMessages).toEqual([
        '🐙 Using Octopus Deploy CLI 123...',
        '🤝 Handshaking with Octopus Deploy',
        '✅ Authenticated'
    ])
})

test('thing pushed successfully', () => {
    w.stdLine('Push successful')

    expect(infoMessages).toEqual(['🎉 Push successful!'])
})

test('other lines just get passed through', () => {
    w.stdLine('Push successful!') // note trailing ! means the earlier thing doesn't matc
    w.stdLine('foo')
    w.stdLine('bar')
    w.stdLine('baz')
  
    expect(infoMessages).toEqual(['Push successful!', 'foo', 'bar', 'baz'])
  })
  
  test('filters blank lines', () => {
    w.stdLine('')
    w.stdLine('foo')
    w.stdLine('')
  
    expect(infoMessages).toEqual(['foo'])
  })