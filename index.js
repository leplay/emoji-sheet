const emoji = require('./sheet/result.json')

const data = {
  getEmoji (provider, skin) {
    let list = provider ? emoji.filter(item => item['has_emojione']) : emoji
    skin = skin || 1
    list = list.filter(item => item.skin === 0 || item.skin === skin)
    return list
  }
}

module.exports = data
