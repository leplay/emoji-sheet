const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const _ = require('lodash')
var emoji = require('./emoji.json')

/*
  Config
*/
var SIZE = 64
var SPACE = 1
var COLUMN_FULL = 52
var PROVIDER = 'apple'

/*
  Generate
*/

async function runCommand (files) {
  let geom = `${SIZE}x${SIZE}+${SPACE}+${SPACE}`
  let dest
  let column
  let lines

  column = COLUMN_FULL
  lines = Math.ceil(files.length / column)
  dest = `sheet/${PROVIDER}_${SIZE}.png`
  let tile = `${column}x${lines}`
  let filesStr = files.join(' ')
  const command = `montage ${filesStr} -geometry ${geom} -tile ${tile} -background none png32:${dest}`

  const result = await exec(command)
  return result
}

async function buildAll () {
  var allEmojiList = []
  var failedEmojiList = []
  _.each(emoji, function (item) {
    let path = `source/img-${PROVIDER}-64/${item.unified.toLowerCase()}.png`
    if (fs.existsSync(path)) {
      allEmojiList.push(path)
    } else if (item.unqualified) {
      // some emoji images use unqualified name, e.g. 1F3F3-FE0F
      let hasUnqulifiedName = false
      item.unqualified.forEach(function (code) {
        path = `source/img-${PROVIDER}-64/${code.toLowerCase()}.png`
        if (fs.existsSync(path)) {
          allEmojiList.push(path)
          hasUnqulifiedName = true
        }
      })
      if (!hasUnqulifiedName) {
        failedEmojiList.push(item.unified)
        console.log(item.short_name, item.unified, 'not exist')
      }
    } else {
      failedEmojiList.push(item.unified)
      console.log(item.short_name, item.unified, 'not exist')
    }
  })

  let result = await runCommand(allEmojiList)
  if (!result.stderr) {
    console.log('Build success:', allEmojiList.length)
    console.log('Build failed:', failedEmojiList.length)
  }
}

async function build () {
  await buildAll()
  // await generateCSS(true)
}

build()
