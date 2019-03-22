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
var transparentPNG = `source/transparent-64.png`

/*
  Generate
*/

async function runCommand (files, provider) {
  let geom = `${SIZE}x${SIZE}+${SPACE}+${SPACE}`
  let dest
  let column
  let lines

  column = COLUMN_FULL
  lines = Math.ceil(files.length / column)
  dest = `sheet/${provider}_${SIZE}.png`
  let tile = `${column}x${lines}`
  let filesStr = files.join(' ')
  const command = `montage ${filesStr} -geometry ${geom} -tile ${tile} -background none png32:${dest}`

  const result = await exec(command)
  return result
}

async function buildAll (provider) {
  var allEmojiList = []
  var failedEmojiList = []
  _.each(emoji, function (item) {
    let path = `source/img-${provider}-64/${item.unified.toLowerCase()}.png`
    if (fs.existsSync(path)) {
      allEmojiList.push(path)
    } else if (item.not_qualified) {
      // some emoji images use not_qualified name, e.g. 1F3F3-FE0F
      let hasUnqulifiedName = false
      item.not_qualified.forEach(function (code) {
        path = `source/img-${provider}-64/${code.toLowerCase()}.png`
        if (fs.existsSync(path)) {
          allEmojiList.push(path)
          hasUnqulifiedName = true
        }
      })
      if (!hasUnqulifiedName) {
        allEmojiList.push(transparentPNG)
        failedEmojiList.push(item.unified)
        console.log(item.short_name, item.unified, 'not exist')
      }
    } else {
      failedEmojiList.push(item.unified)
      console.log(item.short_name, item.unified, 'not exist')
    }
  })

  let result = await runCommand(allEmojiList, provider)
  if (!result.stderr) {
    let successEmoji = _.filter(allEmojiList, function (path) {
      return path !== transparentPNG
    })
    console.log(provider, 'build success:', successEmoji.length)
    console.log(provider, 'build failed:', failedEmojiList.length)
  }
}

async function build (provider) {
  if (provider) {
    await buildAll(provider)
  } else {
    await buildAll('apple')
    await buildAll('twitter')
    await buildAll('emojione')
  }
  // await generateCSS(true)
}

const provider = process.argv[2]
build(provider)
