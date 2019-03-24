#!/usr/bin/env node

/*
  Generate emoji.json
*/
const fs = require('fs')
const axios = require('axios')
const cheerio = require('cheerio')
const { formatShortName } = require('./utils')
const source = process.argv[2] || 'local'

var fetchShortNamesAndKeywords = async function () {
  let result
  if (source === 'remote') {
    let remote = await axios.get('https://unicode.org/emoji/charts/emoji-list.html')
    if (remote.status === 200) {
      fs.writeFile('./unicode/emoji-list.html', remote.data, 'utf8', (err) => { console.log(err) })
    }
    result = remote.data
  } else {
    result = fs.readFileSync('./unicode/emoji-list.html', 'utf8')
  }
  return result
}

var parseShortNamesAndKeywords = async function () {
  var result = {}
  var html = await fetchShortNamesAndKeywords()
  var $ = cheerio.load(html)
  $('table tr').each(function (trIndex, tr) {
    let unified = $(tr).find('.code').children('a').attr('name')
    if (!unified) return
    unified = unified.toUpperCase().replace(/_/g, '-')
    let shortName = formatShortName($(tr).children('td').eq(3).text())
    let keywords = $(tr).children('td').eq(4).text().split(' | ')
    result[unified] = {
      short_name: shortName,
      keywords
    }
  })
  return result
}

async function generate () {
  let result = await parseShortNamesAndKeywords()
  fs.writeFile('./dict.json', JSON.stringify(result), 'utf8', (err) => { console.log(err) })
  console.log('Generated dict:', Object.keys(result).length)
}

generate()
