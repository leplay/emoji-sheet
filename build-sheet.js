const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const _ = require('lodash')
var emoji = require('./emoji.json')
var output = {}

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
  _.each(emoji, function (item, index) {
    let path = `source/img-${provider}-64/${item.unified.toLowerCase()}.png`
    if (!fs.existsSync(path)) {
      if (item.not_qualified) {
        // some emoji images use not_qualified name, e.g. 1F3F3-FE0F
        let hasNotQualifiedSource = false
        item.not_qualified.forEach(function (code) {
          path = `source/img-${provider}-64/${code.toLowerCase()}.png`
          if (fs.existsSync(path)) {
            hasNotQualifiedSource = true
          }
        })
        if (!hasNotQualifiedSource) {
          path = transparentPNG
          console.log(item.short_name, item.unified, 'not exist')
        }
      } else {
        path = transparentPNG
        console.log(item.short_name, item.unified, 'not exist')
      }
    }
    allEmojiList.push(path)

    let rowIndex = Math.floor(index / COLUMN_FULL)
    let columnIndex = index % COLUMN_FULL
    item.position = {
      x: columnIndex,
      y: rowIndex
    }
    if (path !== transparentPNG) {
      item['has_' + provider] = true
    }
    output[item.unified] = Object.assign({}, (output[item.unified] || {}), item)
  })

  await runCommand(allEmojiList, provider)
}

async function build () {
  await buildAll('apple')
  await buildAll('twitter')
  await buildAll('emojione')
  console.log('==================')
  console.log('Build result')
  let result = Object.values(output)
  console.log('Total emoji:', result.length)
  console.log('Apple emoji count:', result.filter(item => item['has_apple']).length)
  console.log('Emojione emoji count:', result.filter(item => item['has_emojione']).length)
  console.log('Twitter emoji count:', result.filter(item => item['has_twitter']).length)
  fs.writeFile(`sheet/result.json`, JSON.stringify(result), function (err) {
    if (err) {
      return console.log(err)
    }
  })
}

build()
