#!/usr/bin/env node

/*
  Generate emoji.json
*/
const fs = require('fs')
const axios = require('axios')
const _ = require('lodash')
const dict = require('./dict')
const customDict = require('./custom-dict')
const { formatShortName, parseSkinTone } = require('./utils')
let emojiCount = 0

const source = process.argv[2] || 'local'

var fetchEmoji = async function () {
  let result
  if (source === 'remote') {
    let remote = await axios.get('https://unicode.org/Public/emoji/latest/emoji-test.txt')
    if (remote.status === 200) {
      fs.writeFile('./unicode/emoji-test.txt', remote.data, 'utf8', (err) => { console.log(err) })
    }
    result = remote.data
  } else {
    result = fs.readFileSync('./unicode/emoji-test.txt', 'utf8')
  }
  return result
}

var parseEmoji = async function (txt) {
  if (!txt) {
    txt = await fetchEmoji()
  }
  var lines = txt.split(/\r\n|\r|\n/)
  var result = []
  var lastQualifiedNonSkinEmoji
  var category
  var subCategory
  lines.forEach(function (line, index) {
    // get emoji category
    if (/^# group: /.test(line)) {
      category = line.split('# group: ')[1]
    }
    // get emoji subcategory
    if (/^# subgroup: /.test(line)) {
      subCategory = line.split('# subgroup: ')[1]
    }

    if (/^[0-9A-F]/.test(line) && /fully-qualified/.test(line)) {
      let tmp1 = line.split(';')
      let tmp2 = line.split('# ')

      let unified = tmp1[0].trim().split(' ').join('-')
      let native = tmp2[1].split(' ')[0]
      let name = tmp2[1].substr(native.length + 1)
      let shortName = formatShortName(name)
      let skin = parseSkinTone(name, lines[index + 1])
      var emoji = {
        name,
        native,
        unified,
        category,
        sub_category: subCategory,
        short_name: shortName,
        skin
      }

      if (dict[unified] || customDict[unified]) {
        let keywords = dict[unified].keywords.concat(customDict[unified] ? customDict[unified].keywords : [])
        emoji.keywords = _.uniq(keywords)
      }

      if (skin === 0) {
        lastQualifiedNonSkinEmoji = emoji
      } else {
        // reset last qualified emoji skin to 1
        lastQualifiedNonSkinEmoji.skin = 1
        emoji.keywords = lastQualifiedNonSkinEmoji.keywords
      }

      result.push(emoji)
      emojiCount++
    } else if (/^[0-9A-F]/.test(line) && /unqualified|minimally-qualified/.test(line)) {
      let lastEmoji = result[result.length - 1]
      let tmp3 = line.split(';')
      let code = tmp3[0].trim().split(' ').join('-')
      lastEmoji.not_qualified = lastEmoji.not_qualified || []
      lastEmoji.not_qualified.push(code)
    }
  })
  return result
}

async function generate () {
  let result = await parseEmoji()
  fs.writeFile('./emoji.json', JSON.stringify(result), 'utf8', (err) => { console.log(err) })
  console.log('Total emoji:', emojiCount)
  console.log('Generated emoji:', result.length)
}

generate()
