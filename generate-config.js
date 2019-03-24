#!/usr/bin/env node

/*
  Generate emoji.json
*/
const fs = require('fs')
const axios = require('axios')
const _ = require('lodash')
const dict = require('./dict')
const customDict = require('./custom-dict')
const { formatShortName, parseSkinCode } = require('./utils')
let emojiCount = 0
let skinCount = 0

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
  var category
  var subCategory
  lines.forEach(function (line) {
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
      let skinCode = parseSkinCode(name)
      if (!skinCode) {
        var emoji = {
          name,
          native,
          unified,
          category,
          sub_category: subCategory,
          short_name: shortName
        }

        if (dict[unified] || customDict[unified]) {
          let keywords = dict[unified].keywords.concat(customDict[unified] ? customDict[unified].keywords : [])
          emoji.keywords = _.uniq(keywords)
        }
        result.push(emoji)
      } else {
        // To do: do not save skins for family subgroup, because some emoji combine multiple skins. e.g. 1F9D1 200D 1F91D 200D 1F9D1
        if (subCategory !== 'family') {
          let lastQulifiedNonSkinEmoji = result[result.length - 1]
          lastQulifiedNonSkinEmoji.skins = lastQulifiedNonSkinEmoji.skins || {}
          if (!lastQulifiedNonSkinEmoji.skins[skinCode]) {
            lastQulifiedNonSkinEmoji.skins[skinCode] = {
              unified
            }
            skinCount++
          }
        }
      }
      emojiCount++
    } else if (/^[0-9A-F]/.test(line) && /unqualified|minimally-qualified/.test(line)) {
      let lastQulifiedNonSkinEmoji = result[result.length - 1]
      let tmp3 = line.split(';')
      let code = tmp3[0].trim().split(' ').join('-')
      let skinCode = parseSkinCode(line)
      if (skinCode) {
        lastQulifiedNonSkinEmoji.skins[skinCode].not_qualified = lastQulifiedNonSkinEmoji.skins[skinCode].not_qualified || []
        lastQulifiedNonSkinEmoji.skins[skinCode].not_qualified.push(code)
      } else {
        lastQulifiedNonSkinEmoji.not_qualified = lastQulifiedNonSkinEmoji.not_qualified || []
        lastQulifiedNonSkinEmoji.not_qualified.push(code)
      }
    }
  })
  return result
}

async function generate () {
  let result = await parseEmoji()
  fs.writeFile('./emoji.json', JSON.stringify(result), 'utf8', (err) => { console.log(err) })
  console.log('Total emoji:', emojiCount)
  console.log('Regular emoji:', result.length)
  console.log('With skin tone:', skinCount)
  // known issue, missing emoji which have multiple skins, in subgroup: family
  console.log('Missing emoji:', emojiCount - skinCount - result.length)
}

generate()
