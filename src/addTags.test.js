const R = require('ramda')
const { of } = require('folktale/concurrency/task')
jest.mock('./utils/fileUtils')
var fileUtils = require('./utils/fileUtils')

jest.mock('./getconfig')
let getconfig = require('./getconfig')
getconfig.mockReturnValue(
  of({
    dictionary: [
      { name: 'tag1', related: ['blah', 'foo'] },
      { name: 'tag2', related: ['blah2', 'foo2'] },
      { name: 'tag3', related: ['blah3', 'foo3'] },
      { name: 'tag4', related: ['relatedtg4'] },
      { name: 'tag5', related: ['relatedtg5'] },
      { name: 'containsquiver', related: ['starttag'] },
      { name: 'tag6', related: ['relatedtg6']}
    ]
  })
)

const notedata = {
  meta: {
    tags: ['starttag', 'unusedtag']
  },
  content: {
    title: 'shoes pants shirts tag1 tag2 relatedtg5',
    cells: [
      {
        type: 'hats',
        data: 'socks shoes shirts tag2'
      },
      {
        type: 'tag3',
        data: 'socks relatedtg4 shoes shirts tag2'
      }
    ]
  },
  nbook: {
    'name': 'pants relatedtg6'
  }
}

describe('calculating the tags', () => {
  let subject
  beforeAll(done => {
    const findTags = require('./addTags').findTags
    subject = findTags(notedata).run().future()
    subject.map(() => done())
  })

  test('all contents retained', () => {
    subject.map(r => {
      expect(r).toMatchObject(R.dissocPath(['meta', 'tags'], notedata))
    })
  })
  test('adds from the title', () => {
    subject.map(r => {
      expect(r.meta.tags).toContain('tag1')
    })
  })
  test('adds content tags', () => {
    subject.map(r => {
      expect(r.meta.tags).toContain('tag2')
      expect(r.meta.tags).toContain('tag4')
    })
  })
  test('filters NOT dictionary tags', () => {
    subject.map(r => {
      expect(r.meta.tags).not.toContain('starttag')
    })
  })
  test('adds dictionary tag', () => {
    subject.map(r => {
      expect(r.meta.tags).toContain('containsquiver')
    })
  })
  test('does not contain empty values', () => {
    subject.map(r => {
      expect(r.meta.tags).not.toContain(undefined)
    })
  })
  test('considers notebook title (name)', () => {
    subject.map(r => {
      expect(r.meta.tags).toContain('tag6')
    })
  })
})
