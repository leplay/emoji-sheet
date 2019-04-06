const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const _ = require('lodash')
var emoji = require('./emoji.json')
var emojiListByProvider = {
  apple: [],
  emojione: [],
  twitter: []
}

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
  _.each(emoji, function (item) {
    let path = `source/img-${provider}-64/${item.unified.toLowerCase()}.png`
    if (fs.existsSync(path)) {
      allEmojiList.push(path)
      emojiListByProvider[provider].push(item)
    } else if (item.not_qualified) {
      // some emoji images use not_qualified name, e.g. 1F3F3-FE0F
      let hasNotQualifiedSource = false
      item.not_qualified.forEach(function (code) {
        path = `source/img-${provider}-64/${code.toLowerCase()}.png`
        if (fs.existsSync(path)) {
          allEmojiList.push(path)
          hasNotQualifiedSource = true
          emojiListByProvider[provider].push(item)
        }
      })
      if (!hasNotQualifiedSource) {
        allEmojiList.push(transparentPNG)
        console.log(item.short_name, item.unified, 'not exist')
      }
    } else {
      allEmojiList.push(transparentPNG)
      console.log(item.short_name, item.unified, 'not exist')
    }
  })

  await runCommand(allEmojiList, provider)
  fs.writeFile(`sheet/${provider}.json`, JSON.stringify(emojiListByProvider[provider]), function (err) {
    if (err) {
      return console.log(err)
    }
  })
}

// function generateCSS () {
//   let css = ''
//   css += `.es { background-image: url('./apple_${SIZE}.png'); }\n`
//   _.each(emoji, function (item, index) {
//     console.log(item.short_name)
//     let rowIndex = Math.floor(index / COLUMN_FULL)
//     let columnIndex = index % COLUMN_FULL
//     if (item.short_name) {
//       let emojiName = item.short_name
//       css += `.es-${emojiName} { background-position: -${SIZE * columnIndex + columnIndex * (SPACE * 2) + 1}px -${SIZE * rowIndex + rowIndex * (SPACE * 2) + 1}px; }\n`
//     }
//   })
//   fs.writeFile(`sheet/emoji-sheet.css`, css, function (err) {
//     if (err) {
//       return console.log(err)
//     }
//     console.log('CSS generated')
//   })
//   return css
// }

async function build (provider) {
  if (provider) {
    await buildAll(provider)
  } else {
    await buildAll('apple')
    await buildAll('twitter')
    await buildAll('emojione')
  }
  console.log('Build result')
  console.log('Total emoji:', Object.keys(emoji).length)
  console.log('Apple emoji count:', emojiListByProvider.apple.length)
  console.log('Emojione emoji count:', emojiListByProvider.emojione.length)
  console.log('Twitter emoji count:', emojiListByProvider.twitter.length)
  // await generateCSS()
}

const provider = process.argv[2]
build(provider)
