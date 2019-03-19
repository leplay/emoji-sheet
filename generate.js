#!/usr/bin/env node

/*
  Generate emoji.json
*/
var fs = require('fs')
var axios = require('axios')
var dict = require('./dict')

var fetch = async function () {
  var result = await axios.get('https://unicode.org/Public/emoji/latest/emoji-test.txt')
  return result.data
}

var parseTxt = async function (txt) {
  if (!txt) {
    txt = await fetch()
  }
  var lines = txt.split(/\r\n|\r|\n/)
  var result = []
  var category
  var sub_category
  lines.forEach(function (line) {
    // get emoji category
    if (/^# group: /.test(line)) {
      category = line.split('# group: ')[1]
    }
    // get emoji subcategory
    if (/^# subgroup: /.test(line)) {
      sub_category = line.split('# subgroup: ')[1]
    }

    if (/^[0-9A-F]/.test(line) && /fully-qualified/.test(line)) {
      var tmp = line.split(';')
      var tmp2 = line.split('# ')

      var unified = tmp[0].trim().split(' ').join('-')
      var native = tmp2[1].split(' ')[0]
      var name = tmp2[1].substr(native.length + 1)
      var skin = 1
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
        sub_category,
        skin
      }
      if (dict[unified]) {
        emoji.short_name = dict[unified].short_name
        emoji.keywords = dict[unified].keywords
      }
      result.push(emoji)
    }
  })
  fs.writeFile('./emoji.json', JSON.stringify(result), 'utf8', (err) => {})
  return result
}

parseTxt()
