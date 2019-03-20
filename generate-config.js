#!/usr/bin/env node

/*
  Generate emoji.json
*/
const fs = require('fs')
const axios = require('axios')
const dict = require('./dict')

var fetch = async function () {
  let result = await axios.get('https://unicode.org/Public/emoji/latest/emoji-test.txt')
  return result.data
}

var parseTxt = async function (txt) {
  if (!txt) {
    txt = await fetch()
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
      let skin = 1
      switch (true) {
        case name.indexOf('light skin tone') > 0 :
          skin = 2
          break
        case name.indexOf('medium-light skin tone') > 0 :
          skin = 3
          break
        case name.indexOf('medium skin tone') > 0 :
          skin = 4
          break
        case name.indexOf('medium-dark skin tone') > 0 :
          skin = 5
          break
        case name.indexOf('dark skin tone') > 0 :
          skin = 6
          break
      }
      var emoji = {
        name,
        native,
        unified,
        category,
        sub_category: subCategory,
        skin
      }
      if (dict[unified]) {
        emoji.short_name = dict[unified].short_name
        emoji.keywords = dict[unified].keywords
      }
      result.push(emoji)
    } else if (/^[0-9A-F]/.test(line) && /unqualified/.test(line)) {
      var lastIndex = result.length - 1
      var tmp3 = line.split(';')
      var code = tmp3[0].trim().split(' ').join('-')
      result[lastIndex].unqualified = result[lastIndex].unqualified || []
      result[lastIndex].unqualified.push(code)
    }
  })
  fs.writeFile('./emoji.json', JSON.stringify(result), 'utf8', (err) => { console.log(err) })
  return result
}

parseTxt()
