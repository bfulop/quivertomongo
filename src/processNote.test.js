'use strict'

const Task = require('data.task')

describe('processing a note', function () {
  var subject

  afterEach(function () {
    td.reset()
  })

  before('set up reading meta', function () {
    var _notepath = 'nbook/note1'
    var fileUtils = td.replace('./utils/fileUtils')

    td
      .when(fileUtils.readFile('nbook/note1/meta.json'))
      .thenReturn(Task.of(JSON.stringify({ shirts: 'pink' })))
    td
      .when(fileUtils.readFile('nbook/note1/content.json'))
      .thenReturn(Task.of(JSON.stringify({ shoes: 'khaki' })))

    subject = require('./processNote').processNote(_notepath)
  })

  it('returns a single Task', function (done) {
    subject.fork(console.error, r => {
      expect(r).to.eql({
        meta: { shirts: 'pink' },
        content: { shoes: 'khaki' }
      })
      done()
    })
  })
})
