var util = {
  formatShortName: function (str) {
    let result = str.toLowerCase()
    result = result.replace(/\.|’|:|,|\(|\)|“|”|/g, '')
    result = result.replace(' & ', ' ')
    result = result.replace('#', 'hash')
    result = result.replace('*', 'star')
    result = result.split(' ').join('_')
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
  }
}

module.exports = util
