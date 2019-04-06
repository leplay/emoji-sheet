var util = {
  formatShortName: function (str) {
    let result = str.toLowerCase()
    result = result.replace(/\.|’|:|,|\(|\)|“|”|⊛|/g, '')
    result = result.replace(' & ', ' ')
    result = result.replace('#', 'hash')
    result = result.replace('*', 'star')
    result = result.trim().split(' ').join('_')
    return result
  },
  parseSkinCode: function (name) {
    let skinCode
    let skinArr = [
      ' light skin tone',
      ' medium-light skin tone',
      ' medium skin tone',
      ' medium-dark skin tone',
      ' dark skin tone'
    ]
    switch (true) {
      case name.indexOf(skinArr[0]) > 0 :
        skinCode = '1F3FB'
        break
      case name.indexOf(skinArr[1]) > 0 :
        skinCode = '1F3FC'
        break
      case name.indexOf(skinArr[2]) > 0 :
        skinCode = '1F3FD'
        break
      case name.indexOf(skinArr[3]) > 0 :
        skinCode = '1F3FE'
        break
      case name.indexOf(skinArr[4]) > 0 :
        skinCode = '1F3FF'
        break
    }
    return skinCode
  },
  parseSkinTone: function (name) {
    let skinTone = 0
    let skinArr = [
      ' light skin tone',
      ' medium-light skin tone',
      ' medium skin tone',
      ' medium-dark skin tone',
      ' dark skin tone'
    ]
    // if emoji has multiple skin colors, reset the skin tone to 0. e.g. 1F9D1 200D 1F91D 200D 1F9D1
    if (name.match(/skin tone/g) && name.match(/skin tone/g).length > 1) {
      return skinTone
    }

    if (name.indexOf(skinArr[0]) > 0) {
      skinTone = 2
    }
    if (name.indexOf(skinArr[1]) > 0) {
      skinTone = 3
    }
    if (name.indexOf(skinArr[2]) > 0) {
      skinTone = 4
    }
    if (name.indexOf(skinArr[3]) > 0) {
      skinTone = 5
    }
    if (name.indexOf(skinArr[4]) > 0) {
      skinTone = 6
    }

    return skinTone
  }
}

module.exports = util
